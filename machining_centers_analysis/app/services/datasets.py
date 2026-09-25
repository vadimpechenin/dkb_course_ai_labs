from app.crud.datasets import DatasetCRUD
from app.schemas.datasets import DatasetsResponse


class DatasetsService:

    def __init__(self, session):

        self.crud = DatasetCRUD(session)

    def get_datasets(self):

        datasets = self.crud.get_datasets()

        return DatasetsResponse(
            datasets=datasets
        )