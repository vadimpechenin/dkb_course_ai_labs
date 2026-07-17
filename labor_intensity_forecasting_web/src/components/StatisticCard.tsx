import {Card,CardContent,Typography} from "@mui/material";

interface Props{

    title:string;

    value:any;

}

export default function StatisticCard({title,value}:Props){

    return(

        <Card>

            <CardContent>

                <Typography variant="h6">

            {title}

            </Typography>

            <Typography variant="h4">

        {value}

        </Typography>

        </CardContent>

        </Card>

);

}