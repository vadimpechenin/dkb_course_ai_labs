from app.crud.settings import SettingsCRUD
from app.core.settings import WEIGHTS_DIR, BACKUP_DIR
from sqlalchemy import text
import csv
import json
import os
import shutil
import tarfile
import tempfile

from pathlib import Path
from typing import Any

class SettingsService:

    def __init__(
        self,
        session
    ):
        #TODO лучше конечно session вообще убрать в CRUD, но пока так
        self.session = session
        self.crud = SettingsCRUD(
            session
        )

    def get_settings(self):

        active_run = (
            self.crud.get_active_training_run()
        )

        return {
            "weights_dir":
                WEIGHTS_DIR,

            "models_count":
                self.crud.get_models_count(),

            "features_count":
                self.crud.get_features_count(),

            "enabled_features_count":
                self.crud.get_enabled_features_count(),

            "active_model":
                (
                    active_run.model.name
                    if active_run
                    else None
                ),

            "active_training_run":
                (
                    active_run.id
                    if active_run
                    else None
                )
        }


    def reset_database(self):

        """
        Полностью восстанавливает исходное состояние лаборатории
        из initial.tar.gz.
        """

        self._restore_initial_operations()

        return {
            "success": True,
            "message": "Исходное состояние успешно восстановлено."
        }

    # =========================================================
    # RESTORE
    # =========================================================

    def _restore_initial_operations(self):

        """
        Восстановление исходных данных из initial.tar.gz.

        Архив должен содержать:

            initial/
                operations.csv
                feature_settings.csv
                ml_models.csv
                metadata.json
        """
        backup_dir = Path(BACKUP_DIR)
        if not backup_dir.exists():

            raise FileNotFoundError(
                f"Архив исходного состояния не найден: "
                f"{BACKUP_DIR}"
            )

        # -----------------------------------------------------
        # 1. Временная директория
        # -----------------------------------------------------

        temporary_directory = Path(
            tempfile.mkdtemp(
                prefix="initial_restore_"
            )
        )

        try:

            # -------------------------------------------------
            # 2. Распаковка
            # -------------------------------------------------

            self._extract_initial_archive(
                backup_dir,
                temporary_directory
            )

            # -------------------------------------------------
            # 3. Поиск файлов
            # -------------------------------------------------

            initial_directory = (
                self._find_initial_directory(
                    temporary_directory
                )
            )

            operations_file = (
                initial_directory /
                "operations.csv"
            )

            feature_settings_file = (
                initial_directory /
                "feature_settings.csv"
            )

            ml_models_file = (
                initial_directory /
                "ml_models.csv"
            )

            metadata_file = (
                initial_directory /
                "metadata.json"
            )

            # -------------------------------------------------
            # 4. Проверка файлов
            # -------------------------------------------------

            self._check_required_file(
                operations_file
            )

            self._check_required_file(
                feature_settings_file
            )

            self._check_required_file(
                ml_models_file
            )

            self._check_required_file(
                metadata_file
            )

            # -------------------------------------------------
            # 5. Проверяем metadata.json
            # -------------------------------------------------

            metadata = self._load_metadata(
                metadata_file
            )

            self._validate_metadata(
                metadata
            )

            # -------------------------------------------------
            # 6. Загружаем CSV
            # -------------------------------------------------

            operations = self._read_csv(
                operations_file
            )

            feature_settings = self._read_csv(
                feature_settings_file
            )

            ml_models = self._read_csv(
                ml_models_file
            )

            # -------------------------------------------------
            # 7. Проверяем данные
            # -------------------------------------------------

            self._validate_operations(
                operations
            )

            self._validate_feature_settings(
                feature_settings
            )

            self._validate_ml_models(
                ml_models
            )

            # -------------------------------------------------
            # 8. Начинаем транзакцию
            # -------------------------------------------------

            try:

                # ---------------------------------------------
                # Сначала удаляем результаты работы моделей
                # ---------------------------------------------

                self.crud.delete_prediction_inputs()
                self.crud.delete_predictions()
                self.crud.delete_model_files()
                self.crud.delete_training_runs()


                # ---------------------------------------------
                # Затем удаляем исходные данные
                # ---------------------------------------------

                self.crud.delete_operations()
                self.crud.delete_feature_settings()
                self.crud.delete_ml_models()

                # ---------------------------------------------
                # Восстанавливаем ML models
                # ---------------------------------------------

                self._insert_rows(
                    "ml_models",
                    ml_models
                )

                # ---------------------------------------------
                # Восстанавливаем feature settings
                # ---------------------------------------------

                self._insert_rows(
                    "feature_settings",
                    feature_settings
                )

                # ---------------------------------------------
                # Восстанавливаем operations
                # ---------------------------------------------

                self._insert_rows(
                    "operations",
                    operations
                )

                # ---------------------------------------------
                # Фиксируем транзакцию
                # ---------------------------------------------

                self.session.commit()

            except Exception:

                self.session.rollback()

                raise

            # -------------------------------------------------
            # 9. Удаляем старые веса
            # -------------------------------------------------

            self._clear_weights()

        finally:

            # -------------------------------------------------
            # 10. Удаляем временную директорию
            # -------------------------------------------------

            shutil.rmtree(
                temporary_directory,
                ignore_errors=True
            )

    # =========================================================
    # ARCHIVE
    # =========================================================

    @staticmethod
    def _extract_initial_archive(
        archive: Path,
        destination: Path
    ):

        """
        Безопасно распаковывает tar.gz.
        """

        destination = destination.resolve()

        with tarfile.open(
            archive,
            mode="r:gz"
        ) as tar:

            for member in tar.getmembers():

                member_path = (
                    destination /
                    member.name
                ).resolve()

                if not str(member_path).startswith(
                    str(destination)
                ):

                    raise ValueError(
                        "Обнаружен небезопасный путь "
                        "в архиве."
                    )

            tar.extractall(
                destination
            )

    # =========================================================
    # FIND INITIAL DIRECTORY
    # =========================================================

    @staticmethod
    def _find_initial_directory(
        temporary_directory: Path
    ) -> Path:

        """
        Находит директорию initial внутри архива.

        Поддерживаются оба варианта:

            initial/
                operations.csv

        и

            operations.csv
            feature_settings.csv
            ...
        """

        expected_file = (
            "operations.csv"
        )

        # Обычный вариант:
        initial_directory = (
            temporary_directory /
            "initial"
        )

        if (
            initial_directory.exists()
            and
            (initial_directory / expected_file).exists()
        ):

            return initial_directory

        # Более универсальный поиск
        for path in temporary_directory.rglob(
            expected_file
        ):

            return path.parent

        raise FileNotFoundError(
            "В архиве не найден operations.csv"
        )

    # =========================================================
    # FILE CHECK
    # =========================================================

    @staticmethod
    def _check_required_file(
        file_path: Path
    ):

        if not file_path.exists():

            raise FileNotFoundError(
                f"Файл отсутствует в архиве: "
                f"{file_path.name}"
            )

        if not file_path.is_file():

            raise ValueError(
                f"{file_path.name} не является файлом."
            )

    # =========================================================
    # METADATA
    # =========================================================

    @staticmethod
    def _load_metadata(
        metadata_file: Path
    ) -> dict:

        try:

            with open(
                metadata_file,
                "r",
                encoding="utf-8"
            ) as file:

                metadata = json.load(file)

        except json.JSONDecodeError as exception:

            raise ValueError(
                "Некорректный metadata.json"
            ) from exception

        if not isinstance(
            metadata,
            dict
        ):

            raise ValueError(
                "metadata.json должен содержать JSON-object."
            )

        return metadata

    # =========================================================
    # VALIDATE METADATA
    # =========================================================

    @staticmethod
    def _validate_metadata(
        metadata: dict
    ):

        required_tables = {
            "operations",
            "feature_settings",
            "ml_models"
        }

        tables = set(
            metadata.get(
                "tables",
                []
            )
        )

        missing = (
            required_tables - tables
        )

        if missing:

            raise ValueError(
                "В metadata.json отсутствуют таблицы: "
                + ", ".join(missing)
            )

    # =========================================================
    # CSV
    # =========================================================

    @staticmethod
    def _read_csv(
        file_path: Path
    ) -> list[dict[str, Any]]:

        """
        Читает CSV и преобразует пустые значения
        в None.
        """

        rows = []

        with open(
            file_path,
            "r",
            encoding="utf-8-sig",
            newline=""
        ) as file:

            reader = csv.DictReader(
                file
            )

            if reader.fieldnames is None:

                raise ValueError(
                    f"CSV-файл {file_path.name} "
                    f"не содержит заголовок."
                )

            for row in reader:

                normalized_row = {}

                for key, value in row.items():

                    if value is None:

                        normalized_row[key] = None

                    elif value.strip() == "":

                        normalized_row[key] = None

                    elif value.strip().upper() in {
                        "NULL",
                        "NONE"
                    }:

                        normalized_row[key] = None

                    else:

                        normalized_row[key] = value

                rows.append(
                    normalized_row
                )

        return rows

    # =========================================================
    # VALIDATION
    # =========================================================

    @staticmethod
    def _validate_operations(
        rows: list[dict]
    ):

        required_columns = {
            "id",
            "nomenclature",
            "work_center",
            "operation",
            "material",
            "detail_mass",
            "blank_length",
            "note",
            "user_name",
            "fill_date",
            "row_number",
            "target_hours"
        }

        if not rows:

            raise ValueError(
                "operations.csv не содержит записей."
            )

        columns = set(
            rows[0].keys()
        )

        missing = (
            required_columns - columns
        )

        if missing:

            raise ValueError(
                "operations.csv: отсутствуют столбцы: "
                + ", ".join(missing)
            )

    @staticmethod
    def _validate_feature_settings(
        rows: list[dict]
    ):

        required_columns = {
            "id",
            "feature_name",
            "display_name",
            "enabled",
            "feature_order"
        }

        if not rows:

            raise ValueError(
                "feature_settings.csv не содержит записей."
            )

        columns = set(
            rows[0].keys()
        )

        missing = (
            required_columns - columns
        )

        if missing:

            raise ValueError(
                "feature_settings.csv: "
                "отсутствуют столбцы: "
                + ", ".join(missing)
            )

    @staticmethod
    def _validate_ml_models(
        rows: list[dict]
    ):

        required_columns = {
            "id",
            "name",
            "description",
            "framework",
            "active"
        }

        if not rows:

            raise ValueError(
                "ml_models.csv не содержит записей."
            )

        columns = set(
            rows[0].keys()
        )

        missing = (
            required_columns - columns
        )

        if missing:

            raise ValueError(
                "ml_models.csv: отсутствуют столбцы: "
                + ", ".join(missing)
            )

    # =========================================================
    # INSERT
    # =========================================================

    def _insert_rows(
        self,
        table_name: str,
        rows: list[dict]
    ):

        """
        Универсальная вставка строк.

        Значения приводятся к типам,
        ожидаемым PostgreSQL.
        """

        if not rows:
            return

        # -----------------------------------------------------
        # Преобразуем значения
        # -----------------------------------------------------

        normalized_rows = []

        for row in rows:

            row = dict(row)

            if table_name == "operations":

                row["detail_mass"] = (
                    self._to_float(
                        row.get("detail_mass")
                    )
                )

                row["blank_length"] = (
                    self._to_float(
                        row.get("blank_length")
                    )
                )

                row["row_number"] = (
                    self._to_int(
                        row.get("row_number")
                    )
                )

                row["target_hours"] = (
                    self._to_float(
                        row.get("target_hours")
                    )
                )

            elif table_name == "feature_settings":

                row["enabled"] = (
                    self._to_bool(
                        row.get("enabled")
                    )
                )

                row["feature_order"] = (
                    self._to_int(
                        row.get("feature_order")
                    )
                )

            elif table_name == "ml_models":

                row["active"] = (
                    self._to_bool(
                        row.get("active")
                    )
                )

            normalized_rows.append(
                row
            )

        # -----------------------------------------------------
        # Формируем SQL
        # -----------------------------------------------------

        columns = list(
            normalized_rows[0].keys()
        )

        quoted_columns = ", ".join(
            f'"{column}"'
            for column in columns
        )

        parameters = ", ".join(
            f":{column}"
            for column in columns
        )

        sql = text(
            f"""
            INSERT INTO "{table_name}"
            ({quoted_columns})
            VALUES
            ({parameters})
            """
        )

        # -----------------------------------------------------
        # Batch insert
        # -----------------------------------------------------

        self.session.execute(
            sql,
            normalized_rows
        )

    # =========================================================
    # TYPE CONVERSION
    # =========================================================

    @staticmethod
    def _to_float(
        value
    ):

        if value is None:
            return None

        if isinstance(
            value,
            str
        ):

            value = value.strip()

            if not value:
                return None

            # На случай русской десятичной записи
            value = value.replace(
                ",",
                "."
            )

        return float(value)

    @staticmethod
    def _to_int(
        value
    ):

        if value is None:
            return None

        if isinstance(
            value,
            str
        ):

            value = value.strip()

            if not value:
                return None

        return int(
            float(value)
        )

    @staticmethod
    def _to_bool(
        value
    ):

        if value is None:
            return None

        if isinstance(
            value,
            bool
        ):

            return value

        value = str(
            value
        ).strip().lower()

        if value in {
            "true",
            "1",
            "yes",
            "да"
        }:

            return True

        if value in {
            "false",
            "0",
            "no",
            "нет"
        }:

            return False

        raise ValueError(
            f"Невозможно преобразовать "
            f"'{value}' в BOOLEAN."
        )

    # =========================================================
    # WEIGHTS
    # =========================================================

    def _clear_weights(self):

        """
        Удаляет сохраненные веса моделей.

        После reset модели будут обучены заново.
        """
        weights_dir = Path(WEIGHTS_DIR)
        if not weights_dir.exists():

            return

        for item in weights_dir.iterdir():
            if item.stem == "annotation" or item.name == "annotation":
                continue  # Просто пропускаем этот файл/папку и идем дальше

            try:

                if item.is_dir():

                    shutil.rmtree(
                        item
                    )

                else:

                    item.unlink()

            except Exception as exception:

                raise RuntimeError(
                    f"Не удалось удалить "
                    f"{item}: {exception}"
                )