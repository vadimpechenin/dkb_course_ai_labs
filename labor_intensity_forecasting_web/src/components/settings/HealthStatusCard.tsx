import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import type { HealthStatus } from "../../types/Settings";


interface HealthStatusCardProps {
    health: HealthStatus;
}


export default function HealthStatusCard({
                                             health
                                         }: HealthStatusCardProps) {

    const serviceOk =
        health.status === "ok";

    const databaseOk =
        health.database === "ok";


    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Состояние сервиса
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1
                    }}
                >

                    <Typography>
                        Сервис
                    </Typography>

                    <Chip
                        label={
                            serviceOk
                                ? "Работает"
                                : "Ошибка"
                        }
                        color={
                            serviceOk
                                ? "success"
                                : "error"
                        }
                    />

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1
                    }}
                >

                    <Typography>
                        База данных
                    </Typography>

                    <Chip
                        label={
                            databaseOk
                                ? "Подключена"
                                : "Ошибка"
                        }
                        color={
                            databaseOk
                                ? "success"
                                : "error"
                        }
                    />

                </Box>


                {health.message && (

                    <Box sx={{ mt: 2 }}>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Сообщение
                        </Typography>

                        <Typography
                            variant="body2"
                        >
                            {health.message}
                        </Typography>

                    </Box>

                )}

            </CardContent>

        </Card>
    );
}