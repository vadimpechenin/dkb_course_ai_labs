import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import { getDatasets } from "../api/datasetsApi";

import type { Dataset } from "../types/Dataset";

import Datasets from "../components/datasets/Datasets";

import {
    useExperiment
} from "../context/ExperimentContext";


export default function DatasetsPage() {

    const [
        datasets,
        setDatasets
    ] = useState<Dataset[] | undefined>(undefined);


    const [
        error,
        setError
    ] = useState<string>();


    const {
        selectedDatasetId,
        setSelectedDatasetId
    } = useExperiment();


    useEffect(() => {

        getDatasets()

            .then((response) => {

                setDatasets(
                    response.datasets
                );

            })

            .catch((error) => {

                console.error(error);

                setError(
                    "Не удалось загрузить наборы данных."
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


    if (!datasets) {

        return (
            <AppLayout>

                <div>
                    Loading...
                </div>

            </AppLayout>
        );

    }


    return (

        <AppLayout>

            <Datasets
                datasets={datasets}

                selectedDatasetId={
                    selectedDatasetId
                }

                onSelectDataset={
                    setSelectedDatasetId
                }
            />

        </AppLayout>
    );
}