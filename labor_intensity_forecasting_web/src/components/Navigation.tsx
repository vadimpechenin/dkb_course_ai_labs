import {Drawer,List,ListItemButton,ListItemText} from "@mui/material";

export default function Navigation(){

    return(

        <Drawer variant="permanent">

            <List>

                <ListItemButton>

                    <ListItemText primary="Главная"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Обучение"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Прогноз"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Эксперименты"/>

                </ListItemButton>

                <ListItemButton>

                    <ListItemText primary="Датасет"/>

                </ListItemButton>

            </List>

        </Drawer>

    );

}