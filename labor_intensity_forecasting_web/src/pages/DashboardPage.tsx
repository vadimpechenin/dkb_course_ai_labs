import {useEffect,useState} from "react";

import Grid from "@mui/material/Grid";

import StatisticCard from "../components/StatisticCard";

import {getDashboard} from "../api/dashboardApi";

export default function DashboardPage(){

    const[data,setData]=useState<any>();

    useEffect(()=>{

        getDashboard()

            .then(setData);

    },[]);

    if(!data)

        return<>Loading...</>;

    return(

        <Grid container spacing={2}>

            <Grid item xs={3}>

                <StatisticCard

                    title="Операций"

                    value={data.operationsCount}

                />

            </Grid>

            <Grid item xs={3}>

                <StatisticCard

                    title="Признаков"

                    value={data.featuresCount}

                />

            </Grid>

            <Grid item xs={3}>

                <StatisticCard

                    title="Активная модель"

                    value={data.activeModel}

                />

            </Grid>

            <Grid item xs={3}>

                <StatisticCard

                    title="RMSE"

                    value={data.rmse}

                />

            </Grid>

        </Grid>

    );

}