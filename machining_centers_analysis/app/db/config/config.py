pl = 'ndocker'
#pl = 'docker'
if (pl=='docker'):
    DATABASE_URI = 'postgresql+psycopg2://postgres:mapr@host.docker.internal:5432/mca'
else:
    DATABASE_URI = 'postgresql+psycopg2://postgres:mapr@localhost:5432/mca'
nameOfDataBase = "mca"

SQLDataBaseObj = None
MainHandlerObj = None
AllParametersObj = None
UUIDClassObj = None


