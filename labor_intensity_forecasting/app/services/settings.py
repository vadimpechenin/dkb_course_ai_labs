from app.crud.settings import SettingsCRUD
from app.core.settings import WEIGHTS_DIR


class SettingsService:

    def __init__(
        self,
        session
    ):

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
        Возвращает лабораторную БД
        в исходное состояние.

        Удаляются результаты работы студентов,
        после чего восстанавливаются исходные
        данные.
        """
        pass