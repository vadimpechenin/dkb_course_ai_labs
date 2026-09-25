import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import {
    getTraining,
    type TrainingPageData,
} from "../api/trainingApi";

import Training from "../components/training/Training";


export default function TrainingPage() {

    const [training, setTraining] =
        useState<TrainingPageData>();

    const [error, setError] =
        useState<string>();


    useEffect(() => {

        getTraining()
            .then(setTraining)
            .catch(() => {
                setError(
                    "Не удалось загрузить страницу обучения."
                );
            });

    }, []);


    if (error) {
        return <div>{error}</div>;
    }


    if (!training) {
        return <div>Loading...</div>;
    }


    return (
        <AppLayout>
        <Training
            training={training}
        />
        </AppLayout>
    );
}