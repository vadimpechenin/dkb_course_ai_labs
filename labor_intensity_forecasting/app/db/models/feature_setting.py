from app.db.core.base import *

class FeatureSetting(Base):
    __tablename__ = "feature_settings"

    id = Column(String(50), primary_key=True, autoincrement=False)

    feature_name = Column(String(100), unique=True, nullable=False)

    display_name = Column(String(100))

    enabled = Column(Boolean, default=True)

    feature_order = Column(Integer)