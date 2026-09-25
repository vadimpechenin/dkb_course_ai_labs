from app.crud.datasets import DatasetCRUD


def test_get_datasets():

    crud = DatasetCRUD(
        session=None
    )

    result = crud.get_datasets()

    assert result == []