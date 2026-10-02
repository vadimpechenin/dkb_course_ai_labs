import {
    useEffect,
    useMemo,
    useState
} from "react";

import AppLayout
    from "../components/layout/AppLayout";

import {
    getTrainingRuns
} from "../api/trainingApi";
import type {TrainingRunListItem} from "../types/Training"
import {
    createPredictions
} from "../api/predictionsApi";

import type {
    PredictionBatch
} from "../types/Prediction";

import TrainingRunSelector from "../components/predictions/TrainingRunSelector";
import PredictionTable from "../components/predictions/PredictionTable";


export default function PredictionPage() {

    const [
        trainingRuns,
        setTrainingRuns
    ] = useState<TrainingRunListItem[]>([]);

    const [
        selectedTrainingRunIds,
        setSelectedTrainingRunIds
    ] = useState<string[]>([]);

    const [
        selectedFile,
        setSelectedFile
    ] = useState<File | null>(null);

    const [
        prediction,
        setPrediction
    ] = useState<PredictionBatch | null>(
        null
    );

    const [
        loadingTrainingRuns,
        setLoadingTrainingRuns
    ] = useState(false);

    const [
        predicting,
        setPredicting
    ] = useState(false);

    const [
        error,
        setError
    ] = useState<string | null>(null);


    /*
     * Загрузка списка обученных моделей.
     */
    useEffect(() => {

        async function loadTrainingRuns() {

            setLoadingTrainingRuns(true);
            setError(null);

            try {

                const runs =
                    await getTrainingRuns();

                setTrainingRuns(runs);

            } catch (error) {

                console.error(
                    "Ошибка загрузки TrainingRun:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Не удалось загрузить обученные модели"
                );

            } finally {

                setLoadingTrainingRuns(false);
            }
        }

        loadTrainingRuns();

    }, []);


    /*
     * Dataset, к которым относятся
     * выбранные TrainingRun.
     *
     * Для одного Prediction все модели
     * должны быть обучены на одном Dataset.
     */
    const selectedDatasetIds =
        useMemo(() => {

            const ids = new Set<string>();

            for (
                const trainingRun
                of trainingRuns
            ) {

                if (
                    selectedTrainingRunIds.includes(
                        trainingRun.id
                    )
                ) {

                    ids.add(
                        trainingRun.dataset_id
                    );
                }
            }

            return Array.from(ids);

        }, [
            trainingRuns,
            selectedTrainingRunIds
        ]);


    /*
     * Выбор JSON-файла.
     */
    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0] ?? null;

        setSelectedFile(file);

        /*
         * Старый результат больше
         * не относится к новому файлу.
         */
        setPrediction(null);

        setError(null);
    }


    /*
     * Выполнение Prediction.
     */
    async function handlePrediction() {

        setError(null);
        setPrediction(null);


        if (
            selectedTrainingRunIds.length === 0
        ) {

            setError(
                "Выберите хотя бы одну обученную модель."
            );

            return;
        }


        if (
            selectedDatasetIds.length !== 1
        ) {

            setError(
                "Все выбранные TrainingRun "
                + "должны относиться к одному Dataset."
            );

            return;
        }


        if (!selectedFile) {

            setError(
                "Выберите JSON-файл с данными."
            );

            return;
        }


        setPredicting(true);

        try {

            const result =
                await createPredictions(
                    selectedTrainingRunIds,
                    selectedFile
                );

            setPrediction(result);

        } catch (error) {

            console.error(
                "Ошибка Prediction:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Ошибка выполнения Prediction."
            );

        } finally {

            setPredicting(false);
        }
    }


    /*
     * Очистка выбора моделей.
     */
    function handleClearModels() {

        setSelectedTrainingRunIds([]);

        setPrediction(null);
        setError(null);
    }


    return (
        <AppLayout>
        <div>

            <h1>
                Prediction
            </h1>


            {error && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        border: "1px solid #cc0000",
                        borderRadius: "4px"
                    }}
                >
                    {error}
                </div>
            )}


            {/* ---------------------------------------- */}
            {/* Обученные модели */}
            {/* ---------------------------------------- */}

            <section>

                {loadingTrainingRuns ? (

                    <div>
                        Загрузка обученных моделей...
                    </div>

                ) : (

                    <>
                        <TrainingRunSelector
                            trainingRuns={
                                trainingRuns
                            }
                            selectedIds={
                                selectedTrainingRunIds
                            }
                            onChange={
                                setSelectedTrainingRunIds
                            }
                        />

                        {selectedTrainingRunIds.length > 0 && (
                            <button
                                type="button"
                                onClick={
                                    handleClearModels
                                }
                                style={{
                                    marginTop: "10px"
                                }}
                            >
                                Снять выбор моделей
                            </button>
                        )}
                    </>
                )}

            </section>


            {/* ---------------------------------------- */}
            {/* Проверка Dataset */}
            {/* ---------------------------------------- */}

            {selectedTrainingRunIds.length > 0 && (
                <section
                    style={{
                        marginTop: "20px"
                    }}
                >

                    <div>
                        <strong>
                            Выбрано моделей:
                        </strong>{" "}
                        {
                            selectedTrainingRunIds.length
                        }
                    </div>

                    <div>
                        <strong>
                            Dataset:
                        </strong>{" "}

                        {selectedDatasetIds.length === 1
                            ? selectedDatasetIds[0]
                            : "несколько Dataset"}
                    </div>


                    {selectedDatasetIds.length > 1 && (
                        <div
                            style={{
                                marginTop: "10px",
                                padding: "10px",
                                border: "1px solid #cc0000",
                                borderRadius: "4px"
                            }}
                        >
                            Нельзя одновременно выполнять
                            Prediction для моделей,
                            обученных на разных Dataset.
                            Выберите модели только
                            одного Dataset.
                        </div>
                    )}

                </section>
            )}


            {/* ---------------------------------------- */}
            {/* JSON */}
            {/* ---------------------------------------- */}

            <section
                style={{
                    marginTop: "30px"
                }}
            >

                <h2>
                    Файл данных
                </h2>

                <p>
                    Загрузите JSON с образцами,
                    фактическим износом и признаками.
                </p>

                <input
                    type="file"
                    accept=".json,application/json"
                    onChange={
                        handleFileChange
                    }
                />


                {selectedFile && (
                    <div
                        style={{
                            marginTop: "10px"
                        }}
                    >

                        <div>
                            <strong>
                                Файл:
                            </strong>{" "}
                            {selectedFile.name}
                        </div>

                        <div>
                            <strong>
                                Размер:
                            </strong>{" "}
                            {(
                                selectedFile.size / 1024
                            ).toFixed(1)}{" "}
                            KB
                        </div>

                    </div>
                )}

            </section>


            {/* ---------------------------------------- */}
            {/* Кнопка Prediction */}
            {/* ---------------------------------------- */}

            <section
                style={{
                    marginTop: "25px"
                }}
            >

                <button
                    type="button"
                    onClick={
                        handlePrediction
                    }
                    disabled={
                        predicting ||
                        selectedTrainingRunIds.length === 0 ||
                        selectedDatasetIds.length !== 1 ||
                        !selectedFile
                    }
                >
                    {predicting
                        ? "Выполнение прогноза..."
                        : "Выполнить прогноз"}
                </button>

            </section>


            {/* ---------------------------------------- */}
            {/* Результат */}
            {/* ---------------------------------------- */}

            {prediction && (
                <section
                    style={{
                        marginTop: "35px"
                    }}
                >

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <strong>
                            PredictionBatch:
                        </strong>{" "}
                        {prediction.id}

                    </div>


                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <strong>
                            Образцов:
                        </strong>{" "}
                        {
                            prediction.sample_ids.length
                        }

                    </div>


                    <PredictionTable
                        predictions={
                            prediction.predictions
                        }
                        sampleIds={
                            prediction.sample_ids
                        }
                    />

                </section>
            )}

        </div>
            </AppLayout>
    );
}