import {
    useEffect,
    useState
} from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


import {
    getTrainingRuns
} from "../../api/modelsApi";


import type {
    TrainingRun
} from "../../types/Models";


interface Props {

    onSelect: (
        trainingRunId: string
    ) => void;

}


export default function TrainingRunsTable({
                                              onSelect
                                          }: Props) {

    const [runs, setRuns] =
        useState<TrainingRun[]>([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        getTrainingRuns()
            .then(setRuns)
            .catch(exception =>
                console.error(
                    "Ошибка загрузки экспериментов:",
                    exception
                )
            )
            .finally(() =>
                setLoading(false)
            );

    }, []);


    if (loading) {

        return (
            <Typography>
                Загрузка экспериментов...
            </Typography>
        );
    }


    return (

        <Paper sx={{ mt: 3 }}>

            <Typography
                variant="h6"
                sx={{ p: 2 }}
            >
                Эксперименты обучения
            </Typography>


            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Дата
                            </TableCell>

                            <TableCell>
                                Модель
                            </TableCell>

                            <TableCell>
                                Dataset
                            </TableCell>

                            <TableCell>
                                MAE
                            </TableCell>

                            <TableCell>
                                RMSE
                            </TableCell>

                            <TableCell>
                                R²
                            </TableCell>

                            <TableCell />

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {runs.map(run => (

                            <TableRow
                                key={run.id}
                            >

                                <TableCell>

                                    {new Date(
                                        run.created_at
                                    ).toLocaleString()}

                                </TableCell>


                                <TableCell>
                                    {
                                        run.model_name ??
                                        run.model_id
                                    }
                                </TableCell>


                                <TableCell>
                                    {run.dataset_size}
                                </TableCell>


                                <TableCell>
                                    {run.mae?.toFixed(3) ?? "—"}
                                </TableCell>


                                <TableCell>
                                    {run.rmse?.toFixed(3) ?? "—"}
                                </TableCell>


                                <TableCell>
                                    {run.r2?.toFixed(3) ?? "—"}
                                </TableCell>


                                <TableCell>

                                    <Button
                                        size="small"
                                        onClick={() =>
                                            onSelect(
                                                run.id
                                            )
                                        }
                                    >
                                        Подробнее
                                    </Button>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Paper>
    );
}