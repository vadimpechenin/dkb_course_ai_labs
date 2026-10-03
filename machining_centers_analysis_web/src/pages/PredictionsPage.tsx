import {
    useEffect,
    useMemo,
    useState
} from "react";

import PredictionWearChart
    from "../components/predictions/PredictionWearChart";

import PredictionMetrics
    from "../components/predictions/PredictionMetrics";

import AppLayout
    from "../components/layout/AppLayout";

import {
    getTrainingRuns
} from "../api/trainingApi";
import type {TrainingRunListItem} from "../types/Training"
import {
    createPredictions,
    deleteTrainingRuns
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
    const [deleting, setDeleting] =
        useState(false);

    const [deleteMessage, setDeleteMessage] =
        useState<string | null>(null);

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

    async function handleDeleteTrainingRuns() {

        if (
            selectedTrainingRunIds.length === 0
        ) {
            setError(
                "Выберите хотя бы одну обученную модель."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Удалить выбранные модели (${selectedTrainingRunIds.length})?\n\n` +
                "Будут удалены:\n" +
                "• записи TrainingRun;\n" +
                "• связанные ModelFile;\n" +
                "• результаты Prediction этих моделей;\n" +
                "• папки моделей с диска.\n\n" +
                "Операцию нельзя отменить."
            );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError(null);
        setDeleteMessage(null);

        try {

            const result =
                await deleteTrainingRuns(
                    selectedTrainingRunIds
                );

            /*
             * Удаляем модели из текущего списка
             * без обязательного повторного GET.
             */
            setTrainingRuns(
                current =>
                    current.filter(
                        trainingRun =>
                            !selectedTrainingRunIds.includes(
                                trainingRun.id
                            )
                    )
            );

            setSelectedTrainingRunIds([]);

            setPrediction(null);

            setDeleteMessage(
                `Удалено моделей: ${
                    result.deleted_training_run_ids.length
                }. ` +
                `Удалено ModelFile: ${
                    result.deleted_model_files
                }.`
            );

            if (
                result.file_errors.length > 0
            ) {
                setError(
                    "Модели из БД удалены, но некоторые папки " +
                    "не удалось удалить с диска."
                );

                console.error(
                    "Ошибки удаления файлов:",
                    result.file_errors
                );
            }

        } catch (error) {

            console.error(
                "Ошибка удаления моделей:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Не удалось удалить выбранные модели."
            );

        } finally {

            setDeleting(false);
        }
    }

    return (
        <AppLayout>
        <div>

            <h1>
                Прогноз
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
            {deleteMessage && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        border: "1px solid #2e7d32",
                        borderRadius: "4px"
                    }}
                >
                    {deleteMessage}
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
                            <div>
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

                                <button
                                    type="button"
                                    onClick={handleDeleteTrainingRuns}
                                    disabled={deleting}
                                    style={{
                                        color: "#b71c1c",
                                        borderColor: "#b71c1c"
                                    }}
                                >
                                    {deleting
                                        ? "Удаление..."
                                        : `Удалить выбранные модели (${selectedTrainingRunIds.length})`
                                    }
                                </button>

                            </div>

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

        {/* ===================================== */}
        {/* 1. График Wear */}
        {/* ===================================== */}

        <PredictionWearChart
            predictions={
                prediction.predictions
            }
        />

        {/* ===================================== */}
        {/* 2. Метрики */}
        {/* ===================================== */}

        <div
            style={{
                marginTop: "40px"
            }}
        >
            <PredictionMetrics
                predictions={
                    prediction.predictions
                }
            />
        </div>

        {/* ===================================== */}
        {/* 3. Таблица */}
        {/* ===================================== */}

        <div
            style={{
                marginTop: "40px"
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
                {prediction.sample_ids.length}
            </div>

            <PredictionTable
                predictions={
                    prediction.predictions
                }
                sampleIds={
                    prediction.sample_ids
                }
            />

        </div>

    </section>
)}

        </div>
            </AppLayout>
    );
}