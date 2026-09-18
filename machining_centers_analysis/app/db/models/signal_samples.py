from app.db.core.base import *

class SignalSample(Base):
    __tablename__ = "signal_samples"

    id = Column(String(50), primary_key=True, autoincrement=False)

    experiment_id = Column(
        String(50),
        ForeignKey("experiments.id", ondelete="CASCADE"),
        nullable=False
    )

    tool_id = Column(
        String(50),
        ForeignKey("tools.id", ondelete="RESTRICT"),
        nullable=False
    )

    cutting_mode_id = Column(
        String(50),
        ForeignKey("cutting_modes.id", ondelete="RESTRICT")
    )

    sample_number = Column(Integer)

    timestamp = Column(
        TIMESTAMP(timezone=True)
    )

    duration_sec = Column(Float)

    sampling_rate = Column(Integer)

    channels_count = Column(Integer, default=3)

    source_file = Column(Text)

    source_format = Column(String(20))
    # csv / json

    processing_status = Column(String(30))
    # uploaded / processed / failed

    meta_data = Column("metadata",JSONB)

    experiment = relationship(
        "Experiment",
        back_populates="signal_samples"
    )