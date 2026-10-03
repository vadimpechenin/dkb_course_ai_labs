REM uvicorn app.main:app --reload
REM poetry run uvicorn app.main:app --reload
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
