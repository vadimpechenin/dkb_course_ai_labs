from sqlalchemy import select

from app.db.models.feature_vectors import FeatureVector
from app.db.models.signal_samples import SignalSample
from app.db.models.experiments import Experiment


class FeatureVectorCRUD:

    def __init__(self, session):

        self.session = session


    def get_vectors_for_dataset(
        self,
        dataset_id: str
    ):

        statement = (
            select(
                FeatureVector,
                SignalSample
            )
            .join(
                SignalSample,
                FeatureVector.sample_id ==
                SignalSample.id
            )
            .join(
                Experiment,
                SignalSample.experiment_id ==
                Experiment.id
            )
            .where(
                Experiment.dataset_id ==
                dataset_id
            )
            .order_by(
                SignalSample.id
            )
        )

        result = self.session.execute(
            statement
        )

        return result.all()