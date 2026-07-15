#TODO не реализована, еще делать и тестировать
from pathlib import Path

from app.core.common_utils import CommonUtils

import os
from dotenv import load_dotenv


load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEIGHTS_DIR = os.getenv("WEIGHTS_DIR", os.path.join(BASE_DIR, "../..", "weights"))
