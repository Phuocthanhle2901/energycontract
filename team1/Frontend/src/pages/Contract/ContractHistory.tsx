import { Box, Paper, Typography } from "@mui/material";

interface HistoryItem {
    id: number;
    oldValue: any;
    newValue: any;
    timestamp: string;
}

interface Props {
    logs: HistoryItem[];
}

export default function ContractHistory({ logs }: Props) {
    return (
        <Box>
            {logs.length === 0 ? (
                <Typography>Không có lịch sử thay đổi.</Typography>
            ) : (
                logs.map((log) => (
                    <Paper
                        key={log.id}
                        sx={{
                            p: 2,
                            mb: 2,
                            borderLeft: "5px solid #1976d2",
                            borderRadius: "8px",
                        }}
                    >
                        <Typography fontWeight={700}>
                            Thời gian: {new Date(log.timestamp).toLocaleString()}
                        </Typography>

                        <Typography mt={1} color="gray">
                            <strong>Old:</strong> {JSON.stringify(log.oldValue)}
                        </Typography>

                        <Typography mt={1} color="green">
                            <strong>New:</strong> {JSON.stringify(log.newValue)}
                        </Typography>
                    </Paper>
                ))
            )}
        </Box>
    );
}
