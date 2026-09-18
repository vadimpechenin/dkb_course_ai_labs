#TODO не реализована, еще делать и тестировать
from pathlib import Path

from app.core.common_utils import CommonUtils

import os
from dotenv import load_dotenv


load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "")

#BASE_DIR = os.path.dirname(os.path.abspath(__file__))#os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = Path(__file__).resolve().parent.parent
WEIGHTS_DIR = os.getenv("WEIGHTS_DIR", BASE_DIR.parent / "weights")
BACKUP_DIR = os.getenv("BACKUP_DIR", BASE_DIR.parent / "data"/"initial.tar.gz")
