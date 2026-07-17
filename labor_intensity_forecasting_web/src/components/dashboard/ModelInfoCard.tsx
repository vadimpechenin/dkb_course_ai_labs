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

export default function ModelInfoCard({ dashboard }: Props) {

    return (

        <Card sx={{ height: "100%" }}>

            <CardContent>

                <Typography variant="h6">

                    Активная модель

                </Typography>

                <Divider sx={{ mt: 1, mb: 2 }} />

                <Box sx={{ mb: 1 }}>

                    <Typography variant="body2" color="text.secondary">

                        Модель

                    </Typography>

                    <Typography>

                        {dashboard.activeModel}

                    </Typography>

                </Box>

                <Box sx={{ mb: 1 }}>

                    <Typography variant="body2" color="text.secondary">

                        Framework

                    </Typography>

                    <Typography>

                        {dashboard.framework}

                    </Typography>

                </Box>

                <Box>

                    <Typography variant="body2" color="text.secondary">

                        Каталог весов

                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            wordBreak: "break-all"
                        }}
                    >

                        {dashboard.weightsPath}

                    </Typography>

                </Box>

            </CardContent>

        </Card>

    );

}