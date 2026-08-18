import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import type { Prediction } from "../../types/Prediction";


interface PredictionsTableProps {

    predictions: Prediction[];
}


export default function PredictionsTable({
                                             predictions
                                         }: PredictionsTableProps) {

    if (predictions.length === 0) {

        return (

            <Typography
                color="text.secondary"
                sx={{ mt: 3 }}
            >
                История прогнозов пока пуста.
            </Typography>

        );
    }


    return (

        <TableContainer
            component={Paper}
            sx={{ mt: 3 }}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Дата
                        </TableCell>

                        <TableCell>
                            ID прогноза
                        </TableCell>

                        <TableCell>
                            Training Run
                        </TableCell>

                        <TableCell align="right">
                            Прогноз, ч
                        </TableCell>

                        <TableCell align="right">
                            Std, ч
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {predictions.map(
                        prediction => (

                            <TableRow
                                key={prediction.id}
                                hover
                            >

                                <TableCell>

                                    {new Date(
                                        prediction.created_at
                                    ).toLocaleString(
                                        "ru-RU"
                                    )}

                                </TableCell>


                                <TableCell>

                                    {prediction.id}

                                </TableCell>


                                <TableCell>

                                    {prediction.training_run_id}

                                </TableCell>


                                <TableCell align="right">

                                    {Number.isFinite(
                                        prediction.forecast
                                    )
                                        ? prediction.forecast.toFixed(3)
                                        : "—"}

                                </TableCell>


                                <TableCell align="right">

                                    {Number.isFinite(
                                        prediction.std
                                    )
                                        ? prediction.std.toFixed(3)
                                        : "—"}

                                </TableCell>

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
}