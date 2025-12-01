import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Button,
    Divider,
    Stack,
    Avatar,
} from "@mui/material";
import NavMenu from "@/components/NavMenu/NavMenu";
import { History, Edit, AddCircle, Sync } from "@mui/icons-material";

// MOCK DATA
const MOCK_CONTRACTS = [
    {
        contractNumber: "101",
        records: [
            { id: 1, action: "Created", date: "2025-12-01", note: "Contract created." },
            { id: 2, action: "Updated", date: "2025-12-05", note: "Start date updated." },
            { id: 3, action: "System Update", date: "2025-12-10", note: "Auto synced with system." },
        ],
    },
];

const actionIcons: any = {
    Created: <AddCircle color="success" />,
    Updated: <Edit color="primary" />,
    "System Update": <Sync color="warning" />,
};

const actionColors: any = {
    Created: "#4caf50",
    Updated: "#1976d2",
    "System Update": "#ff9800",
};

export default function ContractHistoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const contract = MOCK_CONTRACTS.find((c) => c.contractNumber === id);

    if (!contract) {
        return (
            <>
                <NavMenu />
                <Box sx={{ ml: "240px", p: 4 }}>
                    <Typography variant="h6">Contract not found.</Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate("/contracts/list")}>
                        Back to List
                    </Button>
                </Box>
            </>
        );
    }

    return (
        <>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4 }}>
                <Typography variant="h4" fontWeight={700} mb={3}>
                    Contract History #{contract.contractNumber}
                </Typography>

                <Paper sx={{ p: 4, borderRadius: 4 }}>
                    <Typography variant="h6" fontWeight={600} mb={3}>
                        <History sx={{ mr: 1, fontSize: 28 }} />
                        Change Log
                    </Typography>

                    <Stack spacing={3}>
                        {contract.records.map((record, index) => (
                            <Box key={record.id}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    {/* DATE */}
                                    <Typography
                                        sx={{
                                            width: 120,
                                            fontWeight: 600,
                                            color: "#666",
                                        }}
                                    >
                                        {record.date}
                                    </Typography>

                                    {/* TIMELINE DOT */}
                                    <Avatar
                                        sx={{
                                            width: 14,
                                            height: 14,
                                            bgcolor: actionColors[record.action] || "#777",
                                        }}
                                    />

                                    {/* CONTENT */}
                                    <Box>
                                        <Typography
                                            fontWeight={700}
                                            sx={{ display: "flex", alignItems: "center" }}
                                        >
                                            {actionIcons[record.action]}
                                            <span style={{ marginLeft: 8 }}>{record.action}</span>
                                        </Typography>

                                        <Typography sx={{ color: "#555", mt: 0.5 }}>
                                            {record.note}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Divider except last item */}
                                {index < contract.records.length - 1 && (
                                    <Divider sx={{ ml: "140px", my: 2 }} />
                                )}
                            </Box>
                        ))}
                    </Stack>

                    <Button
                        variant="outlined"
                        sx={{ mt: 4 }}
                        onClick={() => navigate("/contracts/list")}
                    >
                        Back to Contract List
                    </Button>
                </Paper>
            </Box>
        </>
    );
}
