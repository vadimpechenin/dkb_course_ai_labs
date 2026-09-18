from app.db.core.base import *
from sqlalchemy.orm import relationship  # убедитесь, что импортировано, либо используйте из __all__

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(50), primary_key=True, autoincrement=False)

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

    sample_id = Column(
        String(50),
        ForeignKey("signal_samples.id", ondelete="RESTRICT"),
        nullable=False
    )

    predicted_class = Column(String(50))
    confidence = Column(Float)
    probabilities = Column(JSONB)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )