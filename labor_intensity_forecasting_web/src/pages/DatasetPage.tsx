import {
    useEffect,
    useState
} from "react";

import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";


import AppLayout
    from "../components/layout/AppLayout";

import DatasetInfo
    from "../components/dataset/DatasetInfo";

import FeatureSelector
    from "../components/dataset/FeatureSelector";

import OperationsTable
    from "../components/dataset/OperationsTable";

import DatasetImport
    from "../components/dataset/DatasetImport";


import {
    getDataset
} from "../api/datasetApi";


import type {
    DatasetInfo as DatasetInfoType
} from "../types/Dataset";


export default function DatasetPage() {

    const [dataset, setDataset] =
        useState<DatasetInfoType>();

    const [error, setError] =
        useState<string>();


    useEffect(() => {

        getDataset()
            .then(setDataset)
            .catch(exception => {

                console.error(
                    "Ошибка загрузки dataset:",
                    exception
                );

                setError(
                    "Не удалось загрузить информацию о датасете."
                );

            });

    }, []);


    if (!dataset && !error) {

        return (
            <AppLayout>
                Загрузка...
            </AppLayout>
        );
    }


    return (

        <AppLayout>

            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                Датасет
            </Typography>


            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}


            {dataset && (

                <DatasetInfo
                    dataset={dataset}
                />

            )}


            <DatasetImport />


            <FeatureSelector />


            <Divider
                sx={{ my: 4 }}
            />


            <OperationsTable />

        </AppLayout>
    );
}