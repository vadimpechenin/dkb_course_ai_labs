import time

import numpy as np

from sklearn.preprocessing import StandardScaler

from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression

from sklearn.ensemble import RandomForestClassifier

from sklearn.svm import SVC

from sklearn.neural_network import MLPClassifier

from sklearn.model_selection import GroupShuffleSplit

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)


class ClassifierService:


    def build_model(
        self,
        model_type: str
    ):

        if model_type == "logistic_regression":

            return LogisticRegression(
                max_iter=2000,
                random_state=42
            )


        if model_type == "random_forest":

            return RandomForestClassifier(
                n_estimators=200,
                random_state=42,
                n_jobs=-1
            )


        if model_type == "svm":

            return SVC(
                probability=True,
                random_state=42
            )


        if model_type == "xgboost":

            from xgboost import XGBClassifier

            return XGBClassifier(
                n_estimators=200,
                max_depth=6,
                learning_rate=0.05,
                random_state=42,
                eval_metric="mlogloss"
            )


        if model_type == "mlp":

            return MLPClassifier(
                hidden_layer_sizes=(64, 32),
                max_iter=1000,
                random_state=42
            )


        raise ValueError(
            f"Неизвестный тип модели: {model_type}"
        )


    def train(
        self,
        model_type,
        X,
        y,
        groups,
        test_size,
        random_state,
        scaler="standard"
    ):

        splitter = GroupShuffleSplit(
            n_splits=1,
            test_size=test_size,
            random_state=random_state
        )


        train_indices, test_indices = next(
            splitter.split(
                X,
                y,
                groups=groups
            )
        )
        #Преобразование строк в числа
        y = y.astype(int)

        X_train = X[train_indices]
        X_test = X[test_indices]

        y_train = y[train_indices]
        y_test = y[test_indices]


        model = self.build_model(
            model_type
        )


        if scaler == "standard":

            estimator = Pipeline(
                [
                    (
                        "scaler",
                        StandardScaler()
                    ),
                    (
                        "model",
                        model
                    )
                ]
            )

        else:

            estimator = model


        start_time = time.perf_counter()


        estimator.fit(
            X_train,
            y_train
        )


        training_time = (
            time.perf_counter()
            - start_time
        )


        y_pred = estimator.predict(
            X_test
        )


        metrics = {

            "accuracy":
                accuracy_score(
                    y_test,
                    y_pred
                ),

            "precision_weighted":
                precision_score(
                    y_test,
                    y_pred,
                    average="weighted",
                    zero_division=0
                ),

            "recall_weighted":
                recall_score(
                    y_test,
                    y_pred,
                    average="weighted",
                    zero_division=0
                ),

            "f1_weighted":
                f1_score(
                    y_test,
                    y_pred,
                    average="weighted",
                    zero_division=0
                ),

            "training_time":
                training_time,

            "train_size":
                len(train_indices),

            "test_size":
                len(test_indices),

            "train_groups":
                len(
                    set(
                        groups[train_indices]
                    )
                ),

            "test_groups":
                len(
                    set(
                        groups[test_indices]
                    )
                )
        }


        return estimator, metrics