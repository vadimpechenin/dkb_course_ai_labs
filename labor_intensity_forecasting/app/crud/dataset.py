from sqlalchemy import func

from app.db.models.operation import Operation
from app.db.models.feature_setting import FeatureSetting


class DatasetCRUD:

    def __init__(self, session):

        self.session = session

    # ---------------------------------------------------------
    # DATASET
    # ---------------------------------------------------------

    def get_dataset_size(self):

        return self.session.query(
            func.count(Operation.id)
        ).scalar() or 0

    # ---------------------------------------------------------
    # FEATURES
    # ---------------------------------------------------------

    def get_features(self):

        return (
            self.session.query(FeatureSetting)
            .order_by(
                FeatureSetting.feature_order
            )
            .all()
        )

    def get_enabled_features(self):

        return (
            self.session.query(FeatureSetting)
            .filter(
                FeatureSetting.enabled == True
            )
            .order_by(
                FeatureSetting.feature_order
            )
            .all()
        )

    def update_features(
        self,
        feature_names: list[str]
    ):

        features = self.session.query(
            FeatureSetting
        ).all()

        for feature in features:

            feature.enabled = (
                feature.feature_name in feature_names
            )

        self.session.commit()

        return self.get_enabled_features()

    # ---------------------------------------------------------
    # OPERATIONS
    # ---------------------------------------------------------

    def get_operations(
        self,
        page: int,
        size: int
    ):

        total = self.session.query(
            func.count(Operation.id)
        ).scalar() or 0

        offset = (page - 1) * size

        items = (
            self.session.query(Operation)
            .order_by(
                Operation.row_number,
                Operation.id
            )
            .offset(offset)
            .limit(size)
            .all()
        )

        return items, total

    # ---------------------------------------------------------
    # IMPORT
    # ---------------------------------------------------------

    def delete_operations(self):

        self.session.query(
            Operation
        ).delete()

        self.session.commit()

    def add_operations(
        self,
        operations: list[Operation]
    ):

        self.session.bulk_save_objects(
            operations
        )

        self.session.commit()