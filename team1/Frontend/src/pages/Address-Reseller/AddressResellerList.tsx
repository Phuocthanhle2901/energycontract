import {
    Box, Button, Card, Typography, Table, TableHead, TableRow,
    TableCell, TableBody, Stack, TextField, InputAdornment, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Menu
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import NavMenu from "@/components/NavMenu/NavMenu";

import { useEffect, useState } from "react";

import { AddressApi } from "@/api/address.api";
import { ResellerApi } from "@/api/reseller.api";

export default function AddressResellerList() {

    const [search, setSearch] = useState("");

    const [addresses, setAddresses] = useState<any[]>([]);
    const [resellers, setResellers] = useState<any[]>([]);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("");
    const [target, setTarget] = useState("");
    const [current, setCurrent] = useState<any>({});

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleOpenMenu = (e: any) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    // ============================
    // FETCH DATA (Paged API chuẩn)
    // ============================
    const loadData = async () => {
        try {
            const addressRes = await AddressApi.getAll({
                PageNumber: 1,
                PageSize: 200
            });

            const resellerRes = await ResellerApi.getAll({
                PageNumber: 1,
                PageSize: 200
            });

            setAddresses(addressRes.items || []);
            setResellers(resellerRes.items || []);

        } catch (err) {
            console.error(err);
            alert("Error loading data");
        }
    };

    useEffect(() => { loadData(); }, []);

    // ============================
    // POPUP HANDLER
    // ============================
    const openPopup = (m: string, t: string, item: any = null) => {
        setMode(m);
        setTarget(t);

        if (t === "address") {
            setCurrent(item || { zipCode: "", houseNumber: "", extension: "" });
        } else {
            setCurrent(item || { name: "", type: "Broker" });
        }

        setOpen(true);
    };

    const closePopup = () => setOpen(false);

    // ============================
    // HANDLE INPUT CHANGE
    // ============================
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCurrent((prev: any) => ({ ...prev, [name]: value }));
    };

    // ============================
    // SUBMIT CRUD
    // ============================
    const handleSubmit = async () => {
        try {
            if (target === "address") {
                if (mode === "create") await AddressApi.create(current);
                if (mode === "edit") await AddressApi.update(current.id, current);
                if (mode === "delete") await AddressApi.delete(current.id);
            }

            if (target === "reseller") {
                if (mode === "create") await ResellerApi.create(current);
                if (mode === "edit") await ResellerApi.update(current.id, current);
                if (mode === "delete") await ResellerApi.delete(current.id);
            }

            closePopup();
            loadData();

        } catch (err) {
            console.error(err);
            alert("Error saving data");
        }
    };

    // ============================
    // FILTER SEARCH LOCAL
    // ============================
    const filteredAddresses = addresses.filter((a) =>
        `${a.zipCode} ${a.houseNumber} ${a.extension}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const filteredResellers = resellers.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4, width: "100%", background: "#F8FAFC" }}>

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
                        <MenuItem onClick={() => { handleCloseMenu(); openPopup("create", "address"); }}>
                            Add Address
                        </MenuItem>
                        <MenuItem onClick={() => { handleCloseMenu(); openPopup("create", "reseller"); }}>
                            Add Reseller
                        </MenuItem>
                    </Menu>
                </Stack>

                {/* SEARCH BAR */}
                <Card sx={{ p: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
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
                            {filteredAddresses.map((a) => (
                                <TableRow key={a.id} hover>
                                    <TableCell>{a.zipCode}</TableCell>
                                    <TableCell>{a.houseNumber}</TableCell>
                                    <TableCell>{a.extension}</TableCell>

                                    <TableCell align="right">
                                        <Button
                                            startIcon={<EditIcon />}
                                            onClick={() => openPopup("edit", "address", a)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => openPopup("delete", "address", a)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* RESELLER TABLE */}
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Reseller List
                    </Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredResellers.map((r) => (
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
                                            onClick={() => openPopup("edit", "reseller", r)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => openPopup("delete", "reseller", r)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* POPUP FORM (Address + Reseller) */}
                <Dialog open={open} onClose={closePopup} fullWidth maxWidth="sm">
                    <DialogTitle>
                        {mode === "create" && `Create ${target}`}
                        {mode === "edit" && `Edit ${target}`}
                        {mode === "delete" && `Delete ${target}`}
                    </DialogTitle>

                    <DialogContent>
                        {mode === "delete" ? (
                            <Typography>
                                Are you sure you want to delete this {target}?
                            </Typography>
                        ) : (
                            <>
                                {target === "address" && (
                                    <>
                                        <TextField
                                            margin="dense"
                                            label="Zip Code"
                                            name="zipCode"
                                            fullWidth
                                            value={current.zipCode || ""}
                                            onChange={handleChange}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="House Number"
                                            name="houseNumber"
                                            fullWidth
                                            value={current.houseNumber || ""}
                                            onChange={handleChange}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="Extension"
                                            name="extension"
                                            fullWidth
                                            value={current.extension || ""}
                                            onChange={handleChange}
                                        />
                                    </>
                                )}

                                {target === "reseller" && (
                                    <>
                                        <TextField
                                            margin="dense"
                                            label="Name"
                                            name="name"
                                            fullWidth
                                            value={current.name || ""}
                                            onChange={handleChange}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="Type"
                                            name="type"
                                            select
                                            fullWidth
                                            value={current.type || ""}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Broker">Broker</MenuItem>
                                            <MenuItem value="Agency">Agency</MenuItem>
                                        </TextField>
                                    </>
                                )}
                            </>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={closePopup}>Cancel</Button>

                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color={mode === "delete" ? "error" : "primary"}
                        >
                            {mode === "delete" ? "Delete" : "Save"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
}
