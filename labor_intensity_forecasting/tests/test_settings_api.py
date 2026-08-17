def test_get_settings(client):
    res = client.get("/settings")
    assert res.status_code == 200
    answer = res.json()
    assert (answer['active_training_run']!=None)

def test_settings_health(client):
    res = client.get("/settings/health")
    assert res.status_code == 200