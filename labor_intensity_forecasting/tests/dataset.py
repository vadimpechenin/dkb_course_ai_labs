def test_get_dataset(client):
    res = client.get("/dataset")
    assert res.status_code == 200
    answer = res.json()
    assert answer['enabled_features_count']==10

    res = client.get("/dataset/features")
    assert res.status_code == 200
    answer = res.json()
    assert len(answer) >= 6

    res = client.get("/dataset/operations?page=1&size=100")
    assert res.status_code == 200
    answer = res.json()

    payload = {
        "feature_names": [
            "nomenclature",
            "work_center",
            "operation",
            "material",
            "detail_mass",
            "blank_length",
            "note",
            "user_name",
            "fill_date",
            "row_number",
            "target_hours"
        ]
    }
    res = client.post("/dataset/features", json=payload)
    assert res.status_code == 200


def test_import_real_csv(client):
    # 1. Открываем существующий файл на диске в режиме 'rb' (read binary)
    with open("D:/PYTHON/Programms/dkb_course_ai_labs_private/labor_intensity_forecasting/db/database update/operations.csv", "rb") as f:
        files = {
            "file": ("operations.csv", f)
        }

        # 2. Отправляем запрос внутри блока context manager (with)
        res = client.post("/dataset/operations/import-csv", files=files)

    # 3. Проверяем результат
    assert res.status_code == 200