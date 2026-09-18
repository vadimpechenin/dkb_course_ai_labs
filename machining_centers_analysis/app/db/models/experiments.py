from app.db.core.base import *

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(String(50), primary_key=True, autoincrement=False)

    dataset_id = Column(
        String(50),
        ForeignKey("datasets.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String(150), nullable=False)

    experiment_date = Column(Date)

    description = Column(Text)

    processing_scheme = Column(Text)
    # например:
    # "попутное + встречное"
    # "только попутное"

    notes = Column(Text)

    meta_data = Column("metadata",JSONB)

    dataset = relationship(
        "Dataset",
        back_populates="experiments"
    )

    signal_samples = relationship(
        "SignalSample",
        back_populates="experiment"
    )