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
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";


import {
    getModels,
    activateModel
} from "../../api/modelsApi";


import type {
    MLModel
} from "../../types/Models";


interface Props {

    onChanged?: () => void;

}


export default function ModelsTable({
                                        onChanged
                                    }: Props) {

    const [models, setModels] =
        useState<MLModel[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [activating, setActivating] =
        useState<string>();


    async function loadModels() {

        try {

            setLoading(true);

            const result =
                await getModels();

            setModels(result);

        } catch (exception) {

            console.error(
                "Ошибка загрузки моделей:",
                exception
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadModels();

    }, []);


    async function handleActivate(
        modelId: string
    ) {

        try {

            setActivating(modelId);

            const success =
                await activateModel(
                    modelId
                );

            if (success) {

                await loadModels();

                onChanged?.();

            }

        } catch (exception) {

            console.error(
                "Ошибка активации модели:",
                exception
            );

        } finally {

            setActivating(undefined);

        }
    }


    if (loading) {

        return (
            <Typography>
                Загрузка моделей...
            </Typography>
        );
    }


    return (

        <Paper>

            <Typography
                variant="h6"
                sx={{ p: 2 }}
            >
                Доступные модели
            </Typography>


            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Модель
                            </TableCell>

                            <TableCell>
                                Framework
                            </TableCell>

                            <TableCell>
                                Описание
                            </TableCell>

                            <TableCell>
                                Статус
                            </TableCell>

                            <TableCell />

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {models.map(model => (

                            <TableRow
                                key={model.id}
                            >

                                <TableCell>

                                    <Typography
                                        fontWeight={
                                            model.active
                                                ? "bold"
                                                : "normal"
                                        }
                                    >
                                        {model.name}
                                    </Typography>

                                </TableCell>


                                <TableCell>
                                    {model.framework}
                                </TableCell>


                                <TableCell>
                                    {model.description}
                                </TableCell>


                                <TableCell>

                                    {model.active ? (

                                        <Chip
                                            label="Активна"
                                            color="success"
                                            size="small"
                                        />

                                    ) : (

                                        <Chip
                                            label="Неактивна"
                                            size="small"
                                        />

                                    )}

                                </TableCell>


                                <TableCell>

                                    {!model.active && (

                                        <Button
                                            size="small"
                                            variant="outlined"
                                            disabled={
                                                activating ===
                                                model.id
                                            }
                                            onClick={() =>
                                                handleActivate(
                                                    model.id
                                                )
                                            }
                                        >
                                            Активировать
                                        </Button>

                                    )}

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Paper>
    );
}