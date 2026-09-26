from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_features():

    response = client.get(
        "/features"
    )

    assert response.status_code == 200

    data = response.json()

    assert "features" in data

    assert isinstance(
        data["features"],
        list
    )

    assert len(
        data["features"]
    ) == 24


def test_get_features_structure():

    response = client.get(
        "/features"
    )

    assert response.status_code == 200

    features = response.json()[
        "features"
    ]

    feature = features[0]

    assert "id" in feature
    assert "feature_name" in feature
    assert "display_name" in feature
    assert "description" in feature
    assert "data_type" in feature
    assert "enabled" in feature
    assert "feature_order" in feature
    assert "channel" in feature
    assert "unit" in feature


def test_get_feature_by_id():

    response = client.get(
        "/features"
    )

    assert response.status_code == 200

    features = response.json()[
        "features"
    ]

    feature_id = features[0]["id"]


    response = client.get(
        f"/features/{feature_id}"
    )

    assert response.status_code == 200

    feature = response.json()

    assert feature["id"] == feature_id


def test_get_feature_not_found():

    response = client.get(
        "/features/non-existing-feature"
    )

    assert response.status_code == 404