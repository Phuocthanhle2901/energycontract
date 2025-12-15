import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
    TextField,
    InputAdornment,
    Chip,
    MenuItem,
    Menu,
    CircularProgress,
    Divider,
    useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import { useTranslation } from "react-i18next";

import NavMenu from "@/components/NavMenu/NavMenu";

// Hooks
import { useAddresses } from "@/hooks/useAddresses";
import { useResellers } from "@/hooks/useResellers";

// Address Modals
import AddressCreate from "./AddressCreate";
import AddressEdit from "./AddressEdit";
import AddressDelete from "./AddressDelete";

// Reseller Modals
import ResellerCreate from "./ResellerCreate";
import ResellerEdit from "./ResellerEdit";
import ResellerDelete from "./ResellerDelete";

export default function AddressResellerList() {
    const { t } = useTranslation();

    const PAGE_SIZE = 10;

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // màu theo theme (không hard-code)
    const pageBg = "background.default";
    const cardBg = "background.paper";
    const borderColor = theme.palette.divider;

    const headBg = isDark
        ? alpha(theme.palette.common.white, 0.06)
        : alpha(theme.palette.common.black, 0.04);

    const rowHoverBg = alpha(theme.palette.action.hover, isDark ? 0.25 : 0.6);

    // =========================
    // ADD NEW MENU
    // =========================
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    // =========================
    // ADDRESS STATES
    // =========================
    const [addrSearch, setAddrSearch] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [addrPage, setAddrPage] = useState(1);

    // =========================
    // RESELLER STATES
    // =========================
    const [resSearch, setResSearch] = useState("");
    const [resType, setResType] = useState("");
    const [resPage, setResPage] = useState(1);

    // =========================
    // MODAL STATES
    // =========================
    const [addrModal, setAddrModal] = useState<{ type: "create" | "edit" | "delete" | null; data?: any }>({
        type: null,
    });
    const [resModal, setResModal] = useState<{ type: "create" | "edit" | "delete" | null; data?: any }>({
        type: null,
    });

    // =========================
    // FETCH DATA
    // =========================
    const { data: addressData, isLoading: loadingAddr } = useAddresses({
        search: addrSearch || undefined,
        zipCode: zipCode || undefined,
        pageNumber: addrPage,
        pageSize: PAGE_SIZE,
        sortBy: "zipCode",
        sortDesc: false,
    });

    const { data: resellerData, isLoading: loadingRes } = useResellers({
        search: resSearch || undefined,
        type: resType || undefined,
        pageNumber: resPage,
        pageSize: PAGE_SIZE,
        sortBy: "name",
        sortDesc: false,
    });

    const addresses = addressData?.items ?? [];
    const resellers = resellerData?.items ?? [];

    // zipCode unique (đỡ bị lặp)
    const zipOptions = useMemo(() => {
        const s = new Set<string>();
        addresses.forEach((a: any) => a?.zipCode && s.add(a.zipCode));
        return Array.from(s);
    }, [addresses]);

    const addrTotalCount = addressData?.totalCount ?? 0;
    const resTotalCount = resellerData?.totalCount ?? 0;

    const addrTotalPages = Math.max(1, Math.ceil(addrTotalCount / PAGE_SIZE));
    const resTotalPages = Math.max(1, Math.ceil(resTotalCount / PAGE_SIZE));

    const addrShownCount = addrTotalCount === 0 ? 0 : (addrPage - 1) * PAGE_SIZE + addresses.length;
    const resShownCount = resTotalCount === 0 ? 0 : (resPage - 1) * PAGE_SIZE + resellers.length;

    const addrCanPrev = addrPage > 1;
    const addrCanNext = addrPage < addrTotalPages;

    const resCanPrev = resPage > 1;
    const resCanNext = resPage < resTotalPages;

    // =========================
    // HANDLERS
    // =========================
    const handleOpenMenu = (e: any) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box
                sx={{
                    ml: "240px",
                    p: 4,
                    width: "100%",
                    minHeight: "100vh",
                    bgcolor: pageBg,
                }}
            >
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between" mb={4} alignItems="center">
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                        {t("Address & Reseller Management", { defaultValue: "Address & Reseller Management" })}
                    </Typography>

                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenMenu}>
                        {t("Add New", { defaultValue: "Add New" })}
                    </Button>

                    <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
                        <MenuItem
                            onClick={() => {
                                handleCloseMenu();
                                setAddrModal({ type: "create" });
                            }}
                        >
                            {t("Add Address", { defaultValue: "Add Address" })}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleCloseMenu();
                                setResModal({ type: "create" });
                            }}
                        >
                            {t("Add Reseller", { defaultValue: "Add Reseller" })}
                        </MenuItem>
                    </Menu>
                </Stack>

                {/* ================= ADDRESS SECTION ================= */}
                <Card
                    sx={{
                        p: 3,
                        mb: 5,
                        borderRadius: 4,
                        overflow: "hidden",
                        bgcolor: cardBg,
                        border: `1px solid ${borderColor}`,
                        boxShadow: isDark ? "none" : undefined,
                    }}
                >
                    <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
                        {t("Address List", { defaultValue: "Address List" })}
                    </Typography>

                    {/* FILTER */}
                    <Stack direction="row" spacing={2} mb={2} alignItems="center" flexWrap="nowrap">
                        <TextField
                            placeholder={t("common.search")}
                            value={addrSearch}
                            onChange={(e) => {
                                setAddrSearch(e.target.value);
                                setAddrPage(1);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 1, minWidth: 320 }}
                        />

                        <TextField
                            select
                            label={t("Zip Code", { defaultValue: "Zip Code" })}
                            value={zipCode}
                            onChange={(e) => {
                                setZipCode(e.target.value);
                                setAddrPage(1);
                            }}
                            sx={{ width: 180 }}
                        >
                            <MenuItem value="">{t("common.all")}</MenuItem>
                            {zipOptions.map((z) => (
                                <MenuItem key={z} value={z}>
                                    {z}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    {loadingAddr ? (
                        <Box py={3} display="flex" justifyContent="center">
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <>
                            <Table>
                                <TableHead sx={{ bgcolor: headBg }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {t("Zip Code", { defaultValue: "Zip Code" })}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {t("House", { defaultValue: "House" })}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {t("Extension", { defaultValue: "Extension" })}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {t("common.actions")}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {addresses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                                {t("No addresses found", { defaultValue: "No addresses found" })}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        addresses.map((a: any) => (
                                            <TableRow key={a.id} hover sx={{ "&:hover": { bgcolor: rowHoverBg } }}>
                                                <TableCell sx={{ color: "text.primary" }}>{a.zipCode}</TableCell>
                                                <TableCell sx={{ color: "text.primary" }}>{a.houseNumber}</TableCell>
                                                <TableCell sx={{ color: "text.primary" }}>{a.extension}</TableCell>
                                                <TableCell align="right">
                                                    <Button startIcon={<EditIcon />} onClick={() => setAddrModal({ type: "edit", data: a })}>
                                                        {t("Edit", { defaultValue: "Edit" })}
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => setAddrModal({ type: "delete", data: a })}
                                                    >
                                                        {t("Delete", { defaultValue: "Delete" })}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            <Divider sx={{ borderColor }} />

                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    bgcolor: cardBg,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {t("Showing", { defaultValue: "Showing" })} <b>{addrShownCount}</b> {t("of", { defaultValue: "of" })}{" "}
                                    <b>{addrTotalCount}</b>
                                </Typography>

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button
                                        variant="text"
                                        disabled={!addrCanPrev}
                                        onClick={() => setAddrPage((p) => Math.max(1, p - 1))}
                                        sx={{ fontSize: 12 }}
                                    >
                                        {t("prev")}
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        {t("Page")} <b>{addrPage}</b> / <b>{addrTotalPages}</b>
                                    </Typography>
                                    <Button
                                        variant="text"
                                        disabled={!addrCanNext}
                                        onClick={() => setAddrPage((p) => Math.min(addrTotalPages, p + 1))}
                                        sx={{ fontSize: 12 }}
                                    >
                                        {t("next")}
                                    </Button>
                                </Stack>
                            </Box>
                        </>
                    )}
                </Card>

                {/* ================= RESELLER SECTION ================= */}
                <Card
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        overflow: "hidden",
                        bgcolor: cardBg,
                        border: `1px solid ${borderColor}`,
                        boxShadow: isDark ? "none" : undefined,
                    }}
                >
                    <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
                        {t("Reseller List", { defaultValue: "Reseller List" })}
                    </Typography>

                    {/* FILTER */}
                    <Stack direction="row" spacing={2} mb={2} alignItems="center" flexWrap="nowrap">
                        <TextField
                            placeholder={t("common.search")}
                            value={resSearch}
                            onChange={(e) => {
                                setResSearch(e.target.value);
                                setResPage(1);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 1, minWidth: 320 }}
                        />

                        <TextField
                            select
                            label={t("Type", { defaultValue: "Type" })}
                            value={resType}
                            onChange={(e) => {
                                setResType(e.target.value);
                                setResPage(1);
                            }}
                            sx={{ width: 180 }}
                        >
                            <MenuItem value="">{t("common.all")}</MenuItem>
                            <MenuItem value="Broker">{t("Broker", { defaultValue: "Broker" })}</MenuItem>
                            <MenuItem value="Supplier">{t("Supplier", { defaultValue: "Supplier" })}</MenuItem>
                            <MenuItem value="Agency">{t("Agency", { defaultValue: "Agency" })}</MenuItem>
                        </TextField>
                    </Stack>

                    {loadingRes ? (
                        <Box py={3} display="flex" justifyContent="center">
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <>
                            <Table>
                                <TableHead sx={{ bgcolor: headBg }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {t("Name", { defaultValue: "Name" })}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {t("Type", { defaultValue: "Type" })}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: "text.primary" }}>
                                            {t("common.actions")}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {resellers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                                {t("No resellers found", { defaultValue: "No resellers found" })}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        resellers.map((r: any) => (
                                            <TableRow key={r.id} hover sx={{ "&:hover": { bgcolor: rowHoverBg } }}>
                                                <TableCell sx={{ color: "text.primary" }}>{r.name}</TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={r.type}
                                                        color={r.type === "Broker" ? "info" : "secondary"}
                                                        size="small"
                                                        variant={isDark ? "outlined" : "filled"}
                                                    />
                                                </TableCell>

                                                <TableCell align="right">
                                                    <Button startIcon={<EditIcon />} onClick={() => setResModal({ type: "edit", data: r })}>
                                                        {t("Edit", { defaultValue: "Edit" })}
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => setResModal({ type: "delete", data: r })}
                                                    >
                                                        {t("Delete", { defaultValue: "Delete" })}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            <Divider sx={{ borderColor }} />

                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    bgcolor: cardBg,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {t("Showing", { defaultValue: "Showing" })} <b>{resShownCount}</b> {t("of", { defaultValue: "of" })}{" "}
                                    <b>{resTotalCount}</b>
                                </Typography>

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button
                                        variant="text"
                                        disabled={!resCanPrev}
                                        onClick={() => setResPage((p) => Math.max(1, p - 1))}
                                        sx={{ fontSize: 12 }}
                                    >
                                        {t("prev")}
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        {t("Page")} <b>{resPage}</b> / <b>{resTotalPages}</b>
                                    </Typography>
                                    <Button
                                        variant="text"
                                        disabled={!resCanNext}
                                        onClick={() => setResPage((p) => Math.min(resTotalPages, p + 1))}
                                        sx={{ fontSize: 12 }}
                                    >
                                        {t("next")}
                                    </Button>
                                </Stack>
                            </Box>
                        </>
                    )}
                </Card>

                {/* MODALS */}
                {addrModal.type === "create" && <AddressCreate open onClose={() => setAddrModal({ type: null })} />}
                {addrModal.type === "edit" && <AddressEdit open onClose={() => setAddrModal({ type: null })} data={addrModal.data} />}
                {addrModal.type === "delete" && <AddressDelete open onClose={() => setAddrModal({ type: null })} data={addrModal.data} />}

                {resModal.type === "create" && <ResellerCreate open onClose={() => setResModal({ type: null })} />}
                {resModal.type === "edit" && <ResellerEdit open onClose={() => setResModal({ type: null })} data={resModal.data} />}
                {resModal.type === "delete" && <ResellerDelete open onClose={() => setResModal({ type: null })} data={resModal.data} />}
            </Box>
        </Box>
    );
}
