from app.services.datasets import DatasetsService


class FakeCRUD:

    def get_datasets(self):

        return []


def test_get_datasets():

    service = DatasetsService(
        session=None
    )

    service.crud = FakeCRUD()

    result = service.get_datasets()

    assert result.datasets == []