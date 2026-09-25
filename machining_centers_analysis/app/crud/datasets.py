from sqlalchemy import select, func

from app.db.models.datasets import Dataset
from app.db.models.tools import Tool
from app.db.models.experiments import Experiment
from app.db.models.signal_samples import SignalSample

class DatasetCRUD:

    def __init__(self, session):
        self.session = session

    def get_datasets(self):
        statement = (
            select(Dataset)
            .order_by(Dataset.name)
        )

        result = self.session.execute(statement)

        return result.scalars().all()

    def get_dataset_by_id(self, dataset_id: str):
        statement = (
            select(Dataset)
            .where(Dataset.id == dataset_id)
        )

        result = self.session.execute(statement)

        return result.scalars().first()

    def get_dataset_statistics(
            self,
            dataset_id: str
    ):
        tools_statement = (
            select(
                func.count(Tool.id)
            )
            .where(
                Tool.dataset_id == dataset_id
            )
        )

        experiments_statement = (
            select(
                func.count(Experiment.id)
            )
            .where(
                Experiment.dataset_id == dataset_id
            )
        )

        samples_statement = (
            select(
                func.count(SignalSample.id)
            )
            .join(
                Experiment,
                SignalSample.experiment_id
                == Experiment.id
            )
            .where(
                Experiment.dataset_id
                == dataset_id
            )
        )

        tools_count = self.session.execute(
            tools_statement
        ).scalar()

        experiments_count = self.session.execute(
            experiments_statement
        ).scalar()

        samples_count = self.session.execute(
            samples_statement
        ).scalar()

        return {
            "tools_count": tools_count or 0,
            "experiments_count": experiments_count or 0,
            "samples_count": samples_count or 0
        }