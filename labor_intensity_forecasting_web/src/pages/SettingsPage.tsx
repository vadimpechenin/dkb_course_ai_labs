import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AppLayout from "../components/layout/AppLayout";

import SettingsCard from "../components/settings/SettingsCard";
import HealthStatusCard from "../components/settings/HealthStatusCard";

import {
    getSettings,
    getHealth
} from "../api/settingsApi";

import type {
    Settings,
    HealthStatus
} from "../types/Settings";


export default function SettingsPage() {

    const [settings, setSettings] =
        useState<Settings>();

    const [health, setHealth] =
        useState<HealthStatus>();

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string>();


    useEffect(() => {

        async function loadData() {

            try {

                setLoading(true);
                setError(undefined);

                const [
                    settingsData,
                    healthData
                ] = await Promise.all([
                    getSettings(),
                    getHealth()
                ]);

                setSettings(settingsData);
                setHealth(healthData);

            } catch (exception) {

                console.error(
                    "Ошибка загрузки настроек:",
                    exception
                );

                setError(
                    "Не удалось получить настройки сервера."
                );

            } finally {

                setLoading(false);

            }
        }

        loadData();

    }, []);


    if (loading) {

        return (

            <AppLayout>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 300
                    }}
                >

                    <CircularProgress />

                </Box>

            </AppLayout>
        );
    }


    if (error) {

        return (

            <AppLayout>

                <Alert severity="error">
                    {error}
                </Alert>

            </AppLayout>
        );
    }


    return (

        <AppLayout>

            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                Настройки
            </Typography>


            <Grid
                container
                spacing={2}
            >

                <Grid
                    size={{ xs: 12, md: 7 }}
                >

                    {settings && (
                        <SettingsCard
                            settings={settings}
                        />
                    )}

                </Grid>

                <Grid
                    size={{ xs: 12, md: 5 }}
                >

                    {health && (
                        <HealthStatusCard
                            health={health}
                        />
                    )}

                </Grid>

            </Grid>

        </AppLayout>
    );
}