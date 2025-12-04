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
                <Typography>No history records found.</Typography>
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
                        {/* TIME */}
                        <Typography fontWeight={700}>
                            Time: {new Date(log.timestamp).toLocaleString()}
                        </Typography>

                        {/* OLD VALUE */}
                        <Typography mt={1} color="gray">
                            <strong>Old Value:</strong>{" "}
                            {JSON.stringify(log.oldValue, null, 2)}
                        </Typography>

                        {/* NEW VALUE */}
                        <Typography mt={1} color="green">
                            <strong>New Value:</strong>{" "}
                            {JSON.stringify(log.newValue, null, 2)}
                        </Typography>
                    </Paper>
                ))
            )}
        </Box>
    );
}
