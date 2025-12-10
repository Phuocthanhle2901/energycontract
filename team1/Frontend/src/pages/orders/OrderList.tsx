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
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit" | "delete">("create");

    const emptyOrder = {
        id: null,
        orderNumber: "",
        orderType: 0,
        status: 0,
        startDate: "",
        endDate: "",
        topupFee: 0,
        contractId: "",
    };

    const [current, setCurrent] = useState<any>(emptyOrder);

    // ===========================
    // LOAD DATA
    // ===========================
    const loadData = async () => {
        const o = await OrderApi.getOrders(0);
        const c = await ContractApi.getContracts();

        setOrders(Array.isArray(o) ? o : []);
        setContracts(Array.isArray(c) ? c : []);
    };

    useEffect(() => {
        loadData();
    }, []);

    // ===========================
    // AUTO GENERATE ORDER NUMBER
    // ===========================
    const generateOrderNumber = () => {
        return "ORD-" + Math.floor(100000 + Math.random() * 900000);
    };

    // ===========================
    // OPEN POPUP
    // ===========================
    const openPopup = (m: "create" | "edit" | "delete", item: any = null) => {
        setMode(m);

        if (m === "create") {
            setCurrent({
                ...emptyOrder,
                orderNumber: generateOrderNumber(), // 🔥 TỰ ĐỘNG TẠO ORDER NUMBER
            });
        } else {
            setCurrent(item);
        }

        setOpen(true);
    };

    const closePopup = () => setOpen(false);

    // ===========================
    // HANDLE FORM FIELDS
    // ===========================
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        const numericFields = ["orderType", "status", "contractId", "topupFee"];

        setCurrent((prev: any) => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) : value,
        }));
    };

    // ===========================
    // SUBMIT CRUD
    // ===========================
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


    // ===========================
    // RENDER HELPERS
    // ===========================
    const mapType = (v: number) => (v === 0 ? "Gas" : "Electricity");
    const mapStatus = (v: number) =>
        ["Pending", "Active", "Completed", "Cancelled"][v] ?? "Unknown";

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h5" fontWeight={700}>
                    Orders
                </Typography>

                <Button variant="contained" onClick={() => openPopup("create")}>
                    + Add Order
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                <Table>
                    <TableHead sx={{ background: "#f0f2f5" }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Order Number</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Topup Fee</TableCell>
                            <TableCell>Contract</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orders.map((o: any) => (
                            <TableRow key={o.id} hover>
                                <TableCell>{o.id}</TableCell>
                                <TableCell>{o.orderNumber}</TableCell>
                                <TableCell>{mapType(o.orderType)}</TableCell>
                                <TableCell>{mapStatus(o.status)}</TableCell>
                                <TableCell>{o.startDate?.slice(0, 10)}</TableCell>
                                <TableCell>{o.endDate?.slice(0, 10)}</TableCell>
                                <TableCell>{o.topupFee}</TableCell>
                                <TableCell>{o.contractId}</TableCell>

                                <TableCell align="right">
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
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* POPUP CRUD */}
            <Dialog open={open} onClose={closePopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    {mode === "create" && "Create Order"}
                    {mode === "edit" && "Edit Order"}
                    {mode === "delete" && "Delete Order"}
                </DialogTitle>

                <DialogContent sx={{ mt: 1 }}>
                    {mode === "delete" ? (
                        <Typography>
                            Are you sure you want to delete this order?
                        </Typography>
                    ) : (
                        <Stack spacing={2}>
                            <TextField
                                label="Order Number"
                                name="orderNumber"
                                fullWidth
                                value={current.orderNumber}
                                disabled
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
    );
}
