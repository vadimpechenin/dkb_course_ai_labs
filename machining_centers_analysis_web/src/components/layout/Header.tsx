import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Header() {

    return (

        <AppBar>

            <Toolbar>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h6">

            Классификация износа режущего инструмента

    </Typography>
                <Box sx={{ flexGrow: 1 }} />
    </Toolbar>

    </AppBar>

);

}