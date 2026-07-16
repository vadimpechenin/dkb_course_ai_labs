from core.base import *

class Operation(Base):
    __tablename__ = "operations"

    id = Column(String(50), primary_key=True, autoincrement=False)

    nomenclature = Column(Text)
    work_center = Column(Text)
    operation = Column(Text)
    material = Column(Text)

    detail_mass = Column(Float)
    blank_length = Column(Float)

    note = Column(Text)

    user_name = Column(Text)

    fill_date = Column(Date)

    row_number = Column(Integer)

    target_hours = Column(Float)