from sqlalchemy import select

from app.db.models.feature_setting import FeatureSetting


class FeatureCRUD:

    def __init__(self, session):
        self.session = session


    def get_features(self):

        statement = (
            select(FeatureSetting)
            .order_by(
                FeatureSetting.feature_order
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().all()


    def get_feature_by_id(
        self,
        feature_id: str
    ):

        statement = (
            select(FeatureSetting)
            .where(
                FeatureSetting.id == feature_id
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().first()