from sqlalchemy import select

from app.db.models.training_run import TrainingRun
from app.db.models.ml_model import MLModel
from app.db.models.datasets import Dataset
from app.db.models.model_file import ModelFile

from app.crud.feature_vector import (
    FeatureVectorCRUD
)


class TrainingCRUD:

    def __init__(self, session):

        self.session = session


    def get_models_by_ids(
        self,
        model_ids
    ):

        statement = (
            select(MLModel)
            .where(
                MLModel.id.in_(
                    model_ids
                ),
                MLModel.active == True
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().all()


    def get_feature_vectors(
        self,
        dataset_id
    ):

        crud = FeatureVectorCRUD(
            self.session
        )

        return crud.get_vectors_for_dataset(
            dataset_id
        )


    def create_training_run(
        self,
        training_run
    ):

        self.session.add(
            training_run
        )

        self.session.commit()

        self.session.refresh(
            training_run
        )

        return training_run


    def create_model_file(
        self,
        model_file
    ):

        self.session.add(
            model_file
        )

        self.session.commit()

        self.session.refresh(
            model_file
        )

        return model_file

    def get_training_runs(
            self
    ):
        statement = (
            select(TrainingRun)
            .order_by(
                TrainingRun.created_at.desc()
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().all()

    def get_training_run(
            self,
            training_run_id
    ):
        statement = (
            select(TrainingRun)
            .where(
                TrainingRun.id ==
                training_run_id
            )
        )

        result = self.session.execute(
            statement
        )

        return result.scalars().first()

class TrainingRunCRUD:

    def __init__(self, session):
        self.session = session

    def get_training_run_by_id(
        self,
        training_run_id: str
    ):
        statement = (
            select(
                TrainingRun,
                MLModel,
                Dataset
            )
            .join(
                MLModel,
                TrainingRun.model_id == MLModel.id
            )
            .join(
                Dataset,
                TrainingRun.dataset_id == Dataset.id
            )
            .where(
                TrainingRun.id == training_run_id
            )
        )

        result = self.session.execute(statement)

        return result.first()

    def get_model_files(
            self,
            training_run_id: str
    ):
        statement = (
            select(ModelFile)
            .where(
                ModelFile.training_run_id == training_run_id
            )
            .order_by(ModelFile.created_at)
        )

        result = self.session.execute(statement)

        return result.scalars().all()