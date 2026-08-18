import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";


import type {
    MLModel
} from "../../types/Models";


interface Props {

    model: MLModel;

}


export default function ActiveModelCard({
                                            model
                                        }: Props) {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Активная модель
                </Typography>


                <Typography
                    variant="h5"
                    sx={{ mt: 1 }}
                >
                    {model.name}
                </Typography>


                <Chip
                    label="Активна"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                />


                {model.framework && (

                    <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                    >
                        Framework:{" "}
                        {model.framework}
                    </Typography>

                )}


                {model.description && (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {model.description}
                    </Typography>

                )}

            </CardContent>

        </Card>
    );
}