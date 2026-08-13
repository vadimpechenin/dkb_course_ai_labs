def test_forecast(client):
    # 1. Открываем существующий файл на диске в режиме 'rb' (read binary)
    payload = [
    {
        "nomenclature": "Кольцо регулировочное 2А13",
        "work_center": "6101 Сборочно-сварочный участок",
        "operation": "Ремонт",
        "material": "Сталь 40Х",
        "detail_mass": 2.5,
        "blank_length": 150.0,
        "note": "Ремонт детали",
        "user_name": "Иванов Иван",
        "fill_date": "2026-08-13",
        "row_number": 1
    },
    {
        "nomenclature": "Барабан ПВК 1.2.8.01",
        "work_center": "5301 Сверловка",
        "operation": "Сверление отверстий",
        "material": "Сталь 40Х",
        "detail_mass": 4.2,
        "blank_length": 200.0,
        "note": "",
        "user_name": "Петров Петр",
        "fill_date": "2026-08-13",
        "row_number": 2
    }
]

    # 2. Отправляем запрос на прогноз
    res = client.post("/forecast", json=payload)

    # 3. Проверяем результат
    assert res.status_code == 200