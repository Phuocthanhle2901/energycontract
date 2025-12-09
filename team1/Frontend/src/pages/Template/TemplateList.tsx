// src/pages/Template/TemplateList.tsx
import { useQuery } from "@tanstack/react-query";
import { TemplateApi } from "@/api/template.api";

import {
    Box,
    Button,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Stack,
    Chip,
    IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteTemplate } from "./TemplateDelete";
import NavMenu from "@/components/NavMenu/NavMenu";

interface Template {
    id: number;
    name: string;
    description: string;
    htmlContent: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function TemplateList() {
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch } = useQuery<Template[]>({
        queryKey: ["templates"],
        queryFn: TemplateApi.getAll,
    });

    const templates = Array.isArray(data) ? data : [];

    const handleDelete = async (id: number) => {
        const ok = window.confirm("Are you sure you want to delete this template?");
        if (!ok) return;

        await deleteTemplate(id, refetch);
    };

    // Loading & error giống ContractList: chỉ hiển thị text lệch phải sidebar
    if (isLoading) {
        return (
            <Typography sx={{ ml: "260px", p: 3 }}>Loading templates...</Typography>
        );
    }

    if (isError) {
        return (
            <Typography sx={{ ml: "260px", p: 3 }} color="error">
                Failed to load templates. Please try again later.
            </Typography>
        );
    }

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            {/* Phần nội dung chính lệch phải giống ContractList */}
            <Box
                sx={{
                    ml: "240px",
                    p: 3,
                    width: "100%",
                    bgcolor: "#f5f7fa",
                    minHeight: "100vh",
                }}
            >
                {/* HEADER */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            PDF Templates
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage contract PDF templates for the Energy Contract Manager.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/templates/create")}
                        sx={{ fontWeight: 600 }}
                    >
                        New Template
                    </Button>
                </Stack>

                {/* TABLE */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {templates.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No templates found. Click &quot;New Template&quot; to create one.
                        </Typography>
                    ) : (
                        <Table size="small">
                            <TableHead sx={{ background: "#f8fafc" }}>
                                <TableRow>
                                    <TableCell width="5%">ID</TableCell>
                                    <TableCell width="25%">Name</TableCell>
                                    <TableCell width="40%">Description</TableCell>
                                    <TableCell width="10%">Status</TableCell>
                                    <TableCell width="20%" align="right">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {templates.map((t) => (
                                    <TableRow key={t.id} hover>
                                        <TableCell>{t.id}</TableCell>

                                        <TableCell>
                                            <Typography fontWeight={600}>{t.name}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 420,
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                }}
                                                title={t.description}
                                            >
                                                {t.description}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={t.isActive ? "Active" : "Inactive"}
                                                color={t.isActive ? "success" : "default"}
                                                variant={t.isActive ? "filled" : "outlined"}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                justifyContent="flex-end"
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/templates/edit/${t.id}`)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(t.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
