
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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useNavigate } from "react-router-dom";
import { useAddressResellerList } from "@/hooks/addressReseller/useAddressResellerList";

export default function AddressResellerList() {
    const navigate = useNavigate();

    const {
        search,
        setSearch,
        filteredAddresses,
        filteredResellers
    } = useAddressResellerList();


    return (
        <Box sx={{ display: "flex" }}>
            {/* FIXED SIDEBAR */}
            <NavMenu />

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    marginLeft: "240px",
                    padding: "32px",
                    width: "100%",
                    background: "#F8FAFC",
                    minHeight: "100vh",
                }}
            >
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Address & Reseller Management
                        </Typography>
                        <Typography sx={{ color: "#64748b", mt: 1 }}>
                            Manage addresses and reseller partners in one place.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/address-reseller/create")}
                        sx={{
                            textTransform: "none",
                            px: 3,
                            borderRadius: 2,
                            fontWeight: 600,
                            boxShadow: "0 4px 14px rgba(59,130,246,0.25)",
                        }}
                    >
                        Add New
                    </Button>
                </Stack>

                {/* SEARCH BOX */}
                <Card
                    sx={{
                        p: 2,
                        mb: 4,
                        borderRadius: 3,
                        boxShadow: "0 6px 25px rgba(0,0,0,0.05)",
                    }}
                >
                    <TextField
                        placeholder="Search by zipcode or reseller name..."
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#94a3b8" }} />
                                </InputAdornment>
                            ),
                            sx: { bgcolor: "white", borderRadius: 2 },
                        }}
                    />
                </Card>

                {/* ADDRESS LIST */}
                <Card
                    sx={{
                        p: 3,
                        mb: 5,
                        borderRadius: 4,
                        boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Address List
                    </Typography>

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
                            {filteredResellers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: "#64748b" }}>
                                        No resellers available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResellers.map((r) => (
                                    <TableRow key={r.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: "#f1f5f9" } }}>
                                        <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={r.type}
                                                size="small"
                                                sx={{
                                                    px: 1.5,
                                                    fontWeight: 600,
                                                    bgcolor: r.type === "Broker" ? "#e0f2fe" : "#f3e8ff",
                                                    color: r.type === "Broker" ? "#0369a1" : "#7e22ce",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() =>
                                                    navigate(`/address-reseller/edit/reseller/${r.id}`)
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
                                                    navigate(`/address-reseller/delete/reseller/${r.id}`)
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </Box>
        </Box>
    );
}
