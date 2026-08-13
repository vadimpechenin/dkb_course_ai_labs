import io
import os
import tarfile

import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


class TestTrainingAPI:

    def test_retrain(self):
        """
        Проверка POST /retrain.

        Переобучает модель на данных из operations.
        """

        payload = {
            "model_id": "ef64ff7e9232406b9293db85741ba1b0",
            "train_percent": 80,
            "test_percent": 20
        }
        response = client.post(
            "/retrain",
            json=payload
        )

        assert response.status_code == 200

        data = response.json()

        assert data["success"] is True

        assert data["training_run_id"] is not None

        assert data["mae"] is not None
        assert data["rmse"] is not None
        assert data["r2"] is not None

        assert data["mae"] >= 0
        assert data["rmse"] >= 0
        assert -1 <= data["r2"] <= 1

    def test_rollback(self):
        """
        Проверка POST /rollback.

        После выполнения должна восстановиться
        предыдущая активная версия модели.
        """

        response = client.post("/rollback")

        assert response.status_code == 200

        data = response.json()

        assert data is not None
        assert data.get("success") is True

    def test_export(self):
        """
        Проверка POST /export.

        Сервер должен вернуть архив с файлами модели.
        """

        response = client.post("/export")

        assert response.status_code == 200

        # Проверяем, что действительно возвращается файл
        assert response.content

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