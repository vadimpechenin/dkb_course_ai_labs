import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import type { DatasetInfo as DatasetInfoType } from "../../types/Dataset";


interface Props {
    dataset: DatasetInfoType;
}


export default function DatasetInfo({
                                        dataset
                                    }: Props) {

    return (

        <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
        >

            <Grid size={{ xs: 12, md: 4 }}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Записей в датасете
                        </Typography>

                        <Typography variant="h4">

                            {dataset.dataset_size}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Всего признаков
                        </Typography>

                        <Typography variant="h4">

                            {dataset.features_count}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Используется признаков
                        </Typography>

                        <Typography variant="h4">

                            {dataset.enabled_features}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>
    );
}