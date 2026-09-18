from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_dashboard():

    response = client.get("/dashboard")

    assert response.status_code == 200

    data = response.json()

    assert "statistics" in data
    assert "active_models" in data
    assert "last_training" in data

    statistics = data["statistics"]

    assert "datasets_count" in statistics
    assert "experiments_count" in statistics
    assert "signal_samples_count" in statistics
    assert "feature_vectors_count" in statistics
    assert "features_count" in statistics
    assert "ml_models_count" in statistics
    assert "training_runs_count" in statistics
    assert "predictions_count" in statistics