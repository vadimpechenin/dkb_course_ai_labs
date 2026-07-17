import {

    Card,
    CardContent,
    Typography,
    Divider,
    Box

} from "@mui/material";

import type { Dashboard } from "../../types/Dashboard";

interface Props {

    dashboard: Dashboard;

}

export default function DatasetInfoCard({ dashboard }: Props) {

    return (

        <Card sx={{ height: "100%" }}>

            <CardContent>

                <Typography variant="h6">

                    Датасет

                </Typography>

                <Divider sx={{ mt: 1, mb: 2 }} />

                <Box sx={{ mb: 1 }}>

                    <Typography variant="body2" color="text.secondary">

                        Размер выборки

                    </Typography>

                    <Typography>

                        {dashboard.datasetSize}

                    </Typography>

                </Box>

                <Box sx={{ mb: 1 }}>

                    <Typography variant="body2" color="text.secondary">

                        Обучение / тест

                    </Typography>

                    <Typography>

                        {dashboard.trainPercent}% / {dashboard.testPercent}%

                    </Typography>

                </Box>

                <Box sx={{ mb: 1 }}>

                    <Typography variant="body2" color="text.secondary">

                        Последний импорт CSV

                    </Typography>

                    <Typography>

                        {dashboard.lastImport}

                    </Typography>

                </Box>

                <Box>

                    <Typography variant="body2" color="text.secondary">

                        Последнее обучение

                    </Typography>

                    <Typography>

                        {dashboard.lastTraining}

                    </Typography>

                </Box>

            </CardContent>

        </Card>

    );

}