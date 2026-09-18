from app.db.core.base import *

class FeatureVector(Base):
    __tablename__ = "feature_vectors"

    id = Column(String(50), primary_key=True, autoincrement=False)

    sample_id = Column(
        String(50),
        ForeignKey("signal_samples.id", ondelete="CASCADE"),
        nullable=False
    )

    preprocessing_id = Column(
        String(50),
        ForeignKey("processed_samples.id", ondelete="RESTRICT"),
        nullable=False
    )

    features = Column(
        JSONB,
        nullable=False
    )

    target_class = Column(String(50))

    target_value = Column(Float)

    feature_version = Column(String(50))

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )