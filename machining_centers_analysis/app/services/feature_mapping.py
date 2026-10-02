from sqlalchemy import select

from app.db.models.feature_setting import FeatureSetting


class FeatureMappingService:

    def __init__(self, session):
        self.session = session

        self.id_to_name = {}
        self.name_to_id = {}

        self._load()

    def _load(self):
        statement = (
            select(
                FeatureSetting.id,
                FeatureSetting.feature_name
            )
            .order_by(
                FeatureSetting.feature_order
            )
        )

        result = self.session.execute(
            statement
        )

        rows = result.all()

        for feature_id, feature_name in rows:

            self.id_to_name[
                feature_id
            ] = feature_name

            self.name_to_id[
                feature_name
            ] = feature_id

    def get_feature_name(
            self,
            feature_id: str
    ) -> str:

        feature_name = (
            self.id_to_name.get(
                feature_id
            )
        )

        if feature_name is None:
            raise ValueError(
                f"FeatureSetting "
                f"{feature_id} не найден"
            )

        return feature_name

    def extract_values(
            self,
            features: dict,
            feature_ids: list[str],
            source_name: str = "JSON"
    ) -> list[float]:

        if not isinstance(
            features,
            dict
        ):
            raise ValueError(
                f"{source_name}: "
                "features должен быть JSON-объектом"
            )

        values = []

        for feature_id in feature_ids:

            feature_name = (
                self.get_feature_name(
                    feature_id
                )
            )

            if feature_name not in features:

                raise ValueError(
                    f"{source_name}: "
                    f"отсутствует признак "
                    f"{feature_name} "
                    f"(id={feature_id})"
                )

            value = features[
                feature_name
            ]

            try:
                value = float(value)
            except (TypeError, ValueError):

                raise ValueError(
                    f"{source_name}: "
                    f"признак {feature_name} "
                    f"имеет нечисловое значение: "
                    f"{value}"
                )

            values.append(value)

        return values

    def validate_features(
            self,
            features: dict,
            source_name: str = "JSON"
    ):

        if not isinstance(
            features,
            dict
        ):
            raise ValueError(
                f"{source_name}: "
                "features должен быть JSON-объектом"
            )

        missing = []

        for feature_name in self.name_to_id:

            if feature_name not in features:
                missing.append(
                    feature_name
                )

        if missing:

            raise ValueError(
                f"{source_name}: "
                "отсутствуют признаки: "
                + ", ".join(missing)
            )

        return True