import { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { resetDatabase } from "../../api/settingsApi";


export default function ResetDatabaseCard() {

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState<string>();

    const [error, setError] =
        useState<string>();


    async function handleReset() {

        const confirmed =
            window.confirm(
                "ВНИМАНИЕ!\n\n" +
                "Все результаты обучения, " +
                "прогнозирования и изменения " +
                "датасета будут удалены.\n\n" +
                "База данных будет возвращена " +
                "в исходное состояние.\n\n" +
                "Продолжить?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setLoading(true);

            setMessage(undefined);
            setError(undefined);


            const result =
                await resetDatabase();


            if (result.success) {

                setMessage(
                    result.message
                );

            } else {

                setError(
                    result.message
                );
            }

        } catch (exception) {

            console.error(
                "Ошибка восстановления БД:",
                exception
            );

            setError(
                "Не удалось восстановить " +
                "исходное состояние лаборатории."
            );

        } finally {

            setLoading(false);

        }
    }


    return (

        <Card sx={{ mt: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Восстановление
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Возвращает базу данных и модели
                    в исходное состояние.
                    Все результаты обучения,
                    прогнозирования и изменения
                    датасета будут удалены.
                </Typography>


                <Stack spacing={2}>

                    {message && (

                        <Alert severity="success">
                            {message}
                        </Alert>

                    )}


                    {error && (

                        <Alert severity="error">
                            {error}
                        </Alert>

                    )}


                    <Button
                        variant="contained"
                        color="error"
                        disabled={loading}
                        onClick={handleReset}
                    >
                        {loading
                            ? "Восстановление..."
                            : "Восстановить исходное состояние"}
                    </Button>

                </Stack>

            </CardContent>

        </Card>
    );
}