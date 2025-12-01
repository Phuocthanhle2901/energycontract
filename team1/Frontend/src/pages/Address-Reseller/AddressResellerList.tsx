import { useEffect, useState } from "react";
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

import NavMenu from "@/components/NavMenu/NavMenu";
import { AddressApi } from "../../api/address.api";
import { ResellerApi } from "../../api/reseller.api";
import { useNavigate } from "react-router-dom";

export default function AddressResellerList() {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<any[]>([]);
    const [resellers, setResellers] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        AddressApi.getAll().then((res) => {
            setAddresses(res.data ?? res); // GIẢM RỦI RO
        });

        ResellerApi.getAll().then((res) => {
            setResellers(res.data ?? res); // GIẢM RỦI RO
        });
    }, []);

    const filteredAddresses = addresses.filter(a =>
        a.zipCode?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredResellers = resellers.filter(r =>
        r.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, maxWidth: 1300, mx: "auto" }}>
            <NavMenu />

            {/* HEADER */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Address & Reseller Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
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
                        fontWeight: 600
                    }}
                >
                    Add New
                </Button>
            </Stack>

            {/* SEARCH */}
            <Card sx={{ p: 2, mb: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
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
                        sx: {
                            bgcolor: "white",
                            borderRadius: 2,
                        },
                    }}
                />
            </Card>

            {/* ADDRESS LIST */}
            <Card sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Address List
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Zipcode</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>House</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Extension</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
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
                                        onClick={() =>
                                            navigate(`/address-reseller/edit/address/${a.id}`)
                                        }
                                        sx={{ color: "#2563eb", fontWeight: 600, textTransform: "none" }}
                                    >
                                        EDIT
                                    </Button>

                                    <Button
                                        onClick={() =>
                                            navigate(`/address-reseller/delete/address/${a.id}`)
                                        }
                                        sx={{ color: "#dc2626", fontWeight: 600, textTransform: "none", ml: 2 }}
                                    >
                                        DELETE
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* RESELLER LIST */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Reseller List
                </Typography>

                <Card sx={{ borderRadius: 3, p: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredResellers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: "#6b7280" }}>
                                        No resellers available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResellers.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={r.type}
                                                size="small"
                                                sx={{
                                                    bgcolor: r.type === "Broker" ? "#e0f2fe" : "#f3e8ff",
                                                    color: r.type === "Broker" ? "#0369a1" : "#7e22ce"
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                onClick={() =>
                                                    navigate(`/address-reseller/edit/reseller/${r.id}`)
                                                }
                                                sx={{ color: "#2563eb", fontWeight: 600, textTransform: "none" }}
                                            >
                                                EDIT
                                            </Button>

                                            <Button
                                                onClick={() =>
                                                    navigate(`/address-reseller/delete/reseller/${r.id}`)
                                                }
                                                sx={{ color: "#dc2626", fontWeight: 600, textTransform: "none", ml: 2 }}
                                            >
                                                DELETE
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
