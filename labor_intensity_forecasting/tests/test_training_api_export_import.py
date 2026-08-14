import io
import os
import tarfile
import joblib
import json

import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


class TestTrainingAPI:

    def test_export(self):
        """
        Проверка POST /export.

        Сервер должен вернуть архив с файлами модели.
        """

        response = client.post("/export")

        assert response.status_code == 200

        # Проверяем, что действительно возвращается файл
        assert response.content

        if response.status_code == 200:
            # 2. Оборачиваем байты ответа (response.content) в файлоподобный объект
            archive_bytes = io.BytesIO(response.content)
            # Словарь, куда мы сохраним все загруженные объекты
            model_components = {}
            with tarfile.open(fileobj=archive_bytes, mode="r") as tar:
                for member in tar.getmembers():
                    if member.isfile():
                        f = tar.extractfile(member)
                        if not f:
                            continue

                        # Читаем данные из файла в память
                        file_data = f.read()

                        # Если это JSON-конфиг, читаем как текст и парсим в словарь
                        if member.name.endswith('.json'):
                            text_content = file_data.decode('utf-8')
                            model_components[member.name] = json.loads(text_content)
                            print(f"Успешно загружен текст из: {member.name}")

                        # Если это бинарный файл модели (.joblib), загружаем через joblib
                        elif member.name.endswith('.joblib'):
                            # Оборачиваем байты файла в BytesIO, чтобы joblib мог их прочитать
                            model_components[member.name] = joblib.load(io.BytesIO(file_data))
                            print(f"Успешно загружен бинарный объект: {member.name}")

            # Теперь все ваши объекты доступны в словаре model_components
            print("\nВсе компоненты загружены в память!")

            # Пример обращения к пайплайну:
            # pipeline = model_components['model/pipeline.joblib']

        else:
            print(f"Ошибка скачивания! Код ответа: {response.status_code}")

        # Проверяем Content-Type
        assert (
            "application" in response.headers.get("content-type", "")
            or "octet-stream" in response.headers.get("content-type", "")
        )

    def test_import(self):
        """
        Проверка POST /import.

        Создаём тестовый TAR-архив в памяти
        и передаём его серверу.
        """
        if (1==0):
            archive = io.BytesIO()

            with tarfile.open(
                fileobj=archive,
                mode="w"
            ) as tar:

                content = b"test model file"

                info = tarfile.TarInfo(
                    name="test_model.txt"
                )

                info.size = len(content)

                tar.addfile(
                    info,
                    io.BytesIO(content)
                )

            archive.seek(0)
        else:
            response = client.post("/export")

            assert response.status_code == 200

            # Проверяем, что действительно возвращается файл
            assert response.content

            if response.status_code == 200:
                # 2. Оборачиваем байты ответа (response.content) в файлоподобный объект
                archive = io.BytesIO(response.content)

                response = client.post(
                    "/import",
                    files={
                        "file": (
                            "test_model.tar",
                            archive,
                            "application/x-tar"
                        )
                    }
                )

                assert response.status_code == 200

                data = response.json()

                assert data is not None
                assert data.get("success") is True
            else:
                assert False