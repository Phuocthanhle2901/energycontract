<<<<<<< HEAD
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

=======
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import NavMenu from "@/components/NavMenu/NavMenu";

import { OrderApi } from "@/api/order.api";
import { ContractApi } from "@/api/contract.api";

export default function OrderList() {

    const [orders, setOrders] = useState<any[]>([]);
    const [contracts, setContracts] = useState<any[]>([]);

    // popup
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(""); // create | edit | delete
    const [current, setCurrent] = useState<any>({});

    // ===============================
    // FETCH DATA
    // ===============================
    const loadData = async () => {
        setOrders(await OrderApi.getOrders(0));

        setContracts(await ContractApi.getContracts());
    };

    useEffect(() => {
        loadData();
    }, []);

    // ===============================
    // OPEN POPUP
    // ===============================
    const openPopup = (m: string, item: any = null) => {
        setMode(m);

        if (m === "create") {
            setCurrent({
                orderNumber: "",
                orderType: 0,
                status: 0,
                startDate: "",
                endDate: "",
                topupFee: 0,
                contractId: "",
            });
        } else {
            setCurrent(item);
        }

        setOpen(true);
    };

    const closePopup = () => setOpen(false);

    // ===============================
    // HANDLE FORM
    // ===============================
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        // convert numeric fields
        const numeric = ["orderType", "status", "contractId", "topupFee"];

        setCurrent((prev: any) => ({
            ...prev,
            [name]: numeric.includes(name) ? Number(value) : value,
        }));
    };

    // ===============================
    // SUBMIT CRUD
    // ===============================
    const handleSubmit = async () => {
        try {
            if (mode === "create") await OrderApi.create(current);
            if (mode === "edit") await OrderApi.update(current.id, current);
            if (mode === "delete") await OrderApi.delete(current.id);

            closePopup();
            loadData();
        } catch (err) {
            console.error(err);
            alert("Error!");
        }
    };

    // ===============================
    // RENDER
    // ===============================
    const mapType = (v: number) => (v === 0 ? "Gas" : "Electricity");
    const mapStatus = (v: number) =>
        ["Pending", "Active", "Completed", "Cancelled"][v] ?? "Unknown";

>>>>>>> intern2025-team1
    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

<<<<<<< HEAD
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Orders</Typography>
                <Button variant="contained" onClick={() => navigate("/orders/create")}>
=======
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h5" fontWeight={700}>Orders</Typography>

                <Button variant="contained" onClick={() => openPopup("create")}>
>>>>>>> intern2025-team1
                    + Add Order
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                <Table>
<<<<<<< HEAD
                    <TableHead sx={{ background: "#f5f7fa" }}>
=======
                    <TableHead sx={{ background: "#f0f2f5" }}>
>>>>>>> intern2025-team1
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Order Number</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
<<<<<<< HEAD
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Top-up Fee</TableCell>
=======
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Topup Fee</TableCell>
>>>>>>> intern2025-team1
                            <TableCell>Contract</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
<<<<<<< HEAD
                        {list.map((o) => (
                            <TableRow key={o.id} hover>
                                <TableCell>{o.id}</TableCell>
                                <TableCell>{o.orderNumber}</TableCell>
                                <TableCell>{mapOrderType(o.orderType)}</TableCell>
                                <TableCell>{mapStatus(o.status)}</TableCell>
                                <TableCell>{o.startDate?.substring(0, 10)}</TableCell>
                                <TableCell>{o.endDate?.substring(0, 10)}</TableCell>
=======
                        {orders.map((o: any) => (
                            <TableRow key={o.id} hover>
                                <TableCell>{o.id}</TableCell>
                                <TableCell>{o.orderNumber}</TableCell>
                                <TableCell>{mapType(o.orderType)}</TableCell>
                                <TableCell>{mapStatus(o.status)}</TableCell>
                                <TableCell>{o.startDate?.slice(0, 10)}</TableCell>
                                <TableCell>{o.endDate?.slice(0, 10)}</TableCell>
>>>>>>> intern2025-team1
                                <TableCell>{o.topupFee}</TableCell>
                                <TableCell>{o.contractId}</TableCell>

                                <TableCell align="right">
<<<<<<< HEAD
                                    <Button size="small" onClick={() => navigate(`/orders/${o.id}/edit`)
                                    }>Edit</Button>
                                    <Button size="small" color="error" onClick={() => navigate(`/orders/${o.id}/delete`)
                                    }>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {list.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">No orders found</TableCell>
=======
                                    <Button size="small" onClick={() => openPopup("edit", o)}>
                                        Edit
                                    </Button>

                                    <Button
                                        size="small"
                                        color="error"
                                        sx={{ ml: 1 }}
                                        onClick={() => openPopup("delete", o)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    No orders found
                                </TableCell>
>>>>>>> intern2025-team1
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
<<<<<<< HEAD
            </Paper >
        </Box >
=======
            </Paper>

            {/* =============================== */}
            {/* POPUP CRUD */}
            {/* =============================== */}
            <Dialog open={open} onClose={closePopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    {mode === "create" && "Create Order"}
                    {mode === "edit" && "Edit Order"}
                    {mode === "delete" && "Delete Order"}
                </DialogTitle>

                <DialogContent sx={{ mt: 1 }}>
                    {mode === "delete" ? (
                        <Typography>Are you sure you want to delete this order?</Typography>
                    ) : (
                        <Stack spacing={2}>
                            <TextField
                                label="Order Number"
                                name="orderNumber"
                                fullWidth
                                value={current.orderNumber}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Order Type"
                                select
                                name="orderType"
                                value={current.orderType}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Gas</MenuItem>
                                <MenuItem value={1}>Electricity</MenuItem>
                            </TextField>

                            <TextField
                                label="Status"
                                select
                                name="status"
                                value={current.status}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Pending</MenuItem>
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={2}>Completed</MenuItem>
                                <MenuItem value={3}>Cancelled</MenuItem>
                            </TextField>

                            <TextField
                                type="date"
                                label="Start Date"
                                name="startDate"
                                InputLabelProps={{ shrink: true }}
                                value={current.startDate?.slice(0, 10) || ""}
                                onChange={handleChange}
                            />

                            <TextField
                                type="date"
                                label="End Date"
                                name="endDate"
                                InputLabelProps={{ shrink: true }}
                                value={current.endDate?.slice(0, 10) || ""}
                                onChange={handleChange}
                            />

                            <TextField
                                type="number"
                                label="Top-up Fee"
                                name="topupFee"
                                value={current.topupFee}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Contract"
                                select
                                name="contractId"
                                value={current.contractId}
                                onChange={handleChange}
                            >
                                {contracts.map((c: any) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.contractNumber} – {c.firstName} {c.lastName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
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
>>>>>>> intern2025-team1
    );
}
