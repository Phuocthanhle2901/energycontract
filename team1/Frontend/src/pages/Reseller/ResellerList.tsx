import { useEffect, useState } from "react";
import {
    Card,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Button,
    Chip,
    Box,
    Stack,
    TextField,
    InputAdornment,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import NavMenu from "@/components/NavMenu/NavMenu";
import { ResellerApi } from "../../api/reseller.api";

export default function ResellerList() {
    const [resellers, setResellers] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        ResellerApi.getAll().then((res) => {
            setResellers(res || []);
        });
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete reseller?")) return;
        await ResellerApi.delete(id);
        setResellers((prev) => prev.filter((x) => x.id !== id));
    };

    const filtered = resellers.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
            {/* NAV MENU */}
            <NavMenu />

            {/* HEADER */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={4}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: "Georgia, serif", fontWeight: 700 }}>
                        Reseller Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
                        Manage your energy brokers and agency partners.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                    <TextField
                        placeholder="Search resellers..."
                        size="small"
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

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        href="/resellers/create"
                    >
                        Add New Reseller
                    </Button>
                </Stack>
            </Stack>

            {/* TABLE */}
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>NAME</TableCell>
                            <TableCell>TYPE</TableCell>
                            <TableCell>EMAIL</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell align="right">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filtered.map((r) => (
                            <TableRow key={r.id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>

                                <TableCell>
                                    <Chip
                                        label={r.type}
                                        size="small"
                                        sx={{
                                            bgcolor: r.type === "Broker" ? "#e0f2fe" : "#f3e8ff",
                                            color: r.type === "Broker" ? "#0369a1" : "#7e22ce",
                                            fontWeight: 600,
                                        }}
                                    />
                                </TableCell>

                                <TableCell sx={{ color: "#475569" }}>{r.email}</TableCell>


                                <TableCell>
                                    <Chip
                                        label="Active"
                                        size="small"
                                        sx={{
                                            bgcolor: "#f0fdf4",
                                            color: "#15803d",
                                            fontWeight: 600,
                                        }}
                                    />
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton href={`/resellers/edit/${r.id}`}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(r.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Box>
    );
}
