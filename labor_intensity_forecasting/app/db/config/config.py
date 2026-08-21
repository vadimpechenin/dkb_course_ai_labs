pl = 'nodocker'
#pl = 'docker'
if (pl=='docker'):
    # Для Docker
    DATABASE_URI = 'postgresql+psycopg2://postgres:mapr@host.docker.internal:5432/lp'
else:
    DATABASE_URI = 'postgresql+psycopg2://postgres:mapr@localhost:5432/lp'

nameOfDataBase = "lp"

SQLDataBaseObj = None
MainHandlerObj = None
AllParametersObj = None
UUIDClassObj = None


