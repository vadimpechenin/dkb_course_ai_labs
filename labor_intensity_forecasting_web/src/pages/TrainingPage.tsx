import { useState } from "react";

import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import AppLayout
    from "../components/layout/AppLayout";

import TrainingForm, {
    type TrainingRequest
} from "../components/training/TrainingForm";

import TrainingActions
    from "../components/training/TrainingActions";

import {
    retrain,
    rollback,
    exportModel,
    importModel
} from "../api/trainingApi";


export default function TrainingPage() {

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState<string>();

    const [error, setError] =
        useState<string>();


    function clearMessages() {

        setMessage(undefined);
        setError(undefined);

    }


    // --------------------------------------------------
    // RETRAIN
    // --------------------------------------------------

    async function handleRetrain(
        request: TrainingRequest
    ) {

        try {

            setLoading(true);

            clearMessages();


            const result =
                await retrain({

                    model_id:
                    request.model_id,

                    dataset_size:
                    request.dataset_size,

                    train_percent:
                    request.train_percent,

                    test_percent:
                    request.test_percent,

                    features:
                    request.features,

                    model_params:
                    request.model_params

                });


            if (result.success) {

                setMessage(
                    result.message ??
                    "Модель успешно обучена."
                );

            } else {

                setError(
                    result.message ??
                    "Ошибка обучения модели."
                );

            }

        } catch (exception) {

            console.error(
                "Ошибка retrain:",
                exception
            );

            setError(
                "Не удалось выполнить обучение."
            );

        } finally {

            setLoading(false);

        }

    }


    // --------------------------------------------------
    // ROLLBACK
    // --------------------------------------------------

    async function handleRollback() {

        try {

            setLoading(true);

            clearMessages();


            const result =
                await rollback();


            if (result) {

                setMessage(
                    "Модель успешно возвращена " +
                    "к предыдущей версии."
                );

            } else {

                setError(
                    "Не удалось выполнить rollback."
                );

            }

        } catch (exception) {

            console.error(
                "Ошибка rollback:",
                exception
            );

            setError(
                "Ошибка при возврате модели."
            );

        } finally {

            setLoading(false);

        }

    }


    // --------------------------------------------------
    // EXPORT
    // --------------------------------------------------

    async function handleExport() {

        try {

            setLoading(true);

            clearMessages();


            const blob =
                await exportModel();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "model_export.tar";


            document.body.appendChild(
                link
            );

            link.click();

            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            setMessage(
                "Модель успешно экспортирована."
            );

        } catch (exception) {

            console.error(
                "Ошибка export:",
                exception
            );

            setError(
                "Не удалось экспортировать модель."
            );

        } finally {

            setLoading(false);

        }

    }


    // --------------------------------------------------
    // IMPORT
    // --------------------------------------------------

    async function handleImport(
        file: File
    ) {

        try {

            setLoading(true);

            clearMessages();


            const result =
                await importModel(file);


            if (result) {

                setMessage(
                    "Модель успешно импортирована."
                );

            } else {

                setError(
                    "Не удалось импортировать модель."
                );

            }

        } catch (exception) {

            console.error(
                "Ошибка import:",
                exception
            );

            setError(
                "Ошибка при импорте модели."
            );

        } finally {

            setLoading(false);

        }

    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <AppLayout>

            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                Обучение моделей
            </Typography>


            {message && (

                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {message}
                </Alert>

            )}


            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

            )}


            <TrainingForm
                onRetrain={
                    handleRetrain
                }
                loading={loading}
            />


            <Divider
                sx={{ my: 4 }}
            />


            <Typography
                variant="h6"
                sx={{ mb: 1 }}
            >
                Управление моделью
            </Typography>


            <Box>

                <TrainingActions
                    onRollback={
                        handleRollback
                    }
                    onExport={
                        handleExport
                    }
                    onImport={
                        handleImport
                    }
                    loading={loading}
                />

            </Box>

        </AppLayout>
    );
}