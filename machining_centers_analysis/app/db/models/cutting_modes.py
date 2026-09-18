from app.db.core.base import *

class CuttingMode(Base):
    __tablename__ = "cutting_modes"

    id = Column(String(50), primary_key=True, autoincrement=False)

    experiment_id = Column(
        String(50),
        ForeignKey("experiments.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String(100))

    cutting_speed = Column(Float)
    spindle_speed = Column(Float)
    feed_per_tooth = Column(Float)
    feed_rate = Column(Float)

    depth_of_cut = Column(Float)
    milling_width = Column(Float)

    direction = Column(String(30))
    # climb / conventional

    meta_data = Column("metadata",JSONB)