import {

    LineChart,

    Line,

    XAxis,

    YAxis,

    Tooltip,

    CartesianGrid,

    ResponsiveContainer

} from "recharts";

import { Paper, Typography } from "@mui/material";

import type { Dashboard } from "../../types/Dashboard";

interface Props{

    dashboard:Dashboard;

}

export default function RMSEChart({dashboard}:Props){

    return(

        <Paper sx={{mt:3,p:2}}>

            <Typography variant="h6">

                RMSE по экспериментам

            </Typography>

            <div style={{width:"100%",height:300}}>

                <ResponsiveContainer>

                    <LineChart data={dashboard.history}>

                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="date"/>

                        <YAxis/>

                        <Tooltip/>

                        <Line

                            type="monotone"

                            dataKey="rmse"

                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </Paper>

    );

}