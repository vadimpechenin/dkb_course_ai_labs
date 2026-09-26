import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import {
    getFeatures
} from "../api/featuresApi";

import type {
    Feature
} from "../types/Feature";

import Features from "../components/features/Features";

import {
    useExperiment
} from "../context/ExperimentContext";


export default function FeaturesPage() {

    const [
        features,
        setFeatures
    ] = useState<Feature[]>();


    const [
        error,
        setError
    ] = useState<string>();


    const {
        selectedDatasetId,
        selectedFeatureIds,
        setSelectedFeatureIds
    } = useExperiment();


    useEffect(() => {

        getFeatures()

            .then(setFeatures)

            .catch((error) => {

                console.error(error);

                setError(
                    "Не удалось загрузить признаки."
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


    if (!features) {

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
                        Признаки
                    </h1>

                    <p>
                        Сначала выберите набор данных
                        на странице «Наборы данных».
                    </p>

                </div>

            </AppLayout>
        );
    }


    return (

        <AppLayout>

            <Features

                features={features}

                selectedFeatureIds={
                    selectedFeatureIds
                }

                onSelectionChange={
                    setSelectedFeatureIds
                }

            />

        </AppLayout>
    );
}