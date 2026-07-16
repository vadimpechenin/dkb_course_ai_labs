from typing import Generator
from sqlalchemy.orm import Session

from app.db.core.session import SQLDataBase

db = SQLDataBase()


def get_db() -> Generator[Session, None, None]:
    #print("Зашел в db")
    session = db.get_session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()