from core.base import *

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(50), primary_key=True, autoincrement=False)

    training_run_id = Column(
        String(50),
        ForeignKey("training_runs.id"),
        nullable=False
    )

    forecast = Column(Float)

    std = Column(Float)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    training_run = relationship(
        "TrainingRun",
        back_populates="predictions"
    )

    prediction_input = relationship(
        "PredictionInput",
        back_populates="prediction",
        uselist=False,
        cascade="all, delete"
    )