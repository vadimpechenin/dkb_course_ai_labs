from app.db.core.base import *

class FeatureSetting(Base):
    __tablename__ = "feature_settings"

    id = Column(String(50), primary_key=True, autoincrement=False)

    feature_name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    display_name = Column(String(150))

    description = Column(Text)

    data_type = Column(String(30))
    # float / integer

    enabled = Column(Boolean, default=True)

    feature_order = Column(Integer)

    channel = Column(String(10))
    # X / Y / Z / ALL

    unit = Column(String(30))