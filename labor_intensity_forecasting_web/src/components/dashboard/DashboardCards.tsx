import Grid from "@mui/material/Grid";

import StatisticCard from "../StatisticCard";

import type { Dashboard } from "../../types/Dashboard";

interface Props{

    dashboard:Dashboard;

}

function formatNumber(
    value: number | null | undefined,
    digits = 3
): string {

    if (value === null || value === undefined) {
        return "-";
    }

    return value.toFixed(digits);
}

export default function DashboardCards({dashboard}:Props){

    return(

        <Grid container spacing={2}>

            <Grid size={{ xs: 4}}>

                <StatisticCard
                    title="Операций"
                    value={dashboard.operationsCount}
                />

            </Grid>

            <Grid size={{ xs: 4}}>

                <StatisticCard
                    title="Признаков"
                    value={dashboard.featuresCount}
                />

            </Grid>

            <Grid size={{ xs: 4}}>

                <StatisticCard
                    title="Активная модель"
                    value={dashboard.activeModel}
                />

            </Grid>

            <Grid size={{ xs: 4}}>

                <StatisticCard
                    title="MAE"
                    value={formatNumber(dashboard.mae)}
                />

            </Grid>

            <Grid size={{ xs: 4}}>

                <StatisticCard
                    title="RMSE"
                    value={formatNumber(dashboard.rmse)}
                />

            </Grid>

            <Grid size={{ xs: 4}}>

                <StatisticCard
                    title="R²"
                    value={formatNumber(dashboard.r2)}
                />

            </Grid>

        </Grid>

    );

}