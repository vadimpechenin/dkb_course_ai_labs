def test_get_settings_auth_headers(client):
    res = client.get("/")

    assert res.status_code == 200
    assert isinstance(res.json(), dict)