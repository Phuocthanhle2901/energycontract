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
import { useTranslation } from "react-i18next";

export default function TemplateList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const { data, isLoading, isError } = useTemplates();
    const templates = Array.isArray(data) ? data : [];

    const pageBg = "background.default";
    const cardBg = "background.paper";
    const borderColor = alpha(theme.palette.divider, 0.8);

    const headBg = isDark ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.common.black, 0.04);
    const rowHoverBg = alpha(theme.palette.action.hover, isDark ? 0.35 : 0.6);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex" }}>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <CircularProgress size={20} />
                        <Typography color="text.primary">{t("templateList.loading")}</Typography>
                    </Stack>
                </Box>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ display: "flex" }}>
                <NavMenu />
                <Typography sx={{ ml: { xs: 0, md: "260px" }, p: 3 }} color="error">
                    {t("templateList.loadFailed")}
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
                    bgcolor: pageBg,
                    minHeight: "100vh",
                    color: "text.primary",
                }}
            >
                {/* HEADER */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} color="text.primary">
                            {t("templateList.title")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t("templateList.subtitle")}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/templates/create")}
                        sx={{ fontWeight: 700 }}
                    >
                        {t("templateList.new")}
                    </Button>
                </Stack>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: cardBg,
                        border: `1px solid ${borderColor}`,
                        boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    {templates.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                            {t("templateList.empty")}
                        </Typography>
                    ) : (
                        <Table size="small">
                            <TableHead sx={{ bgcolor: headBg }}>
                                <TableRow>
                                    <TableCell width="5%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        {t("templateList.columns.id")}
                                    </TableCell>
                                    <TableCell width="25%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        {t("templateList.columns.name")}
                                    </TableCell>
                                    <TableCell width="40%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        {t("templateList.columns.description")}
                                    </TableCell>
                                    <TableCell width="10%" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        {t("templateList.columns.status")}
                                    </TableCell>
                                    <TableCell width="20%" align="right" sx={{ fontWeight: 800, color: "text.primary" }}>
                                        {t("templateList.columns.actions")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {templates.map((tpl: any) => (
                                    <TableRow
                                        key={tpl.id}
                                        hover
                                        sx={{
                                            "&:hover": { bgcolor: rowHoverBg },
                                        }}
                                    >
                                        <TableCell sx={{ color: "text.primary" }}>{tpl.id}</TableCell>

                                        <TableCell>
                                            <Typography fontWeight={700} color="text.primary">
                                                {tpl.name}
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
                                                title={tpl.description}
                                            >
                                                {tpl.description}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={tpl.isActive ? t("template.status.active") : t("template.status.inactive")}
                                                color={tpl.isActive ? "success" : "default"}
                                                variant={isDark ? "outlined" : tpl.isActive ? "filled" : "outlined"}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title={t("Edit")}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigate(`/templates/edit/${tpl.id}`)}
                                                        sx={{ color: "text.primary" }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <DeleteTemplateButton id={tpl.id} />
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
