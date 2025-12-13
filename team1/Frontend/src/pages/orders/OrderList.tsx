import { useState } from "react";
import {
    Box, Button, Card, Typography, Table, TableHead, TableRow,
    TableCell, TableBody, Stack, TextField, InputAdornment, Chip,
    IconButton, Pagination, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useOrders } from "@/hooks/useOrders";
import { OrderType, OrderStatus } from "@/types/order";

export default function OrderList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    // Hook lấy danh sách Order
    const { data: pagedResult, isLoading } = useOrders({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        search: search || undefined,
    });

    const orders = pagedResult?.items || [];
    const totalPages = Math.ceil((pagedResult?.totalCount || 0) / PAGE_SIZE);

    const getStatusColor = (status: number) => {
        switch (status) {
            case OrderStatus.Active: return "success";
            case OrderStatus.Pending: return "warning";
            case OrderStatus.Completed: return "info";
            case OrderStatus.Cancelled: return "error";
            default: return "default";
        }
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case OrderStatus.Active: return "Active";
            case OrderStatus.Pending: return "Pending";
            case OrderStatus.Completed: return "Completed";
            case OrderStatus.Cancelled: return "Cancelled";
            default: return "Unknown";
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4, width: "100%", background: "#F8FAFC", minHeight: "100vh" }}>
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="#1e293b">
                            Order Management
                        </Typography>
                        <Typography variant="body2" color="#64748b" mt={1}>
                            Manage electricity and gas orders efficiently.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/orders/create")}
                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
                    >
                        Create Order
                    </Button>
                </Stack>

                {/* SEARCH & FILTER */}
                <Card sx={{ p: 2, mb: 3, borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by order number..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                </Card>

                {/* TABLE */}
                <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", overflow: "hidden" }}>
                    <Table>
                        <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>ORDER NO.</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>TYPE</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>STATUS</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>START DATE</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>END DATE</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#475569" }}>FEE</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: "#475569" }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3, color: "#64748b" }}>
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{order.orderNumber}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={order.orderType === OrderType.Electricity ? <FlashOnIcon fontSize="small" /> : <LocalGasStationIcon fontSize="small" />}
                                                label={order.orderType === OrderType.Electricity ? "Electricity" : "Gas"}
                                                size="small"
                                                variant="outlined"
                                                color={order.orderType === OrderType.Electricity ? "warning" : "info"}
                                                sx={{ fontWeight: 600, borderRadius: "6px" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusLabel(order.status)}
                                                size="small"
                                                color={getStatusColor(order.status) as any}
                                                sx={{ fontWeight: 600, borderRadius: "6px" }}
                                            />
                                        </TableCell>
                                        <TableCell>{order.startDate?.split("T")[0]}</TableCell>
                                        <TableCell>{order.endDate?.split("T")[0]}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            {order.topupFee?.toLocaleString()} €
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => navigate(`/orders/edit/${order.id}`)}
                                                    sx={{ bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => navigate(`/orders/delete/${order.id}`)}
                                                    sx={{ bgcolor: "#fef2f2", "&:hover": { bgcolor: "#fee2e2" } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* PAGINATION */}
                    <Box sx={{ p: 2, display: "flex", justifyContent: "center", borderTop: "1px solid #e2e8f0" }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, p) => setPage(p)}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}