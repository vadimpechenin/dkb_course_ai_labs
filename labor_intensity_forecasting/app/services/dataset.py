import math
import csv
import io
from app.db.core.support.UUIDClass import UUIDClass

from datetime import datetime

from app.crud.dataset import DatasetCRUD

from app.db.models.operation import Operation


class DatasetService:

    def __init__(self, session):

        self.crud = DatasetCRUD(session)

    # =========================================================
    # DATASET
    # =========================================================

    def get_dataset(self):

        dataset_size = (
            self.crud.get_dataset_size()
        )

        features = (
            self.crud.get_features()
        )

        enabled_features = [
            feature
            for feature in features
            if feature.enabled
        ]

        return {
            "dataset_size": dataset_size,

            "features_count": len(features),

            "enabled_features_count":
                len(enabled_features),

            "target_column":
                "target_hours"
        }

    # =========================================================
    # FEATURES
    # =========================================================

    def get_features(self):

        features = self.crud.get_features()

        return [

            {
                "id": feature.id,

                "feature_name":
                    feature.feature_name,

                "display_name":
                    feature.display_name,

                "enabled":
                    feature.enabled,

                "feature_order":
                    feature.feature_order
            }

            for feature in features
        ]

    def save_features(
        self,
        feature_names: list[str]
    ):

        features = self.crud.update_features(
            feature_names
        )

        return {
            "success": True,

            "enabled_features": [
                feature.feature_name
                for feature in features
            ]
        }

    # =========================================================
    # OPERATIONS
    # =========================================================

    def get_operations(
        self,
        page: int,
        size: int
    ):

        items, total = (
            self.crud.get_operations(
                page,
                size
            )
        )

        pages = (
            math.ceil(total / size)
            if total > 0
            else 0
        )

        result = []

        for item in items:

            result.append({

                "id": item.id,

                "nomenclature":
                    item.nomenclature,

                "work_center":
                    item.work_center,

                "operation":
                    item.operation,

                "material":
                    item.material,

                "detail_mass":
                    item.detail_mass,

                "blank_length":
                    item.blank_length,

                "note":
                    item.note,

                "user_name":
                    item.user_name,

                "fill_date":
                    (
                        item.fill_date.isoformat()
                        if item.fill_date
                        else None
                    ),

                "row_number":
                    item.row_number,

                "target_hours":
                    item.target_hours

            })

        return {

            "items": result,

            "page": page,

            "size": size,

            "total": total,

            "pages": pages
        }

    # =========================================================
    # CSV IMPORT
    # =========================================================

    def import_csv(
        self,
        file_content: bytes
    ):

        # -----------------------------------------------------
        # Определяем кодировку
        # -----------------------------------------------------

        try:

            text = file_content.decode(
                "utf-8-sig"
            )

        except UnicodeDecodeError:

            text = file_content.decode(
                "cp1251"
            )

        # -----------------------------------------------------
        # Читаем CSV
        # -----------------------------------------------------

        reader = csv.DictReader(
            io.StringIO(text)
        )

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

        columns = set(
            reader.fieldnames or []
        )

        missing = (
            required_columns - columns
        )

        if missing:

            raise ValueError(
                "Отсутствуют столбцы: "
                + ", ".join(sorted(missing))
            )

        operations = []

        for row in reader:

            operation = Operation(

                id=(
                    row.get("id")
                    or UUIDClass.geterateUUIDWithout_()
                ),

                nomenclature=self._text(
                    row.get("nomenclature")
                ),

                work_center=self._text(
                    row.get("work_center")
                ),

                operation=self._text(
                    row.get("operation")
                ),

                material=self._text(
                    row.get("material")
                ),

                detail_mass=self._float(
                    row.get("detail_mass")
                ),

                blank_length=self._float(
                    row.get("blank_length")
                ),

                note=self._text(
                    row.get("note")
                ),

                user_name=self._text(
                    row.get("user_name")
                ),

                fill_date=self._date(
                    row.get("fill_date")
                ),

                row_number=self._int(
                    row.get("row_number")
                ),

                target_hours=self._float(
                    row.get("target_hours")
                )
            )

            operations.append(
                operation
            )

        # -----------------------------------------------------
        # Заменяем датасет
        # -----------------------------------------------------

        self.crud.delete_operations()

        self.crud.add_operations(
            operations
        )

        return {
            "success": True,

            "imported": len(operations),

            "message":
                f"Успешно импортировано "
                f"{len(operations)} операций"
        }

    # =========================================================
    # HELPERS
    # =========================================================

    @staticmethod
    def _text(value):

        if value is None:

            return None

        value = str(value).strip()

        return value if value else None

    @staticmethod
    def _float(value):

        if value is None:

            return None

        value = str(value).strip()

        if not value:

            return None

        value = value.replace(
            ",",
            "."
        )

        return float(value)

    @staticmethod
    def _int(value):

        if value is None:

            return None

        value = str(value).strip()

        if not value:

            return None

        return int(float(value))

    @staticmethod
    def _date(value):

        if value is None:

            return None

        value = str(value).strip()

        if not value:

            return None

        formats = [

            "%Y-%m-%d",

            "%d.%m.%Y",

            "%Y/%m/%d"

        ]

        for fmt in formats:

            try:

                return datetime.strptime(
                    value,
                    fmt
                ).date()

            except ValueError:

                continue

        raise ValueError(
            f"Неверный формат даты: {value}"
        )