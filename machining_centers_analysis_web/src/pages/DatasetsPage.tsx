import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getDatasets } from "../api/datasetsApi";
import type { Dataset } from "../types/Dataset";
import Datasets from "../components/datasets/Datasets";

export default function DatasetsPage() {
    // Инициализируем undefined, чтобы срабатывал экран загрузки "Loading..."
    const [datasets, setDatasets] = useState<Dataset[] | undefined>(undefined);
    const [error, setError] = useState<string>();

    useEffect(() => {
        getDatasets()
            .then((response) => {
                // Достаем массив datasets из объекта ответа { datasets: [] }
                setDatasets(response.datasets);
            })
            .catch(() => {
                setError("Не удалось загрузить наборы данных.");
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
            <Datasets datasets={datasets} />
        </AppLayout>
    );
}