import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import type { Prediction } from "../../types/Prediction";


interface Props {

    predictions: Prediction[];
}


export default function PredictionSummary({
                                              predictions
                                          }: Props) {

    const count =
        predictions.length;


    const averageForecast =
        count > 0
            ? predictions.reduce(
            (sum, item) =>
                sum + item.forecast,
            0
        ) / count
            : 0;


    const averageStd =
        count > 0
            ? predictions.reduce(
            (sum, item) =>
                sum + item.std,
            0
        ) / count
            : 0;


    return (

        <Grid
            container
            spacing={2}
        >

            <Grid size={{ xs: 12, md: 4 }}>

                <Card>

                    <CardContent>

                        <Typography
                            color="text.secondary"
                        >
                            Всего прогнозов
                        </Typography>

                        <Typography variant="h5">

                            {count}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>

                <Card>

                    <CardContent>

                        <Typography
                            color="text.secondary"
                        >
                            Средний прогноз
                        </Typography>

                        <Typography variant="h5">

                            {averageForecast.toFixed(3)} ч

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>

                <Card>

                    <CardContent>

                        <Typography
                            color="text.secondary"
                        >
                            Средняя неопределённость
                        </Typography>

                        <Typography variant="h5">

                            {averageStd.toFixed(3)} ч

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>
    );
}