import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


interface PredictionActionsProps {

    onDump: () => Promise<void>;

    loading: boolean;
}


export default function PredictionActions({
                                              onDump,
                                              loading
                                          }: PredictionActionsProps) {

    return (

        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            spacing={2}
            sx={{ mt: 3 }}
        >

            <Button
                variant="outlined"
                disabled={loading}
                onClick={onDump}
            >
                {loading
                    ? "Экспорт..."
                    : "Выгрузить прогнозы"}
            </Button>

        </Stack>
    );
}