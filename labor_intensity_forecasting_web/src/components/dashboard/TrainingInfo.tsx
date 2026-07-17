import { Paper, Typography } from "@mui/material";

import type { Dashboard } from "../../types/Dashboard";

interface Props{

    dashboard:Dashboard;

}

export default function TrainingInfo({dashboard}:Props){

    return(

        <Paper sx={{mt:3,p:2}}>

            <Typography variant="h6">

                Последнее обучение

            </Typography>

            <Typography>

                Дата:

                {dashboard.lastTraining}

            </Typography>

            <Typography>

                Размер датасета:

                {dashboard.datasetSize}

            </Typography>

            <Typography>

                Время обучения:

                {dashboard.trainingTime} сек

            </Typography>

        </Paper>

    );

}