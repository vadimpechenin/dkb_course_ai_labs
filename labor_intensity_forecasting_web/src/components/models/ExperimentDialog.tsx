import {
    useEffect,
    useState
} from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";


import {
    getExperiment
} from "../../api/modelsApi";


import type {
    Experiment
} from "../../types/Models";


interface Props {

    trainingRunId?: string;

    open: boolean;

    onClose: () => void;

}


export default function ExperimentDialog({
                                             trainingRunId,
                                             open,
                                             onClose
                                         }: Props) {

    const [experiment, setExperiment] =
        useState<Experiment>();

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        if (!open || !trainingRunId) {

            return;

        }


        setLoading(true);


        getExperiment(trainingRunId)
            .then(setExperiment)
            .catch(exception =>
                console.error(
                    "Ошибка загрузки эксперимента:",
                    exception
                )
            )
            .finally(() =>
                setLoading(false)
            );

    }, [
        open,
        trainingRunId
    ]);


    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>
                Эксперимент
            </DialogTitle>


            <DialogContent>

                {loading && (

                    <Typography>
                        Загрузка...
                    </Typography>

                )}


                {experiment && (

                    <>

                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Основная информация
                        </Typography>


                        <Typography>
                            ID: {experiment.id}
                        </Typography>


                        <Typography>
                            Модель:{" "}
                            {
                                experiment.model_name ??
                                experiment.model_id
                            }
                        </Typography>


                        <Typography>
                            Размер датасета:{" "}
                            {experiment.dataset_size}
                        </Typography>


                        <Typography>
                            MAE:{" "}
                            {experiment.mae?.toFixed(4) ?? "—"}
                        </Typography>


                        <Typography>
                            RMSE:{" "}
                            {experiment.rmse?.toFixed(4) ?? "—"}
                        </Typography>


                        <Typography>
                            R²:{" "}
                            {experiment.r2?.toFixed(4) ?? "—"}
                        </Typography>


                        <Typography>
                            Время обучения:{" "}
                            {
                                experiment.training_time
                                ?? "—"
                            }
                        </Typography>


                        <Divider
                            sx={{ my: 3 }}
                        />


                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Параметры обучения
                        </Typography>


                        <Box
                            component="pre"
                            sx={{
                                p: 2,
                                backgroundColor:
                                    "grey.100",
                                borderRadius: 1,
                                overflow: "auto",
                                fontSize: 13
                            }}
                        >
                            {
                                JSON.stringify(
                                    experiment.training_config,
                                    null,
                                    2
                                )
                            }
                        </Box>

                    </>

                )}

            </DialogContent>


            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Закрыть
                </Button>

            </DialogActions>

        </Dialog>
    );
}