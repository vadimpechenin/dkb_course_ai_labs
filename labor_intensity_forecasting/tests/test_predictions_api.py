def test_get_history(client):
    res = client.get("/predictions/history")
    assert res.status_code == 200
    answer = res.json()
    assert len(answer)>=1

def test_dump(client):
    res = client.post("/predictions/dump")
    assert res.status_code == 200