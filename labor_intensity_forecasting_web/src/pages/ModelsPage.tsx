import {
    useEffect,
    useState
} from "react";

import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";


import AppLayout
    from "../components/layout/AppLayout";


import ActiveModelCard
    from "../components/models/ActiveModelCard";

import ModelsTable
    from "../components/models/ModelsTable";

import TrainingRunsTable
    from "../components/models/TrainingRunsTable";

import ExperimentDialog
    from "../components/models/ExperimentDialog";


import {
    getActiveModel
} from "../api/modelsApi";


import type {
    MLModel
} from "../types/Models";


export default function ModelsPage() {

    const [activeModel, setActiveModel] =
        useState<MLModel>();

    const [selectedRun, setSelectedRun] =
        useState<string>();

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [error, setError] =
        useState<string>();


    async function loadActiveModel() {

        try {

            const model =
                await getActiveModel();

            setActiveModel(model);

        } catch (exception) {

            console.error(
                "Ошибка загрузки активной модели:",
                exception
            );

            setError(
                "Не удалось загрузить активную модель."
            );

        }
    }


    useEffect(() => {

        loadActiveModel();

    }, []);


    function handleSelectExperiment(
        trainingRunId: string
    ) {

        setSelectedRun(
            trainingRunId
        );

        setDialogOpen(true);

    }


    function closeDialog() {

        setDialogOpen(false);

        setSelectedRun(undefined);

    }


    return (

        <AppLayout>

            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                Модели
            </Typography>


            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}


            {activeModel && (

                <ActiveModelCard
                    model={activeModel}
                />

            )}


            <ModelsTable
                onChanged={loadActiveModel}
            />


            <TrainingRunsTable
                onSelect={
                    handleSelectExperiment
                }
            />


            <ExperimentDialog
                trainingRunId={
                    selectedRun
                }
                open={dialogOpen}
                onClose={
                    closeDialog
                }
            />

        </AppLayout>
    );
}