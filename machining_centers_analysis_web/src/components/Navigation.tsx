import {Drawer,List,ListItemButton,ListItemText} from "@mui/material";
import { Link } from "react-router-dom";

export default function Navigation(){

    return(

        <Drawer variant="permanent">

            <List>

                <ListItemButton  component={Link} to="/dashboard">

                    <ListItemText primary="Главная"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Датасет"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Признаки"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Обучение"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Прогноз"/>

                </ListItemButton>
            </List>

        </Drawer>

    );

}