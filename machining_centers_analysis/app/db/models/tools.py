from app.db.core.base import *

class Tool(Base):
    __tablename__ = "tools"

    id = Column(String(50), primary_key=True, autoincrement=False)

    dataset_id = Column(
        String(50),
        ForeignKey("datasets.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String(100))
    manufacturer = Column(String(100))

    diameter = Column(Float)
    teeth_count = Column(Integer)

    description = Column(Text)

    meta_data = Column("metadata",JSONB)