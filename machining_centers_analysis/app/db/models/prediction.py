from app.db.core.base import *
from sqlalchemy.orm import relationship  # убедитесь, что импортировано, либо используйте из __all__

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(50), primary_key=True, autoincrement=False)

    batch_id = Column(
        String(50),
        ForeignKey(
            "prediction_batches.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    training_run_id = Column(
        String(50),
        ForeignKey("training_runs.id"),
        nullable=False
    )

    # Добавляем обратную связь, которую требует TrainingRun
    training_run = relationship(
        "TrainingRun",
        back_populates="predictions"
    )

    # Если Prediction основан на существующем
    # SignalSample, здесь может быть его ID.
    # Для JSON Prediction = NULL.
    sample_id = Column(
        String(50),
        ForeignKey(
            "signal_samples.id",
            ondelete="RESTRICT"
        ),
        nullable=True
    )

    # ID образца из входного JSON.
    input_sample_id = Column(
        String(100),
        nullable=False
    )

    # Фактический износ из JSON.
    actual_wear = Column(
        Float
    )

    # Эталонный класс 0 / 1 / 2,
    # вычисленный через WearBorder.
    actual_class = Column(
        String(50)
    )

    predicted_class = Column(String(50))
    confidence = Column(Float)
    probabilities = Column(JSONB)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )