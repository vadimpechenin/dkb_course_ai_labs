"""
Класс для работы с базой данных
"""
from sqlalchemy import create_engine
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy import text

from app.db.core.support.supportFunctions import resultproxy_to_dict

from app.db.config.config import DATABASE_URI

from contextlib import contextmanager
from app.db.core.base import Base



class SQLDataBase():

    def __init__(self):
        #name_of_database = 'set_of_blades'
        self.engine = create_engine(DATABASE_URI)

    def db_create(self):
        #Метод для создания таблиц и базы данных
       Base.metadata.create_all(self.engine)

    def recreate_database(self):
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)

    def create_session(self):
        #Создание сессии, через которую мапяться объекты
        self.session = sessionmaker(bind=self.engine)()

    def clear_all_tables(self):
        # Отключаем проверку внешних ключей (актуально для PostgreSQL/MySQL)
        self.session.execute(text("SET session_replication_role = 'replica';"))  # Для Postgres
        # Или db.execute(text("SET FOREIGN_KEY_CHECKS = 0;")) # Для MySQL

        for table in reversed(Base.metadata.sorted_tables):
            self.session.execute(table.delete())

        self.session.execute(text("SET session_replication_role = 'origin';"))  # Включаем обратно
        self.session.commit()

    def databaseAddCommit(self,type_object):
        self.session.add(type_object)
        self.session.commit()

    def databaseAddListCommit(self,object_list):
        self.session.bulk_save_objects(object_list)
        self.session.commit()

    @contextmanager
    def session_scope(self):
        session = self.session
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    def sessionCloseAll(self):
        session = self.session
        session.close_all()

    def select_all_params_in_table(self, name):
        # Функция для подачи запроса
        request_str = "SELECT * \
                              FROM \
                              " + str(name)
        #s = self.session.query(ParameterDescriptions)
        s = self.session.execute(request_str)
        result_of_query = resultproxy_to_dict(s)
        #result_of_query = result_query_to_dict(s)
        return result_of_query