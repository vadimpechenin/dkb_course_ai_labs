from app.db.core.base import *

class ToolCatalog(Base):
    __tablename__ = "tools_catalog"

    id = Column(String(50), primary_key=True, autoincrement=False)

    name = Column(String(100))
    manufacturer = Column(String(100))

    diameter = Column(Float)
    teeth_count = Column(Integer)

    description = Column(Text)

    meta_data = Column("metadata",JSONB)