from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_datasets():

    response = client.get(
        "/datasets"
    )

    assert response.status_code == 200

    data = response.json()

    assert "datasets" in data

    assert isinstance(
        data["datasets"],
        list
    )


def test_get_datasets_empty():

    response = client.get(
        "/datasets"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["datasets"] == []