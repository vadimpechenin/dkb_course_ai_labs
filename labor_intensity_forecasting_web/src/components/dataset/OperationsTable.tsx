import { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";


import {
    getOperations
} from "../../api/datasetApi";

import type {
    Operation
} from "../../types/Dataset";


export default function OperationsTable() {

    const [operations, setOperations] =
        useState<Operation[]>([]);

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(20);

    const [total, setTotal] =
        useState(0);

    const [loading, setLoading] =
        useState(false);


    async function loadOperations() {

        try {

            setLoading(true);

            const result =
                await getOperations(
                    page + 1,
                    rowsPerPage
                );

            setOperations(
                result.items
            );

            setTotal(
                result.total
            );

        } catch (exception) {

            console.error(
                "Ошибка загрузки операций:",
                exception
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadOperations();

    }, [page, rowsPerPage]);


    function changePage(
        _: unknown,
        newPage: number
    ) {

        setPage(newPage);

    }


    function changeRowsPerPage(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        setRowsPerPage(
            Number(event.target.value)
        );

        setPage(0);

    }


    return (

        <Paper>

            <Typography
                variant="h6"
                sx={{ p: 2 }}
            >
                Операции
            </Typography>


            <TableContainer>

                <Table
                    size="small"
                    stickyHeader
                >

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Номенклатура
                            </TableCell>

                            <TableCell>
                                Рабочий центр
                            </TableCell>

                            <TableCell>
                                Операция
                            </TableCell>

                            <TableCell>
                                Материал
                            </TableCell>

                            <TableCell>
                                Масса детали
                            </TableCell>

                            <TableCell>
                                Длина заготовки
                            </TableCell>

                            <TableCell>
                                Нормочасы
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {operations.map(
                            operation => (

                                <TableRow
                                    key={
                                        operation.id
                                    }
                                >

                                    <TableCell>
                                        {
                                            operation
                                                .nomenclature
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            operation
                                                .work_center
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            operation
                                                .operation
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            operation
                                                .material
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            operation
                                                .detail_mass
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            operation
                                                .blank_length
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            operation
                                                .target_hours
                                        }
                                    </TableCell>

                                </TableRow>

                            )
                        )}

                    </TableBody>

                </Table>

            </TableContainer>


            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={changePage}
                rowsPerPage={
                    rowsPerPage
                }
                onRowsPerPageChange={
                    changeRowsPerPage
                }
                rowsPerPageOptions={[
                    10,
                    20,
                    50,
                    100
                ]}
                labelRowsPerPage="Строк на странице"
            />


            {loading && (

                <Typography
                    sx={{ p: 2 }}
                >
                    Загрузка...
                </Typography>

            )}

        </Paper>
    );
}