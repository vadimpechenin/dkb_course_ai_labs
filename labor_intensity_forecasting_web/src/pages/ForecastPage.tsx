import { useState } from "react";

import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import AppLayout from "../components/layout/AppLayout";

import ForecastForm
    from "../components/forecast/ForecastForm";

import ForecastResultTable
    from "../components/forecast/ForecastResultTable";

import {
    forecast
} from "../api/forecastApi";

import type {
    ForecastInput,
    ForecastResult
} from "../types/Forecast";


export default function ForecastPage() {

    const [results, setResults] =
        useState<ForecastResult[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string>();


    async function handleForecast(
        data: ForecastInput[]
    ) {

        try {

            setLoading(true);
            setError(undefined);

            const response =
                await forecast(data);

            setResults(response);

        } catch (exception) {

            console.error(
                "Ошибка прогнозирования:",
                exception
            );

            setError(
                "Не удалось выполнить расчет трудоемкости."
            );

        } finally {

            setLoading(false);

        }
    }


    return (

        <AppLayout>

            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                Расчет трудоемкости
            </Typography>


            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

            )}


            <ForecastForm
                onForecast={handleForecast}
                loading={loading}
            />


            <ForecastResultTable
                results={results}
            />

        </AppLayout>
    );
}