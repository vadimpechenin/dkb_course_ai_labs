from app.db.core.base import *

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(50), primary_key=True, autoincrement=False)

    name = Column(String(150), nullable=False)
    description = Column(Text)

    source_type = Column(String(50))
    # kaggle / laboratory

    source_name = Column(String(150))
    # PHM 2010 / Samara University

    archive_path = Column(Text)

    samples_count = Column(Integer)
    tools_count = Column(Integer)

    meta_data = Column("metadata",JSONB)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    experiments = relationship(
        "Experiment",
        back_populates="dataset"
    )