from core.base import *

class MLModel(Base):
    __tablename__ = "ml_models"

    id = Column(String(50), primary_key=True, autoincrement=False)

    name = Column(String(100), unique=True, nullable=False)

    description = Column(Text)

    framework = Column(String(50))

    active = Column(Boolean, default=True)

    training_runs = relationship(
        "TrainingRun",
        back_populates="model",
        cascade="all, delete"
    )

    model_files = relationship(
        "ModelFile",
        back_populates="model",
        cascade="all, delete"
    )