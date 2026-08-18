import {
    useEffect,
    useState
} from "react";

import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import AppLayout from "../components/layout/AppLayout";

import PredictionsTable
    from "../components/predictions/PredictionsTable";

import PredictionActions
    from "../components/predictions/PredictionActions";

import PredictionSummary
    from "../components/predictions/PredictionSummary";
import {
    getPredictionHistory,
    dumpPredictions
} from "../api/predictionsApi";

import type {
    Prediction
} from "../types/Prediction";


export default function PredictionsPage() {

    const [
        predictions,
        setPredictions
    ] = useState<Prediction[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        exportLoading,
        setExportLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState<string>();


    const [
        message,
        setMessage
    ] = useState<string>();


    useEffect(() => {

        loadPredictions();

    }, []);


    async function loadPredictions() {

        try {

            setLoading(true);
            setError(undefined);

            const data =
                await getPredictionHistory();

            setPredictions(data);

        } catch (exception) {

            console.error(
                "Ошибка загрузки истории прогнозов:",
                exception
            );

            setError(
                "Не удалось загрузить историю прогнозов."
            );

        } finally {

            setLoading(false);

        }
    }


    async function handleDump() {

        try {

            setExportLoading(true);

            setError(undefined);
            setMessage(undefined);


            const blob =
                await dumpPredictions();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "predictions.tar";


            document.body.appendChild(
                link
            );

            link.click();

            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            setMessage(
                "История прогнозов успешно выгружена."
            );

        } catch (exception) {

            console.error(
                "Ошибка выгрузки прогнозов:",
                exception
            );

            setError(
                "Не удалось выгрузить историю прогнозов."
            );

        } finally {

            setExportLoading(false);

        }
    }


    return (

        <AppLayout>

            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                История прогнозов
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


            {loading ? (

                <Typography>
                    Загрузка истории прогнозов...
                </Typography>

            ) : (

                <>

                    <PredictionsTable
                        predictions={
                            predictions
                        }
                    />


                    <Divider
                        sx={{ my: 4 }}
                    />


                    <Typography
                        variant="h6"
                        sx={{ mb: 1 }}
                    >
                        Управление данными
                    </Typography>


                    <PredictionActions
                        onDump={handleDump}
                        loading={
                            exportLoading
                        }
                    />
                    <PredictionSummary
                        predictions={predictions}
                    />
                </>

            )}

        </AppLayout>
    );
}