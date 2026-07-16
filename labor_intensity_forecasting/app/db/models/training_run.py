from core.base import *

class TrainingRun(Base):
    __tablename__ = "training_runs"

    id = Column(String(50), primary_key=True, autoincrement=False)

    model_id = Column(
        String(50),
        ForeignKey("ml_models.id", ondelete="RESTRICT"),
        nullable=False
    )

    dataset_size = Column(
        Integer,
        nullable=False
    )

    training_config = Column(
        JSONB,
        nullable=False
    )

    mae = Column(Float)

    rmse = Column(Float)

    r2 = Column(Float)

    training_time = Column(Float)

    is_active = Column(Boolean, default=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    model = relationship(
        "MLModel",
        back_populates="training_runs"
    )

    model_files = relationship(
        "ModelFile",
        back_populates="training_run",
        cascade="all, delete-orphan"
    )

    predictions = relationship(
        "Prediction",
        back_populates="training_run",
        cascade="all, delete-orphan"
    )