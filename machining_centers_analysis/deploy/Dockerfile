FROM python:3.11-slim-bookworm

WORKDIR /app

# Системные зависимости для Python/PostgreSQL
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Установка Python-зависимостей
COPY deploy/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt \
    && rm -f /app/requirements.txt

# Копируем приложение
COPY app /app/app

# Копируем веса моделей
COPY models /app/models

# Переменные окружения приложения
ENV MODELS_DIR=/app/models

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]