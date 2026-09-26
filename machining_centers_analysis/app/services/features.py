from app.crud.features import FeatureCRUD

from app.schemas.features import (
    FeatureResponse,
    FeaturesResponse
)


class FeaturesService:

    def __init__(self, session):

        self.crud = FeatureCRUD(session)


    def get_features(self):

        features = self.crud.get_features()

        result = []

        for feature in features:

            result.append(
                FeatureResponse(
                    id=feature.id,

                    feature_name=feature.feature_name,

                    display_name=feature.display_name,

                    description=feature.description,

                    data_type=feature.data_type,

                    enabled=(
                        feature.enabled
                        if feature.enabled is not None
                        else True
                    ),

                    feature_order=feature.feature_order,

                    channel=feature.channel,

                    unit=feature.unit
                )
            )

        return FeaturesResponse(
            features=result
        )


    def get_feature(
        self,
        feature_id: str
    ):

        feature = (
            self.crud.get_feature_by_id(
                feature_id
            )
        )

        if feature is None:
            return None


        return FeatureResponse(
            id=feature.id,

            feature_name=feature.feature_name,

            display_name=feature.display_name,

            description=feature.description,

            data_type=feature.data_type,

            enabled=(
                feature.enabled
                if feature.enabled is not None
                else True
            ),

            feature_order=feature.feature_order,

            channel=feature.channel,

            unit=feature.unit
        )