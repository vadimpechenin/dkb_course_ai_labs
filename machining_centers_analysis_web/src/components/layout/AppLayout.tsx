import { Box, Toolbar } from "@mui/material";

import Header from "./Header";

import NavigationDrawer from "./NavigationDrawer";

interface Props {

    children: React.ReactNode;

}

export default function AppLayout({ children }: Props) {

    return (

        <Box sx={{ display: "flex" }}>

            <Header />

            <NavigationDrawer />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3
                }}
            >

                <Toolbar />

                {children}

            </Box>

        </Box>

    );

}