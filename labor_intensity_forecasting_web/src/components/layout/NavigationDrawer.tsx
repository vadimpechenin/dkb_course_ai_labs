import {

    Drawer,

    Toolbar,

    List,

    ListItemButton,

    ListItemText

} from "@mui/material";

import { Link } from "react-router-dom";

const width = 250;

export default function NavigationDrawer() {

    return (

        <Drawer
            variant="permanent"
            sx={{
                width,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width
                }
            }}
        >

            <Toolbar />

            <List>

                <ListItemButton component={Link} to="/dashboard">

                    <ListItemText primary="Главная"/>

                </ListItemButton>

                <ListItemButton component={Link} to="/training">

                    <ListItemText primary="Обучение"/>

                </ListItemButton>

                <ListItemButton component={Link} to="/forecast">

                    <ListItemText primary="Прогноз"/>

                </ListItemButton>

                <ListItemButton component={Link} to="/models">

                    <ListItemText primary="Эксперименты"/>

                </ListItemButton>

                <ListItemButton component={Link} to="/dataset">

                    <ListItemText primary="Датасет"/>

                </ListItemButton>

                <ListItemButton component={Link} to="/predictions">

                    <ListItemText primary="История"/>

                </ListItemButton>

                <ListItemButton component={Link} to="/settings">

                    <ListItemText primary="Настройки"/>

                </ListItemButton>

            </List>

        </Drawer>

    );

}