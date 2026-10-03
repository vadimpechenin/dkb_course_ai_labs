import {
    useEffect,
    useState
} from "react";

import AppLayout
    from "../components/layout/AppLayout";
import {
    getTrainingRuns,
} from "../api/trainingApi";

import type {
    PredictionHistoryItem
} from "../types/Prediction";

import type {
    TrainingRunListItem
} from "../types/Training";
import {
    getPredictionHistory,
    getPredictionHistoryItem,
    deletePredictionHistoryItem,
} from "../api/predictionsApi";

import type {
    PredictionBatch
} from "../types/Prediction";

import TrainingRunSelector
    from "../components/predictions/TrainingRunSelector";

import PredictionWearChart
    from "../components/predictions/PredictionWearChart";

import PredictionMetrics
    from "../components/predictions/PredictionMetrics";

import PredictionTable
    from "../components/predictions/PredictionTable";


export default function HistoryPage() {

    const [
        trainingRuns,
        setTrainingRuns
    ] = useState<TrainingRunListItem[]>([]);

    const [
        selectedTrainingRunIds,
        setSelectedTrainingRunIds
    ] = useState<string[]>([]);

    const [
        history,
        setHistory
    ] = useState<PredictionHistoryItem[]>([]);

    const [
        selectedBatch,
        setSelectedBatch
    ] = useState<PredictionBatch | null>(
        null
    );

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        loadingResult,
        setLoadingResult
    ] = useState(false);

    const [
        deleting,
        setDeleting
    ] = useState(false);

    const [
        error,
        setError
    ] = useState<string | null>(
        null
    );


    useEffect(() => {

        async function loadTrainingRuns() {

            try {

                const runs =
                    await getTrainingRuns();

                setTrainingRuns(runs);

            } catch (error) {

                setError(
                    error instanceof Error
                        ? error.message
                        : "Ошибка загрузки моделей"
                );
            }
        }

        loadTrainingRuns();

    }, []);


    useEffect(() => {

        async function loadHistory() {

            setLoading(true);
            setError(null);

            try {

                const items =
                    await getPredictionHistory(
                        selectedTrainingRunIds
                    );

                setHistory(items);

            } catch (error) {

                setError(
                    error instanceof Error
                        ? error.message
                        : "Ошибка загрузки истории"
                );

            } finally {

                setLoading(false);
            }
        }

        loadHistory();

        setSelectedBatch(null);

    }, [
        selectedTrainingRunIds
    ]);


    async function handleSelectBatch(
        batchId: string
    ) {

        setLoadingResult(true);
        setError(null);

        try {

            const result =
                await getPredictionHistoryItem(
                    batchId
                );

            setSelectedBatch(result);

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Ошибка загрузки результата"
            );

        } finally {

            setLoadingResult(false);
        }
    }


    async function handleDeleteBatch(
        batch: PredictionHistoryItem
    ) {

        const confirmed =
            window.confirm(
                `Удалить Prediction от ${
                    formatDate(
                        batch.created_at
                    )
                }?\n\n` +
                `Будет удалено ${
                    batch.sample_count
                } образцов и все результаты выбранных моделей.\n\n` +
                "Операцию нельзя отменить."
            );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError(null);

        try {

            await deletePredictionHistoryItem(
                batch.id
            );

            setHistory(
                current =>
                    current.filter(
                        item =>
                            item.id !==
                            batch.id
                    )
            );

            if (
                selectedBatch?.id ===
                batch.id
            ) {
                setSelectedBatch(null);
            }

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Ошибка удаления Prediction"
            );

        } finally {

            setDeleting(false);
        }
    }


    return (
        <AppLayout>
        <div>

            <h1>
                История
            </h1>

            {error && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        border:
                            "1px solid #cc0000",
                        borderRadius: "4px"
                    }}
                >
                    {error}
                </div>
            )}


            {/* ================================= */}
            {/* Фильтр по обученным моделям */}
            {/* ================================= */}

            <section>

                <h2>
                    Модели
                </h2>

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

            </section>


            {/* ================================= */}
            {/* История */}
            {/* ================================= */}

            <section
                style={{
                    marginTop: "30px"
                }}
            >

                <h2>
                    История прогнозов
                </h2>

                {loading ? (

                    <div>
                        Загрузка истории...
                    </div>

                ) : history.length === 0 ? (

                    <div>
                        Prediction ещё не выполнялся.
                    </div>

                ) : (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >

                        {history.map(
                            batch => (

                                <div
                                    key={
                                        batch.id
                                    }
                                    style={{
                                        border:
                                            "1px solid #ccc",
                                        borderRadius:
                                            "5px",
                                        padding:
                                            "12px"
                                    }}
                                >

                                    <div>
                                        <strong>
                                            {
                                                formatDate(
                                                    batch.created_at
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div
                                        style={{
                                            marginTop:
                                                "5px"
                                        }}
                                    >
                                        Модели:{" "}
                                        {
                                            batch.model_names.join(
                                                ", "
                                            )
                                        }
                                    </div>

                                    <div>
                                        Образцов:{" "}
                                        {
                                            batch.sample_count
                                        }
                                    </div>

                                    <div
                                        style={{
                                            marginTop:
                                                "10px",
                                            display:
                                                "flex",
                                            gap:
                                                "10px"
                                        }}
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSelectBatch(
                                                    batch.id
                                                )
                                            }
                                        >
                                            Открыть результаты
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                deleting
                                            }
                                            onClick={() =>
                                                handleDeleteBatch(
                                                    batch
                                                )
                                            }
                                            style={{
                                                color:
                                                    "#b71c1c"
                                            }}
                                        >
                                            Удалить
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>
                )}

            </section>


            {/* ================================= */}
            {/* Результаты */}
            {/* ================================= */}

            {loadingResult && (
                <section
                    style={{
                        marginTop: "30px"
                    }}
                >
                    Загрузка результата...
                </section>
            )}


            {selectedBatch && (
                <section
                    style={{
                        marginTop: "40px"
                    }}
                >

                    <h2>
                        Результаты прогноза
                    </h2>

                    <div
                        style={{
                            marginBottom:
                                "20px"
                        }}
                    >
                        <strong>
                            PredictionBatch:
                        </strong>{" "}
                        {
                            selectedBatch.id
                        }
                    </div>


                    <PredictionWearChart
                        predictions={
                            selectedBatch.predictions
                        }
                    />


                    <div
                        style={{
                            marginTop: "40px"
                        }}
                    >

                        <PredictionMetrics
                            predictions={
                                selectedBatch.predictions
                            }
                        />

                    </div>


                    <div
                        style={{
                            marginTop: "40px"
                        }}
                    >

                        <PredictionTable
                            predictions={
                                selectedBatch.predictions
                            }
                            sampleIds={
                                selectedBatch.sample_ids
                            }
                        />

                    </div>

                </section>
            )}

        </div>
    </AppLayout>
    );
}


function formatDate(
    value: string | null
): string {

    if (!value) {
        return "Дата неизвестна";
    }

    return new Date(
        value
    ).toLocaleString(
        "ru-RU"
    );
}