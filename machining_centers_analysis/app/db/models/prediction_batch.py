from app.db.core.base import *


class PredictionBatch(Base):
    __tablename__ = "prediction_batches"

    id = Column(
        String(50),
        primary_key=True,
        autoincrement=False
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )
