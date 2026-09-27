from sqlalchemy import select

from app.db.models.ml_model import MLModel


class ModelCRUD:

    def __init__(self, session):

        self.session = session


    def get_models(self):

        statement = (
            select(MLModel)
            .where(
                MLModel.active == True
            )
            .order_by(
                MLModel.name
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().all()


    def get_model_by_id(
        self,
        model_id: str
    ):

        statement = (
            select(MLModel)
            .where(
                MLModel.id == model_id
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().first()