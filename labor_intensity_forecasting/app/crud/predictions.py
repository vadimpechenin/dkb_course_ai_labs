from sqlalchemy.orm import Session

from app.db.models.prediction import Prediction


class PredictionsCRUD:

    def __init__(
        self,
        session: Session
    ):

        self.session = session

    def get_history(
        self,
        limit: int = 100,
        offset: int = 0
    ):

        return (
            self.session.query(
                Prediction
            )
            .order_by(
                Prediction.created_at.desc()
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_all(self):

        return (
            self.session.query(
                Prediction
            )
            .order_by(
                Prediction.created_at.asc()
            )
            .all()
        )