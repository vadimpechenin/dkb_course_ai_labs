from app.db.core.base import *

class PredictionInput(Base):
    __tablename__ = "prediction_inputs"

    id = Column(String(50), primary_key=True, autoincrement=False)

    prediction_id = Column(
        String(50),
        ForeignKey("predictions.id", ondelete="CASCADE"),
        nullable=False
    )

    detail_mass = Column(Float)

    blank_length = Column(Float)

    work_center = Column(Text)

    operation = Column(Text)

    material = Column(Text)

    nomenclature = Column(Text)

    note = Column(Text)

    user_name = Column(Text)

    fill_date = Column(Date)

    row_number = Column(Integer)

    prediction = relationship(
        "Prediction",
        back_populates="prediction_input"
    )