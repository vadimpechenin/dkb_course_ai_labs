from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.neural_network import MLPRegressor

from xgboost import XGBRegressor
from catboost import CatBoostRegressor


class ModelFactory:

    @staticmethod
    def create(model_name: str, params: dict):

        name = model_name.lower()

        if name == "linear regression":

            allowed = {
                "fit_intercept",
                "positive"
            }

            kwargs = {
                key: value
                for key, value in params.items()
                if key in allowed
            }

            return LinearRegression(**kwargs)

        if name == "random forest":

            allowed = {
                "n_estimators",
                "max_depth",
                "min_samples_split",
                "min_samples_leaf",
                "max_features"
            }

            kwargs = {
                key: value
                for key, value in params.items()
                if key in allowed
            }

            return RandomForestRegressor(
                random_state=42,
                n_jobs=-1,
                **kwargs
            )

        if name == "xgboost":

            allowed = {
                "n_estimators",
                "max_depth",
                "learning_rate",
                "subsample",
                "colsample_bytree"
            }

            kwargs = {
                key: value
                for key, value in params.items()
                if key in allowed
            }

            return XGBRegressor(
                random_state=42,
                n_jobs=-1,
                eval_metric="rmse",
                **kwargs
            )

        if name == "catboost":

            allowed = {
                "iterations",
                "depth",
                "learning_rate",
                "l2_leaf_reg"
            }

            kwargs = {
                key: value
                for key, value in params.items()
                if key in allowed
            }

            return CatBoostRegressor(
                random_seed=42,
                verbose=False,
                **kwargs
            )

        if name == "mlp":

            allowed = {
                "hidden_layer_sizes",
                "activation",
                "solver",
                "alpha",
                "learning_rate",
                "max_iter"
            }

            kwargs = {
                key: value
                for key, value in params.items()
                if key in allowed
            }

            return MLPRegressor(
                random_state=42,
                **kwargs
            )

        raise ValueError(
            f"Неизвестная модель: {model_name}"
        )