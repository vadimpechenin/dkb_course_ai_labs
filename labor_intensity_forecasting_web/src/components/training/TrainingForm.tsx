import { useState } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


interface TrainingFormProps {

    onRetrain: (
        modelId: string,
        trainPercent: number,
        testPercent: number
    ) => Promise<void>;

    loading: boolean;
}


export default function TrainingForm({
                                         onRetrain,
                                         loading
                                     }: TrainingFormProps) {

    const [modelId, setModelId] =
        useState("");


    const [trainPercent, setTrainPercent] =
        useState(80);


    const [testPercent, setTestPercent] =
        useState(20);


    async function submit(
        event: React.FormEvent
    ) {

        event.preventDefault();

        await onRetrain(
            modelId,
            trainPercent,
            testPercent
        );
    }


    function changeTrain(
        value: number
    ) {

        setTrainPercent(value);
        setTestPercent(100 - value);
    }


    return (

        <Box
            component="form"
            onSubmit={submit}
        >

            <Typography
                variant="h6"
                sx={{ mb: 2 }}
            >
                Параметры обучения
            </Typography>


            <Grid
                container
                spacing={2}
            >

                <Grid
                    size={{ xs: 12, md: 6 }}
                >

                    <TextField
                        fullWidth
                        required
                        label="ID модели"
                        value={modelId}
                        onChange={e =>
                            setModelId(
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid
                    size={{ xs: 12, md: 3 }}
                >

                    <TextField
                        fullWidth
                        type="number"
                        label="Обучение, %"
                        value={trainPercent}
                        onChange={e =>
                            changeTrain(
                                Number(e.target.value)
                            )
                        }
                        inputProps={{
                            min: 50,
                            max: 95
                        }}
                    />

                </Grid>


                <Grid
                    size={{ xs: 12, md: 3 }}
                >

                    <TextField
                        fullWidth
                        type="number"
                        label="Тест, %"
                        value={testPercent}
                        disabled
                    />

                </Grid>


                <Grid size={{ xs: 12 }}>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={
                            loading ||
                            !modelId
                        }
                    >
                        {loading
                            ? "Обучение..."
                            : "Запустить обучение"}
                    </Button>

                </Grid>

            </Grid>

        </Box>
    );
}