import {
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
    Button,
} from "@mui/material";

import { FiArrowLeft } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";

import { useContractHistory } from "@/hooks/useContractHistory";
import { useContract } from "@/hooks/useContracts";

export default function ContractHistoryPage() {
    const { contractId } = useParams();
    const id = Number(contractId);

    const navigate = useNavigate();

    const { data: history } = useContractHistory(id);
    const { data: contract } = useContract(id);

    if (!history) return <Box p={3}>Loading...</Box>;

    return (
        <Box p={3}>
            <Stack direction="row" spacing={2} mb={2}>
                <Button startIcon={<FiArrowLeft />} onClick={() => navigate(-1)}>
                    Back
                </Button>

                <Typography variant="h5" fontWeight="bold">
                    Contract History #{id}
                </Typography>
            </Stack>

            <Typography mb={3}>
                Customer: <b>{contract?.customerName}</b>
            </Typography>

            {history.map((h: any, idx: number) => (
                <Card key={idx} sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                            Updated at: {new Date(h.changedAt).toLocaleString("vi-VN")}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        {Object.entries(h.changes).map(([field, change]: any) => (
                            <Stack key={field} mb={1}>
                                <Typography>
                                    <b>{field}</b>
                                </Typography>
                                <Typography color="error">
                                    Old: {change.oldValue ?? "—"}
                                </Typography>
                                <Typography color="green">
                                    New: {change.newValue ?? "—"}
                                </Typography>
                            </Stack>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
