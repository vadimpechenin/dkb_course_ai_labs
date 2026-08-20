def test_post_settings_restore(client):
    res = client.post("/settings/reset")
    assert res.status_code == 200
    answer = res.json()
    assert (answer['message']=="Исходное состояние успешно восстановлено.")