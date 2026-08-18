import { useRef } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


interface TrainingActionsProps {

    onRollback: () => Promise<void>;

    onExport: () => Promise<void>;

    onImport: (
        file: File
    ) => Promise<void>;

    loading: boolean;
}


export default function TrainingActions({
                                            onRollback,
                                            onExport,
                                            onImport,
                                            loading
                                        }: TrainingActionsProps) {

    const fileInputRef =
        useRef<HTMLInputElement>(null);


    function selectFile() {

        fileInputRef.current?.click();

    }


    async function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        await onImport(file);

        event.target.value = "";

    }


    return (

        <>

            <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".tar,.tar.gz,.tgz"
                onChange={
                    handleFileChange
                }
            />


            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                spacing={2}
                sx={{ mt: 3 }}
            >

                <Button
                    variant="outlined"
                    color="warning"
                    disabled={loading}
                    onClick={onRollback}
                >
                    Вернуть предыдущую версию
                </Button>


                <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={onExport}
                >
                    Экспорт модели
                </Button>


                <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={selectFile}
                >
                    Импорт модели
                </Button>

            </Stack>

        </>
    );
}