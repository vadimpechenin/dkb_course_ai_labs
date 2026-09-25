import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import {
    getDatasets,
    type Dataset,
} from "../api/datasetsApi";

import Datasets from "../components/datasets/Datasets";


export default function DatasetsPage() {

    const [datasets, setDatasets] = useState<Dataset[]>();
    const [error, setError] = useState<string>();


    useEffect(() => {

        getDatasets()
            .then(setDatasets)
            .catch(() => {
                setError(
                    "Не удалось загрузить наборы данных."
                );
            });

    }, []);


    if (error) {
        return <div>{error}</div>;
    }


    if (!datasets) {
        return <div>Loading...</div>;
    }


    return (
        <AppLayout>
        <Datasets
            datasets={datasets}
        />
        </AppLayout>
    );
}