from app.db.core.base import *

class ModelFile(Base):
    __tablename__ = "model_files"

    id = Column(String(50), primary_key=True, autoincrement=False)

    training_run_id = Column(
        String(50),
        ForeignKey("training_runs.id"),
        nullable=False
    )

    model_id = Column(
        String(50),
        ForeignKey("ml_models.id"),
        nullable=False
    )

    version = Column(String(50))

    weights_path = Column(Text)

    scaler_path = Column(Text)

    encoder_path = Column(Text)

    feature_list_path = Column(Text)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    model = relationship(
        "MLModel",
        back_populates="model_files"
    )

    training_run = relationship(
        "TrainingRun",
        back_populates="model_files"
    )