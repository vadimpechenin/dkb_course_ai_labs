import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import AppLayout from "../components/layout/AppLayout";

import DashboardCards from "../components/dashboard/DashboardCards";
import RMSEChart from "../components/dashboard/RMSEChart";
import TrainingInfo from "../components/dashboard/TrainingInfo";
import ModelInfoCard from "../components/dashboard/ModelInfoCard";
import DatasetInfoCard from "../components/dashboard/DatasetInfoCard";

import { getDashboard } from "../api/dashboardApi";

import type { Dashboard } from "../types/Dashboard";

export default function DashboardPage() {

    const [dashboard, setDashboard] = useState<Dashboard>();

    useEffect(() => {

        getDashboard().then(setDashboard);

    }, []);

    if (!dashboard)

        return <>Loading...</>;

    return (

        <AppLayout>

            <DashboardCards dashboard={dashboard} />

            <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
            >

                <Grid item xs={6}>

                    <ModelInfoCard dashboard={dashboard} />

                </Grid>

                <Grid item xs={6}>

                    <DatasetInfoCard dashboard={dashboard} />

                </Grid>

            </Grid>

            <RMSEChart dashboard={dashboard} />

            <TrainingInfo dashboard={dashboard} />

        </AppLayout>

    );

}