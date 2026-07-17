import Grid from "@mui/material/Grid";

import StatisticCard from "../StatisticCard";

import type { Dashboard } from "../../types/Dashboard";

interface Props{

    dashboard:Dashboard;

}

export default function DashboardCards({dashboard}:Props){

    return(

        <Grid container spacing={2}>

            <Grid item xs={4}>

                <StatisticCard
                    title="Операций"
                    value={dashboard.operationsCount}
                />

            </Grid>

            <Grid item xs={4}>

                <StatisticCard
                    title="Признаков"
                    value={dashboard.featuresCount}
                />

            </Grid>

            <Grid item xs={4}>

                <StatisticCard
                    title="Активная модель"
                    value={dashboard.activeModel}
                />

            </Grid>

            <Grid item xs={4}>

                <StatisticCard
                    title="MAE"
                    value={dashboard.mae.toFixed(3)}
                />

            </Grid>

            <Grid item xs={4}>

                <StatisticCard
                    title="RMSE"
                    value={dashboard.rmse.toFixed(3)}
                />

            </Grid>

            <Grid item xs={4}>

                <StatisticCard
                    title="R²"
                    value={dashboard.r2.toFixed(3)}
                />

            </Grid>

        </Grid>

    );

}