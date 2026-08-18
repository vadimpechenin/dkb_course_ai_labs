import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

import type { ForecastResult } from "../../types/Forecast";


interface ForecastResultTableProps {

    results: ForecastResult[];
}


export default function ForecastResultTable({
                                                results
                                            }: ForecastResultTableProps) {

    if (results.length === 0) {

        return null;

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
                            №
                        </TableCell>

                        <TableCell>
                            Прогноз, ч
                        </TableCell>

                        <TableCell>
                            Std, ч
                        </TableCell>

                        <TableCell>
                            Состояние
                        </TableCell>

                    </TableRow>

                </TableHead>


                <TableBody>

                    {results.map(
                        (result, index) => {

                            const valid =
                                result.std >= 0;


                            return (

                                <TableRow
                                    key={index}
                                >

                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    <TableCell>
                                        {result.forecast.toFixed(3)}
                                    </TableCell>

                                    <TableCell>
                                        {result.std >= 0
                                            ? result.std.toFixed(3)
                                            : result.std}
                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label={
                                                valid
                                                    ? "Корректный прогноз"
                                                    : "Выход за область обучения"
                                            }
                                            color={
                                                valid
                                                    ? "success"
                                                    : "warning"
                                            }
                                            size="small"
                                        />

                                    </TableCell>

                                </TableRow>

                            );

                        }
                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
}