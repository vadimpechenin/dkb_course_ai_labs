from app.db.core.base import *

class ProcessedSample(Base):
    __tablename__ = "processed_samples"

    id = Column(String(50), primary_key=True, autoincrement=False)

    sample_id = Column(
        String(50),
        ForeignKey("signal_samples.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    start_index = Column(Integer)
    end_index = Column(Integer)

    duration_sec = Column(Float)

    preprocessing_config = Column(JSONB)

    processed_file_path = Column(Text)

    status = Column(String(30))

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )