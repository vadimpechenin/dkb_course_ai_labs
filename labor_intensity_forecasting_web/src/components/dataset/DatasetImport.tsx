import {
    useRef,
    useState
} from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";


import {
    importOperationsCsv
} from "../../api/datasetApi";


export default function DatasetImport() {

    const inputRef =
        useRef<HTMLInputElement>(null);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState<string>();

    const [error, setError] =
        useState<string>();


    function selectFile() {

        inputRef.current?.click();

    }


    async function handleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0];

        if (!file) {

            return;

        }


        try {

            setLoading(true);

            setMessage(undefined);
            setError(undefined);


            const result =
                await importOperationsCsv(
                    file
                );


            if (result) {

                setMessage(
                    "CSV успешно импортирован."
                );

            } else {

                setError(
                    "Сервер не подтвердил импорт CSV."
                );

            }

        } catch (exception) {

            console.error(
                "Ошибка импорта CSV:",
                exception
            );

            setError(
                "Не удалось импортировать CSV."
            );

        } finally {

            setLoading(false);

            event.target.value = "";

        }
    }


    return (

        <Stack
            spacing={2}
            sx={{ mb: 3 }}
        >

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


            <input
                ref={inputRef}
                type="file"
                hidden
                accept=".csv"
                onChange={handleChange}
            />


            <Button
                variant="outlined"
                onClick={selectFile}
                disabled={loading}
            >
                {loading
                    ? "Импорт..."
                    : "Импортировать CSV"}
            </Button>

        </Stack>
    );
}