from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_datasets():

    response = client.get("/datasets")

    assert response.status_code == 200

    data = response.json()

    assert "datasets" in data
    assert isinstance(data["datasets"], list)

    assert len(data["datasets"]) == 2


def test_get_datasets_structure():

    response = client.get("/datasets")

    assert response.status_code == 200

    data = response.json()

    assert len(data["datasets"]) == 2

    dataset = data["datasets"][0]

    assert "id" in dataset
    assert "name" in dataset
    assert "description" in dataset
    assert "source_type" in dataset
    assert "source_name" in dataset
    assert "samples_count" in dataset
    assert "tools_count" in dataset


def test_get_dataset_by_id():

    response = client.get("/datasets")

    assert response.status_code == 200

    datasets = response.json()["datasets"]

    dataset_id = datasets[0]["id"]

    response = client.get(
        f"/datasets/{dataset_id}"
    )

    assert response.status_code == 200

    dataset = response.json()

    assert dataset["id"] == dataset_id


def test_get_dataset_not_found():

    response = client.get(
        "/datasets/non-existing-dataset"
    )

    assert response.status_code == 404