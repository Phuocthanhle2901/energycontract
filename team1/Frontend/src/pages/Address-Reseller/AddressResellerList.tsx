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

    // ============================
    // POPUP
    // ============================
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("");         // create | edit | delete
    const [target, setTarget] = useState("");     // address | reseller
    const [current, setCurrent] = useState<any>({});

    // ============================
    // DROPDOWN ADD NEW
    // ============================
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleOpenMenu = (e: any) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    // ============================
    // FETCH LIST
    // ============================
    const loadData = async () => {
        setAddresses(await AddressApi.getAll());
        setResellers(await ResellerApi.getAll());
    };

    useEffect(() => {
        loadData();
    }, []);

    // ============================
    // OPEN POPUP
    // ============================
    const openPopup = (m: string, t: string, item: any = null) => {
        setMode(m);
        setTarget(t);

        // init
        if (t === "address") {
            setCurrent(item || { zipCode: "", houseNumber: "", extension: "" });
        } else {
            setCurrent(item || { name: "", type: "Broker" });
        }

        setOpen(true);
    };

    const closePopup = () => setOpen(false);

    // ============================
    // HANDLE FORM CHANGE
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
            alert("Error occurred");
        }
    };

    // ============================
    // FILTER
    // ============================
    const filteredAddresses = addresses.filter((a) =>
        `${a.zipCode} ${a.houseNumber} ${a.extension}`.toLowerCase().includes(search.toLowerCase())
    );

    const filteredResellers = resellers.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    // =====================================================================
    // UI
    // =====================================================================

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4, width: "100%", background: "#F8FAFC" }}>

                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between" mb={4}>
                    <Typography variant="h4" fontWeight={700}>
                        Address & Reseller Management
                    </Typography>

                    {/* Dropdown Add New */}
                    <>
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
                    </>
                </Stack>

                {/* SEARCH */}
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
                    <Typography variant="h6" fontWeight={600} mb={2}>Address List</Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Zipcode</TableCell>
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
                                        <Button startIcon={<EditIcon />} onClick={() => openPopup("edit", "address", a)}>Edit</Button>
                                        <Button color="error" startIcon={<DeleteIcon />} onClick={() => openPopup("delete", "address", a)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* RESELLER TABLE */}
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Reseller List</Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Zipcode</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>House</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Extension</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredAddresses.map((a) => (
                                <TableRow key={a.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: "#f1f5f9" } }}>
                                    <TableCell>{a.zipCode}</TableCell>
                                    <TableCell>{a.houseNumber}</TableCell>
                                    <TableCell>{a.extension}</TableCell>

                                    <TableCell align="right">
                                        <Button
                                            startIcon={<EditIcon />}
                                            onClick={() =>
                                                navigate(`/address-reseller/edit/address/${a.id}`)
                                            }
                                            sx={{
                                                color: "#2563eb",
                                                textTransform: "none",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            startIcon={<DeleteIcon />}
                                            onClick={() =>
                                                navigate(`/address-reseller/delete/address/${a.id}`)
                                            }
                                            sx={{
                                                color: "#dc2626",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                ml: 1,
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* ------------------  RESELLER LIST  ------------------ */}
                <Card
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Reseller List
                    </Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredResellers.map((r) => (
                                <TableRow key={r.id} hover>
                                    <TableCell>{r.name}</TableCell>
                                    <TableCell>
                                        <Chip label={r.type} color={r.type === "Broker" ? "info" : "secondary"} />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Button startIcon={<EditIcon />} onClick={() => openPopup("edit", "reseller", r)}>Edit</Button>
                                        <Button color="error" startIcon={<DeleteIcon />} onClick={() => openPopup("delete", "reseller", r)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* POPUP */}
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
                                        <TextField margin="dense" label="Zipcode" fullWidth name="zipCode" value={current.zipCode || ""} onChange={handleChange} />
                                        <TextField margin="dense" label="House Number" fullWidth name="houseNumber" value={current.houseNumber || ""} onChange={handleChange} />
                                        <TextField margin="dense" label="Extension" fullWidth name="extension" value={current.extension || ""} onChange={handleChange} />
                                    </>
                                )}

                                {target === "reseller" && (
                                    <>
                                        <TextField margin="dense" label="Name" fullWidth name="name" value={current.name || ""} onChange={handleChange} />
                                        <TextField margin="dense" label="Type" fullWidth select name="type" value={current.type || ""} onChange={handleChange}>
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
                        <Button variant="contained" color={mode === "delete" ? "error" : "primary"} onClick={handleSubmit}>
                            {mode === "delete" ? "Delete" : "Save"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
}
