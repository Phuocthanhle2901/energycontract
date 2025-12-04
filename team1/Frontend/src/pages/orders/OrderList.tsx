import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { getOrders } from "@/services/customerService/OrderService";

export default function OrderList() {
    const navigate = useNavigate();
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        getOrders().then((res) => setList(Array.isArray(res) ? res : []));
    }, []);

    const mapOrderType = (v: number) => (v === 0 ? "Gas" : "Electricity");
    const mapStatus = (v: number) =>
        ["Pending", "Active", "Completed", "Cancelled"][v] || "Unknown";

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Orders</Typography>
                <Button variant="contained" onClick={() => navigate("/orders/create")}>
                    + Add Order
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                <Table>
                    <TableHead sx={{ background: "#f5f7fa" }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Order Number</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Top-up Fee</TableCell>
                            <TableCell>Contract</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((o) => (
                            <TableRow key={o.id} hover>
                                <TableCell>{o.id}</TableCell>
                                <TableCell>{o.orderNumber}</TableCell>
                                <TableCell>{mapOrderType(o.orderType)}</TableCell>
                                <TableCell>{mapStatus(o.status)}</TableCell>
                                <TableCell>{o.startDate?.substring(0, 10)}</TableCell>
                                <TableCell>{o.endDate?.substring(0, 10)}</TableCell>
                                <TableCell>{o.topupFee}</TableCell>
                                <TableCell>{o.contractId}</TableCell>

                                <TableCell align="right">
                                    <Button size="small" onClick={() => navigate(`/orders/${o.id}/edit`)}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => navigate(`/orders/${o.id}/delete`)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {list.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">No orders found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
