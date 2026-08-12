def test_get_dataset(client):
    res = client.get("/dataset")
    assert res.status_code == 200
    answer = res.json()
    assert answer['enabled_features_count']==10