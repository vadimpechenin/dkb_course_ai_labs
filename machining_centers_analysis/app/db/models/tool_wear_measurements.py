from app.db.core.base import *

class ToolWearMeasurement(Base):
    __tablename__ = "tool_wear_measurements"

    id = Column(String(50), primary_key=True, autoincrement=False)

    sample_id = Column(
        String(50),
        ForeignKey("signal_samples.id", ondelete="CASCADE"),
        nullable=False
    )

    border_id = Column(
        String(50),
        ForeignKey("wear_borders.id"),
        nullable=False
    )

    edge_wear = Column(ARRAY(Float), nullable=False)

    max_wear = Column(Float)

    measurement_method = Column(String(100))

    measured_at = Column(
        TIMESTAMP(timezone=True)
    )

    meta_data = Column("metadata",JSONB)