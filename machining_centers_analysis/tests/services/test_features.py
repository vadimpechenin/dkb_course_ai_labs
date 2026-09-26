from app.services.features import (
    FeaturesService
)


class FakeFeature:

    id = "feature-1"

    feature_name = "mean_freq_0"

    display_name = (
        "Mean Frequency — Channel 0"
    )

    description = (
        "Средняя частота спектра"
    )

    data_type = "float"

    enabled = True

    feature_order = 5

    channel = "0"

    unit = "Hz"


class FakeCRUD:

    def get_features(self):

        return [
            FakeFeature()
        ]


def test_get_features():

    service = FeaturesService(
        session=None
    )

    service.crud = FakeCRUD()


    result = service.get_features()


    assert len(
        result.features
    ) == 1


    feature = result.features[0]


    assert feature.id == "feature-1"

    assert (
        feature.feature_name
        == "mean_freq_0"
    )

    assert (
        feature.channel
        == "0"
    )

    assert feature.unit == "Hz"