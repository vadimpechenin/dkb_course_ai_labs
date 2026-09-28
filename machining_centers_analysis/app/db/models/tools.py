from app.db.core.base import *

class Tool(Base):
    __tablename__ = "tools"

    id = Column(String(50), primary_key=True, autoincrement=False)
    name = Column(String(100))
    catalog_id = Column(
        String(50),
        ForeignKey("tools_catalog.id", ondelete="CASCADE"),
        nullable=False
    )

    experiment_id = Column(
        String(50),
        ForeignKey("experiments.id", ondelete="CASCADE"),
        nullable=False
    )
