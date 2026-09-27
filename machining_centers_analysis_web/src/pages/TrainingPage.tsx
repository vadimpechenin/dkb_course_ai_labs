import {
    useEffect,
    useState
} from "react";

import AppLayout
    from "../components/layout/AppLayout";

import {
    getModels
} from "../api/modelsApi";

import {
    startTraining,
    type TrainingRun
} from "../api/trainingApi";

import type {
    MLModel
} from "../types/MLModel";

import TrainingModels
    from "../components/training/TrainingModels";

import {
    useExperiment
} from "../context/ExperimentContext";


export default function TrainingPage() {

    const [
        models,
        setModels
    ] = useState<MLModel[]>();


    const [
        results,
        setResults
    ] = useState<TrainingRun[]>();


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState<string>();


    const {

        selectedDatasetId,

        selectedFeatureIds,

        selectedModelIds,

        setSelectedModelIds

    } = useExperiment();


    useEffect(() => {

        getModels()

            .then(setModels)

            .catch((error) => {

                console.error(error);

                setError(
                    "Не удалось загрузить алгоритмы."
                );

            });

    }, []);


    if (error) {

        return (

            <AppLayout>

                <div>
                    {error}
                </div>

            </AppLayout>
        );
    }


    if (!models) {

        return (

            <AppLayout>

                <div>
                    Loading...
                </div>

            </AppLayout>
        );
    }


    if (!selectedDatasetId) {

        return (

            <AppLayout>

                <div>

                    <h1>
                        Обучение
                    </h1>

                    <p>
                        Сначала выберите
                        набор данных.
                    </p>

                </div>

            </AppLayout>
        );
    }


    if (
        selectedFeatureIds.length === 0
    ) {

        return (

            <AppLayout>

                <div>

                    <h1>
                        Обучение
                    </h1>

                    <p>
                        Сначала выберите
                        признаки.
                    </p>

                </div>

            </AppLayout>
        );
    }


    const train = async () => {

        if (
            selectedModelIds.length === 0
        ) {

            setError(
                "Выберите хотя бы один алгоритм."
            );

            return;
        }


        setError(undefined);

        setLoading(true);


        try {

            const response =
                await startTraining({

                    dataset_id:
                        selectedDatasetId,

                    feature_ids:
                        selectedFeatureIds,

                    model_ids:
                        selectedModelIds,

                    test_size: 0.2,

                    random_state: 42,

                    scaler: "standard"

                });


            setResults(
                response.training_runs
            );


        } catch (error) {

            console.error(error);

            setError(
                "Ошибка при обучении моделей."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <AppLayout>

            <div>

                <h1>
                    Обучение моделей
                </h1>


                <p>
                    Выберите алгоритмы,
                    которые будут обучены
                    на выбранном наборе данных.
                </p>


                <TrainingModels

                    models={models}

                    selectedModelIds={
                        selectedModelIds
                    }

                    onSelectionChange={
                        setSelectedModelIds
                    }

                />


                <hr />


                <h2>
                    Параметры
                </h2>


                <p>
                    Размер тестовой выборки:
                    <strong>
                        {" "}20%
                    </strong>
                </p>


                <p>
                    Разбиение:
                    <strong>
                        {" "}по инструментам
                    </strong>
                </p>


                <button
                    type="button"
                    disabled={
                        loading ||
                        selectedModelIds.length === 0
                    }
                    onClick={train}
                >

                    {loading
                        ? "Обучение..."
                        : "Обучить выбранные модели"}

                </button>


                {results && (

                    <TrainingResults
                        results={results}
                    />

                )}

            </div>

        </AppLayout>
    );
}