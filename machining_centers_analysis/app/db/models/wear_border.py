from app.db.core.base import *

class WearBorder(Base):
    __tablename__ = "wear_borders"

    id = Column(String(50), primary_key=True, autoincrement=False)

    borders = Column(ARRAY(Float), nullable=False)