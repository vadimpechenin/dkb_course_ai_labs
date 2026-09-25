from app.services.datasets import DatasetsService


class FakeDataset:

    id = "dataset-1"
    name = "Test Dataset"
    description = "Test description"
    source_type = "laboratory"
    source_name = "Samara University"
    samples_count = 100
    tools_count = 2


class FakeCRUD:

    def get_datasets(self):
        return [FakeDataset()]


def test_get_datasets():

    service = DatasetsService(session=None)

    service.crud = FakeCRUD()

    result = service.get_datasets()

    assert len(result.datasets) == 1

    dataset = result.datasets[0]

    assert dataset.id == "dataset-1"
    assert dataset.name == "Test Dataset"
    assert dataset.samples_count == 100
    assert dataset.tools_count == 2