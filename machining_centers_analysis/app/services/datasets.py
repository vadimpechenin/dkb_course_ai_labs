from app.crud.datasets import DatasetCRUD
from app.schemas.datasets import (
    DatasetResponse,
    DatasetsResponse,
    DatasetStatisticsResponse
)


class DatasetsService:

    def __init__(self, session):
        self.crud = DatasetCRUD(session)

    def get_datasets(self):

        datasets = self.crud.get_datasets()

        result = []

        for dataset in datasets:
            result.append(
                DatasetResponse(
                    id=dataset.id,
                    name=dataset.name,
                    description=dataset.description,
                    source_type=dataset.source_type,
                    source_name=dataset.source_name,
                    samples_count=dataset.samples_count or 0,
                    tools_count=dataset.tools_count or 0
                )
            )

        return DatasetsResponse(
            datasets=result
        )

    def get_dataset(self, dataset_id: str):

        dataset = self.crud.get_dataset_by_id(dataset_id)

        if dataset is None:
            return None

        return DatasetResponse(
            id=dataset.id,
            name=dataset.name,
            description=dataset.description,
            source_type=dataset.source_type,
            source_name=dataset.source_name,
            samples_count=dataset.samples_count or 0,
            tools_count=dataset.tools_count or 0
        )

    def get_dataset_statistics(
            self,
            dataset_id: str
    ):

        dataset = self.crud.get_dataset_by_id(
            dataset_id
        )

        if dataset is None:
            return None

        statistics = (
            self.crud.get_dataset_statistics(
                dataset_id
            )
        )

        return DatasetStatisticsResponse(

            dataset_id=dataset_id,

            tools_count=statistics[
                "tools_count"
            ],

            experiments_count=statistics[
                "experiments_count"
            ],

            samples_count=statistics[
                "samples_count"
            ]
        )