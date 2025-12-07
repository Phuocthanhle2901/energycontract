import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Stack,
    Chip,
    Button,
} from "@mui/material";

import NavMenu from "@/components/NavMenu/NavMenu";
import { ContractHistoryApi } from "../../api/contractHistory.api";

// ====================== HELPERS ======================
function jsonDiff(oldV: any, newV: any) {
    const diffs: any[] = [];

    for (const key of Object.keys({ ...oldV, ...newV })) {
        if (oldV[key] === newV[key]) continue;

        diffs.push({
            field: key,
            oldValue: oldV[key] ?? "—",
            newValue: newV[key] ?? "—",
        });
    }

    return diffs;
}

const formatDate = (d: string) =>
    new Date(d).toLocaleString("vi-VN", {
        hour12: false,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

// ====================== PAGE ======================
export default function ContractHistoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            ContractHistoryApi.getByContractId(Number(id))
                .then((res) => setHistory(Array.isArray(res) ? res : []))
                .finally(() => setLoading(false));
        }
    }, [id]);

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box
                sx={{
                    ml: "240px",
                    p: 4,
                    width: "100%",
                    bgcolor: "#f9fafb",
                    minHeight: "100vh",
                }}
            >
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" fontWeight={700}>
                        Contract History
                    </Typography>

                    <Chip
                        label={`Contract ID: ${id}`}
                        color="primary"
                        sx={{ fontWeight: 600, fontSize: "1rem" }}
                    />
                </Stack>

                {/* CONTENT */}
                {loading ? (
                    <Typography>Loading history...</Typography>
                ) : history.length === 0 ? (
                    <Typography sx={{ color: "#6b7280" }}>
                        This contract has no recorded changes.
                    </Typography>
                ) : (
                    <Stack spacing={3}>
                        {history.map((h) => {
                            const oldV = JSON.parse(h.oldValue ?? "{}");
                            const newV = JSON.parse(h.newValue ?? "{}");
                            const diffs = jsonDiff(oldV, newV);

                            return (
                                <Stack key={h.id} direction="row" spacing={3}>
                                    {/* TIMELINE DOT */}
                                    <Box
                                        sx={{
                                            width: "20px",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: "12px",
                                                height: "12px",
                                                bgcolor: "#2563eb",
                                                borderRadius: "50%",
                                                mt: "8px",
                                            }}
                                        />
                                    </Box>

                                    {/* CARD */}
                                    <Card
                                        sx={{
                                            flex: 1,
                                            borderRadius: 3,
                                            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <CardContent>
                                            <Typography fontWeight={700} sx={{ mb: 1 }}>
                                                Updated on {formatDate(h.timestamp)}
                                            </Typography>

                                            <Divider sx={{ mb: 2 }} />

                                            {diffs.map((d, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        mb: 2,
                                                        p: 2,
                                                        borderRadius: 2,
                                                        bgcolor: "#f8fafc",
                                                        border: "1px solid #e2e8f0",
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={700}
                                                        sx={{ mb: 0.5, fontSize: "1rem" }}
                                                    >
                                                        {d.field}
                                                    </Typography>

                                                    <Stack>
                                                        <Typography
                                                            sx={{
                                                                color: "#dc2626",
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            Old: {String(d.oldValue)}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                color: "#16a34a",
                                                                fontSize: "0.9rem",
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            New: {String(d.newValue)}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </Stack>
                            );
                        })}
                    </Stack>
                )}

                {/* BACK BUTTON */}
                <Button
                    variant="outlined"
                    sx={{ mt: 4 }}
                    onClick={() => navigate(`/contracts/${id}/detail`)}
                >
                    ← Back to Details
                </Button>
            </Box>
        </Box>
    );
}
