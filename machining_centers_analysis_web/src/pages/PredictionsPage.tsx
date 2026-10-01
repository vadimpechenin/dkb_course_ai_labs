import { useEffect, useMemo, useState } from "react";

import {
    getTrainingRun,
    getTrainingRuns
} from "../api/trainingApi";
import type {TrainingRunDetail, TrainingRunListItem} from "../types/Training";
import TrainingRunInfo
    from "../components/predictions/TrainingRunInfo";

import {
    getSamples,
} from "../api/datasetsApi";
import type {Sample} from "../types/Dataset";

import {
    createPredictions
} from "../api/predictionsApi";

import type {
    PredictionBatch
} from "../types/Prediction";

import TrainingRunSelector from "../components/predictions/TrainingRunSelector";
import SampleSelector from "../components/predictions/SampleSelector";
import PredictionTable from "../components/predictions/PredictionTable";

export default function PredictionPage() {

    const trainingRunId = "3b796ba159a546cb8899a92e6a9ba30c";

    const [
        trainingRun,
        setTrainingRun
    ] = useState<TrainingRunDetail | null>(null);

        // --------------------------------------------
    // TrainingRuns
    // --------------------------------------------

    const [
        trainingRuns,
        setTrainingRuns
    ] = useState<TrainingRunListItem[]>([]);

    const [
        selectedTrainingRunIds,
        setSelectedTrainingRunIds
    ] = useState<string[]>([]);


    // --------------------------------------------
    // Samples
    // --------------------------------------------

    const [
        samples,
        setSamples
    ] = useState<Sample[]>([]);

    const [
        selectedSampleIds,
        setSelectedSampleIds
    ] = useState<string[]>([]);


    // --------------------------------------------
    // Prediction result
    // --------------------------------------------

    const [
        prediction,
        setPrediction
    ] = useState<PredictionBatch | null>(
        null
    );

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

      // --------------------------------------------
    // State
    // --------------------------------------------

    const [
        loadingTrainingRuns,
        setLoadingTrainingRuns
    ] = useState(false);

    const [
        loadingSamples,
        setLoadingSamples
    ] = useState(false);

    const [
        predicting,
        setPredicting
    ] = useState(false);


     // --------------------------------------------
    // Load TrainingRuns
    // --------------------------------------------

    useEffect(() => {

        async function loadTrainingRuns() {

            setLoadingTrainingRuns(true);
            setError(null);

            try {

                const data =
                    await getTrainingRuns();

                setTrainingRuns(data);

            } catch (error) {

                console.error(
                    "Ошибка загрузки TrainingRun:",
                    error
                );

                setError(
                    "Не удалось загрузить обученные модели"
                );

            } finally {

                setLoadingTrainingRuns(false);
            }
        }

        loadTrainingRuns();

    }, []);


    // --------------------------------------------
    // Dataset IDs of selected models
    // --------------------------------------------

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


    // --------------------------------------------
    // Load samples
    // --------------------------------------------

    useEffect(() => {

        async function loadSamples() {

            if (
                selectedDatasetIds.length === 0
            ) {

                setSamples([]);
                setSelectedSampleIds([]);

                return;
            }

            if (
                selectedDatasetIds.length > 1
            ) {

                setSamples([]);
                setSelectedSampleIds([]);

                return;
            }

            const datasetId =
                selectedDatasetIds[0];

            setLoadingSamples(true);
            setError(null);

            try {

                const data =
                    await getSamples(
                        datasetId
                    );

                setSamples(data);

            } catch (error) {

                console.error(
                    "Ошибка загрузки образцов:",
                    error
                );

                setError(
                    "Не удалось загрузить образцы"
                );

            } finally {

                setLoadingSamples(false);
            }
        }

        loadSamples();

    }, [selectedDatasetIds]);


    // --------------------------------------------
    // Run Prediction
    // --------------------------------------------

    async function handlePrediction() {

        setError(null);
        setPrediction(null);

        if (
            selectedTrainingRunIds.length === 0
        ) {

            setError(
                "Выберите хотя бы одну обученную модель"
            );

            return;
        }

        if (
            selectedSampleIds.length === 0
        ) {

            setError(
                "Выберите хотя бы один образец"
            );

            return;
        }

        setPredicting(true);

        try {

            const result =
                await createPredictions({
                    training_run_ids:
                        selectedTrainingRunIds,

                    sample_ids:
                        selectedSampleIds
                });

            setPrediction(result);

        } catch (error) {

            console.error(
                "Ошибка Prediction:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Ошибка выполнения Prediction"
            );

        } finally {

            setPredicting(false);
        }
    }


    // --------------------------------------------
    // Render
    // --------------------------------------------

    return (
        <div>

            <h1>Prediction</h1>

            {error && (
                <div
                    style={{
                        marginBottom: "15px"
                    }}
                >
                    {error}
                </div>
            )}


            {/* -------------------------------- */}
            {/* TrainingRun selection             */}
            {/* -------------------------------- */}

            {loadingTrainingRuns ? (

                <div>
                    Загрузка обученных моделей...
                </div>

            ) : (

                <TrainingRunSelector
                    trainingRuns={trainingRuns}
                    selectedIds={
                        selectedTrainingRunIds
                    }
                    onChange={
                        setSelectedTrainingRunIds
                    }
                />

            )}


            {/* -------------------------------- */}
            {/* Dataset information               */}
            {/* -------------------------------- */}

            {selectedDatasetIds.length > 1 && (

                <div>
                    Выбранные TrainingRun относятся
                    к разным датасетам. Для одного
                    Prediction необходимо выбрать
                    модели из одного датасета.
                </div>

            )}


            {/* -------------------------------- */}
            {/* Samples                           */}
            {/* -------------------------------- */}

            {selectedDatasetIds.length === 1 && (

                <div>
                    {loadingSamples ? (

                        <div>
                            Загрузка образцов...
                        </div>

                    ) : (

                        <SampleSelector
                            samples={samples}
                            selectedIds={
                                selectedSampleIds
                            }
                            onChange={
                                setSelectedSampleIds
                            }
                        />

                    )}
                </div>

            )}


            {/* -------------------------------- */}
            {/* Prediction button                 */}
            {/* -------------------------------- */}

            <div
                style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}
            >

                <button
                    type="button"
                    disabled={
                        predicting ||
                        selectedTrainingRunIds.length === 0 ||
                        selectedSampleIds.length === 0 ||
                        selectedDatasetIds.length !== 1
                    }
                    onClick={
                        handlePrediction
                    }
                >
                    {predicting
                        ? "Выполнение..."
                        : "Выполнить Prediction"}
                </button>

            </div>


            {/* -------------------------------- */}
            {/* Result                            */}
            {/* -------------------------------- */}

            {prediction && (

                <PredictionTable
                    predictions={
                        prediction.predictions
                    }
                    sampleIds={
                        prediction.sample_ids
                    }
                />

            )}

        </div>
    );
}