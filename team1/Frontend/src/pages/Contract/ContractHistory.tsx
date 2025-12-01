import { Box, Typography, Paper } from "@mui/material";
import type { Log } from "../../types/contractTypes";


export default function ContractHistory({ logs }: { logs: Log[] }) {
    if (!logs || logs.length === 0) {
        return <Typography>Chưa có lịch sử ghi nhận.</Typography>;
    }

    return (
        <Box>
            {logs.map((log, index) => (
                <Paper
                    key={index}
                    sx={{
                        p: 2,
                        mb: 2,
                        borderLeft: "4px solid #1976d2",
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        {log.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {log.timestamp}
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        {log.details}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
}
