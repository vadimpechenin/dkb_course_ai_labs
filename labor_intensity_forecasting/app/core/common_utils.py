import os
import inspect


class CommonUtils:
    @staticmethod
    def get_common_utils_root():
        """
        Возвращает абсолютный путь к папке проекта,
        то есть к директории, где находится файл, в котором объявлен этот класс.
        """
        # Получаем путь к файлу, где определён класс
        current_file = inspect.getfile(CommonUtils)

        # Абсолютный путь к этому файлу
        abs_path = os.path.abspath(current_file)

        # Папка файла -> корень проекта
        project_root = os.path.dirname(abs_path)

        return project_root

    @staticmethod
    def get_project_root():
        return os.path.dirname(CommonUtils.get_common_utils_root())

    @staticmethod
    def get_global_project_root():
        result = os.path.dirname(CommonUtils.get_common_utils_root())
        for i in range(2):
            result= os.path.dirname(result)
        return result