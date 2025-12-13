import {
    Box, Button, Card, Typography, Table, TableHead, TableRow,
    TableCell, TableBody, Stack, TextField, InputAdornment, Chip,
    MenuItem, Menu, CircularProgress
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useState } from "react";

// Hooks
import { useAddresses } from "@/hooks/useAddresses";
import { useResellers } from "@/hooks/useResellers";

// Components Address
import AddressCreate from "./AddressCreate";
import AddressEdit from "./AddressEdit";
import AddressDelete from "./AddressDelete";

// Components Reseller
import ResellerCreate from "./ResellerCreate";
import ResellerEdit from "./ResellerEdit";
import ResellerDelete from "./ResellerDelete";

export default function AddressResellerList() {
    const [search, setSearch] = useState("");
    
    // --- State quản lý Menu "Add New" ---
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    // --- State quản lý Modal Address ---
    const [addrModal, setAddrModal] = useState<{
        type: "create" | "edit" | "delete" | null;
        data?: any;
    }>({ type: null });

    // --- State quản lý Modal Reseller ---
    const [resModal, setResModal] = useState<{
        type: "create" | "edit" | "delete" | null;
        data?: any;
    }>({ type: null });

    // ============================
    // FETCH DATA (React Query)
    // ============================
    // Lấy 100 item mỗi loại để hiển thị (hoặc pagination nếu cần)
    const { data: addressData, isLoading: loadingAddr } = useAddresses({
        pageNumber: 1,
        pageSize: 100,
        search: search || undefined, // Server-side search
    });

    const { data: resellerData, isLoading: loadingRes } = useResellers({
        pageNumber: 1,
        pageSize: 100,
        search: search || undefined, // Server-side search
    });

    const addresses = addressData?.items || [];
    const resellers = resellerData?.items || [];

    // ============================
    // HANDLERS
    // ============================
    const handleOpenMenu = (e: any) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4, width: "100%", background: "#F8FAFC", minHeight: "100vh" }}>

                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" fontWeight={700}>
                        Address & Reseller Management
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenMenu}
                    >
                        Add New
                    </Button>

                    <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
                        <MenuItem onClick={() => { handleCloseMenu(); setAddrModal({ type: "create" }); }}>
                            Add Address
                        </MenuItem>
                        <MenuItem onClick={() => { handleCloseMenu(); setResModal({ type: "create" }); }}>
                            Add Reseller
                        </MenuItem>
                    </Menu>
                </Stack>

                {/* SEARCH BAR */}
                <Card sx={{ p: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search addresses or resellers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Card>

                {/* ADDRESS TABLE */}
                <Card sx={{ p: 3, mb: 5 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Address List
                    </Typography>

                    {loadingAddr ? (
                        <Box p={2} display="flex" justifyContent="center"><CircularProgress size={24} /></Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Zip Code</TableCell>
                                    <TableCell>House</TableCell>
                                    <TableCell>Extension</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {addresses.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} align="center">No addresses found</TableCell></TableRow>
                                ) : (
                                    addresses.map((a) => (
                                        <TableRow key={a.id} hover>
                                            <TableCell>{a.zipCode}</TableCell>
                                            <TableCell>{a.houseNumber}</TableCell>
                                            <TableCell>{a.extension}</TableCell>

                                            <TableCell align="right">
                                                <Button
                                                    startIcon={<EditIcon />}
                                                    onClick={() => setAddrModal({ type: "edit", data: a })}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => setAddrModal({ type: "delete", data: a })}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </Card>

                {/* RESELLER TABLE */}
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Reseller List
                    </Typography>

                    {loadingRes ? (
                        <Box p={2} display="flex" justifyContent="center"><CircularProgress size={24} /></Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {resellers.length === 0 ? (
                                    <TableRow><TableCell colSpan={3} align="center">No resellers found</TableCell></TableRow>
                                ) : (
                                    resellers.map((r) => (
                                        <TableRow key={r.id} hover>
                                            <TableCell>{r.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={r.type}
                                                    color={r.type === "Broker" ? "info" : "secondary"}
                                                />
                                            </TableCell>

                                            <TableCell align="right">
                                                <Button
                                                    startIcon={<EditIcon />}
                                                    onClick={() => setResModal({ type: "edit", data: r })}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => setResModal({ type: "delete", data: r })}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </Card>

                {/* MODAL FORM (Address) */}
                {addrModal.type === "create" && <AddressCreate open={true} onClose={() => setAddrModal({ type: null })} />}
                {addrModal.type === "edit" && <AddressEdit open={true} onClose={() => setAddrModal({ type: null })} data={addrModal.data} />}
                {addrModal.type === "delete" && <AddressDelete open={true} onClose={() => setAddrModal({ type: null })} data={addrModal.data} />}

                {/* MODAL FORM (Reseller) */}
                {resModal.type === "create" && <ResellerCreate open={true} onClose={() => setResModal({ type: null })} />}
                {resModal.type === "edit" && <ResellerEdit open={true} onClose={() => setResModal({ type: null })} data={resModal.data} />}
                {resModal.type === "delete" && <ResellerDelete open={true} onClose={() => setResModal({ type: null })} data={resModal.data} />}
            </Box>
        </Box>
    );
}
