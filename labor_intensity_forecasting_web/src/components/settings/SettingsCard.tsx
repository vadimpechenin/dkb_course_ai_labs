import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";


interface SettingsCardProps {
    settings: Record<string, unknown>;
}


function formatValue(value: unknown): string {

    if (value === null || value === undefined) {
        return "—";
    }

    if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
}


export default function SettingsCard({
                                         settings
                                     }: SettingsCardProps) {

    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Настройки приложения
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {Object.entries(settings).map(
                    ([key, value]) => (

                        <Box
                            key={key}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                                py: 1
                            }}
                        >

                            <Typography
                                variant="body2"
                                fontWeight="bold"
                            >
                                {key}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "right",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word"
                                }}
                            >
                                {formatValue(value)}
                            </Typography>

                        </Box>

                    )
                )}

            </CardContent>

        </Card>
    );
}