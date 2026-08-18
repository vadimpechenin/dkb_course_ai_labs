import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import {
    getFeatures,
    saveFeatures
} from "../../api/datasetApi";

import type { Feature } from "../../types/Dataset";


export default function FeatureSelector() {

    const [features, setFeatures] =
        useState<Feature[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState<string>();

    const [error, setError] =
        useState<string>();


    async function loadFeatures() {

        try {

            setLoading(true);

            const data =
                await getFeatures();

            setFeatures(data);

        } catch (exception) {

            console.error(
                "Ошибка загрузки признаков:",
                exception
            );

            setError(
                "Не удалось загрузить признаки."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadFeatures();

    }, []);


    function toggleFeature(
        featureName: string
    ) {

        setFeatures(current =>

            current.map(feature =>

                feature.feature_name === featureName
                    ? {
                        ...feature,
                        enabled: !feature.enabled
                    }
                    : feature
            )
        );
    }


    async function handleSave() {

        try {

            setSaving(true);
            setMessage(undefined);
            setError(undefined);

            const selected =
                features
                    .filter(feature => feature.enabled)
                    .map(feature => feature.feature_name);

            const result =
                await saveFeatures({
                    features: selected
                });

            if (result.success) {

                setMessage(
                    result.message ??
                    "Настройки признаков сохранены."
                );

            } else {

                setError(
                    result.message ??
                    "Не удалось сохранить признаки."
                );

            }

        } catch (exception) {

            console.error(
                "Ошибка сохранения признаков:",
                exception
            );

            setError(
                "Ошибка при сохранении признаков."
            );

        } finally {

            setSaving(false);

        }
    }


    if (loading) {

        return (
            <Typography>
                Загрузка признаков...
            </Typography>
        );
    }


    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    sx={{ mb: 2 }}
                >
                    Признаки модели
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


                <FormGroup>

                    {features.map(feature => (

                        <FormControlLabel
                            key={feature.id}
                            control={
                                <Checkbox
                                    checked={
                                        feature.enabled
                                    }
                                    onChange={() =>
                                        toggleFeature(
                                            feature.feature_name
                                        )
                                    }
                                />
                            }
                            label={
                                feature.display_name ||
                                feature.feature_name
                            }
                        />

                    ))}

                </FormGroup>


                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 2 }}
                >

                    <Button
                        variant="contained"
                        disabled={saving}
                        onClick={handleSave}
                    >
                        {saving
                            ? "Сохранение..."
                            : "Сохранить признаки"}
                    </Button>


                    <Button
                        variant="outlined"
                        disabled={saving}
                        onClick={loadFeatures}
                    >
                        Обновить
                    </Button>

                </Stack>

            </CardContent>

        </Card>
    );
}