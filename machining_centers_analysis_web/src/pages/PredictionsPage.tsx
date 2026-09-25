import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import {
    getPredictions,
    type Prediction,
} from "../api/predictionsApi";

import Predictions from "../components/predictions/Predictions";


export default function PredictionsPage() {

    const [predictions, setPredictions] =
        useState<Prediction[]>();

    const [error, setError] =
        useState<string>();


    useEffect(() => {

        getPredictions()
            .then(setPredictions)
            .catch(() => {
                setError(
                    "Не удалось загрузить результаты классификации."
                );
            });

    }, []);


    if (error) {
        return <div>{error}</div>;
    }


    if (!predictions) {
        return <div>Loading...</div>;
    }


    return (
        <AppLayout>
        <Predictions
            predictions={predictions}
        />
        </AppLayout>
    );
}