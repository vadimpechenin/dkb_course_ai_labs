import { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { ForecastInput } from "../../types/Forecast";


interface ForecastFormProps {

    onForecast: (
        data: ForecastInput[]
    ) => Promise<void>;

    loading: boolean;
}


const emptyOperation: ForecastInput = {

    detail_mass: null,
    blank_length: null,

    work_center: "",
    operation: "",
    material: "",
    nomenclature: "",
    note: "",

    user_name: "",
    fill_date: null,

    row_number: 1
};


export default function ForecastForm({
                                         onForecast,
                                         loading
                                     }: ForecastFormProps) {

    const [operation, setOperation] =
        useState<ForecastInput>({
            ...emptyOperation
        });


    function handleChange(
        field: keyof ForecastInput,
        value: string
    ) {

        setOperation(
            previous => ({

                ...previous,

                [field]:
                    field === "detail_mass" ||
                    field === "blank_length" ||
                    field === "row_number"

                        ? value === ""
                            ? null
                            : Number(value)

                        : value

            })
        );
    }


    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault();

        await onForecast([
            operation
        ]);
    }


    return (

        <Box
            component="form"
            onSubmit={handleSubmit}
        >

            <Typography
                variant="h6"
                sx={{ mb: 2 }}
            >
                Параметры операции
            </Typography>


            <Grid
                container
                spacing={2}
            >

                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        label="Номенклатура"
                        value={operation.nomenclature}
                        onChange={e =>
                            handleChange(
                                "nomenclature",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        label="Рабочий центр"
                        value={operation.work_center}
                        onChange={e =>
                            handleChange(
                                "work_center",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        label="Операция"
                        value={operation.operation}
                        onChange={e =>
                            handleChange(
                                "operation",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        label="Материал"
                        value={operation.material}
                        onChange={e =>
                            handleChange(
                                "material",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        type="number"
                        label="Масса детали"
                        value={
                            operation.detail_mass ?? ""
                        }
                        onChange={e =>
                            handleChange(
                                "detail_mass",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        type="number"
                        label="Длина заготовки"
                        value={
                            operation.blank_length ?? ""
                        }
                        onChange={e =>
                            handleChange(
                                "blank_length",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12 }}>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Примечание"
                        value={operation.note}
                        onChange={e =>
                            handleChange(
                                "note",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        label="Пользователь"
                        value={operation.user_name}
                        onChange={e =>
                            handleChange(
                                "user_name",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        type="date"
                        label="Дата заполнения"
                        value={
                            operation.fill_date ?? ""
                        }
                        onChange={e =>
                            handleChange(
                                "fill_date",
                                e.target.value
                            )
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />

                </Grid>


                <Grid size={{ xs: 12, md: 6 }}>

                    <TextField
                        fullWidth
                        type="number"
                        label="№ строки"
                        value={
                            operation.row_number ?? ""
                        }
                        onChange={e =>
                            handleChange(
                                "row_number",
                                e.target.value
                            )
                        }
                    />

                </Grid>


                <Grid size={{ xs: 12 }}>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading
                            ? "Расчет..."
                            : "Рассчитать трудоемкость"}
                    </Button>

                </Grid>

            </Grid>

        </Box>
    );
}