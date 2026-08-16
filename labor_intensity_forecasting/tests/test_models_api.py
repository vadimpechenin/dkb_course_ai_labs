def test_get_models(client):
    res = client.get("/models")
    assert res.status_code == 200
    answer = res.json()
    assert len(answer)>=4

def test_active(client):
    res = client.get("/models/active")
    assert res.status_code == 200


def test_training_runs(client):
    res1 = client.get("/models/active")
    answer1 = res1.json()
    model_id = answer1["model_id"]
    res = client.post(f"/models/{model_id}/activate")
    assert res.status_code == 200

def test_experiments(client):
    res = client.get("/models/training-runs")
    assert res.status_code == 200
    answer = res.json()
    assert len(answer)>=4

def test_activate(client):
    res = client.get("/models/training-runs")
    answer = res.json()
    training_runs = answer[0]["id"]
    res = client.get(f"/models/experiments/{training_runs}")
    assert res.status_code == 200