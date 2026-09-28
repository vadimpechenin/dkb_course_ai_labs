import { useEffect, useState } from "react";

import {
    getTrainingRun
} from "../api/trainingApi";
import type TrainingRunDetail from "../types/Training";
import TrainingRunInfo
    from "../components/predictions/TrainingRunInfo";


export default function PredictionPage() {

    const trainingRunId = "2a2f2a8aa86e4e2c805323904218d534";

    const [
        trainingRun,
        setTrainingRun
    ] = useState<TrainingRunDetail | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        async function loadTrainingRun() {

            setLoading(true);
            setError(null);

            try {

                const data =
                    await getTrainingRun(
                        trainingRunId
                    );

                setTrainingRun(data);

            } catch (error) {

                console.error(
                    "Ошибка загрузки TrainingRun:",
                    error
                );

                setError(
                    "Не удалось загрузить TrainingRun"
                );

            } finally {

                setLoading(false);
            }
        }

        loadTrainingRun();

    }, [trainingRunId]);


    if (loading) {
        return <div>Загрузка модели...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!trainingRun) {
        return (
            <div>
                TrainingRun не найден
            </div>
        );
    }


    return (
        <div>
            <h1>Prediction</h1>

            <TrainingRunInfo
                trainingRun={trainingRun}
            />
        </div>
    );
}