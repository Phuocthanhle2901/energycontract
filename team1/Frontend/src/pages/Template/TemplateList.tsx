// src/pages/Template/TemplateList.tsx
import { useTemplates } from "@/hooks/usePdf";
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
    Tooltip,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import DeleteTemplateButton from "./TemplateDelete";

export default function TemplateList() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const { data, isLoading, isError } = useTemplates();
    const templates = Array.isArray(data) ? data : [];

    // ✅ theme colors (dark/light)
    const pageBg = "background.default";
    const cardBg = "background.paper";
    const borderColor = alpha(theme.palette.divider, 0.8);

    const headBg = isDark
        ? alpha(theme.palette.common.white, 0.06)
        : alpha(theme.palette.common.black, 0.04);

    const rowHoverBg = alpha(theme.palette.action.hover, isDark ? 0.35 : 0.6);

    // Loading state
    if (isLoading) {
        return (
            <Box sx={{ display: "flex" }}>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <CircularProgress size={20} />
                        <Typography color="text.primary">Loading templates...</Typography>
                    </Stack>
                </Box>
            </Box>
        );
    }

    // Error state
    if (isError) {
        return (
            <Box sx={{ display: "flex" }}>
                <NavMenu />
                <Typography sx={{ ml: { xs: 0, md: "260px" }, p: 3 }} color="error">
                    Failed to load templates. Please try again later.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box
                sx={{
                    ml: { xs: 0, md: "260px" },
                    p: 3,
                    width: "100%",
                    bgcolor: pageBg, // ✅ FIX darkmode
                    minHeight: "100vh",
                    color: "text.primary",
                }}
            >
                {/* HEADER */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} color="text.primary">
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
                        sx={{ fontWeight: 700 }}
                    >
                        New Template
                    </Button>
                </Stack>

                {/* TABLE */}
                <Paper
                    elevation={0} // ✅ đừng elevation=2 (dark nhìn bệt)
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: cardBg, // ✅ theo theme
                        border: `1px solid ${borderColor}`,
                        boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    {templates.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                            No templates found. Click "New Template" to create one.
                        </Typography>
                    ) : (
                        <Table size="small">
                            <TableHead sx={{ bgcolor: headBg }}>
                                <TableRow>
                                    <TableCell width="5%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        ID
                                    </TableCell>
                                    <TableCell width="25%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        Name
                                    </TableCell>
                                    <TableCell width="40%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        Description
                                    </TableCell>
                                    <TableCell width="10%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        Status
                                    </TableCell>
                                    <TableCell width="20%" align="right" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {templates.map((t: any) => (
                                    <TableRow
                                        key={t.id}
                                        hover
                                        sx={{
                                            "&:hover": { bgcolor: rowHoverBg },
                                        }}
                                    >
                                        <TableCell sx={{ color: "text.primary" }}>{t.id}</TableCell>

                                        <TableCell>
                                            <Typography fontWeight={700} color="text.primary">
                                                {t.name}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 420,
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    color: "text.primary",
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
                                                variant={isDark ? "outlined" : t.isActive ? "filled" : "outlined"} // ✅ dark nhìn rõ
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigate(`/templates/edit/${t.id}`)}
                                                        sx={{ color: "text.primary" }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <DeleteTemplateButton id={t.id} />
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
