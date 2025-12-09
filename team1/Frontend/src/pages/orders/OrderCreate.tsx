import { useEffect, useState } from "react";
import {
    Box, Button, TextField, MenuItem, Stack, Typography, Paper
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";

<<<<<<< HEAD
import {
    createOrder,
    updateOrder,
    getOrderById,
    deleteOrder
} from "@/services/customerService/OrderService";

import { getContracts } from "@/services/customerService/ContractService";

export default function OrderForm() {

    // ✅ LẤY ĐÚNG PARAMS (QUAN TRỌNG NHẤT!)
=======
// 🔥 IMPORT API MỚI
import { OrderApi } from "@/api/order.api";
import { ContractApi } from "@/api/contract.api";

export default function OrderForm() {

>>>>>>> intern2025-team1
    const { id, mode } = useParams();
    const navigate = useNavigate();

    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isDelete = mode === "delete";

    const [contracts, setContracts] = useState<any[]>([]);

    const [form, setForm] = useState({
        orderNumber: "",
        orderType: 0,
        status: 0,
        startDate: "",
        endDate: "",
        topupFee: 0,
        contractId: 0,
    });

<<<<<<< HEAD
    // Load list contract
    useEffect(() => {
        getContracts().then((res) => Array.isArray(res) && setContracts(res));
    }, []);

    // Load data khi EDIT
    useEffect(() => {
        if (isEdit && id) {
            getOrderById(Number(id)).then((res) => {
=======
    // 🔥 Load contracts bằng API mới
    useEffect(() => {
        ContractApi.getContracts().then((res) => {
            if (Array.isArray(res)) setContracts(res);
        });
    }, []);

    // 🔥 Load order khi EDIT
    useEffect(() => {
        if (isEdit && id) {
            OrderApi.getById(Number(id)).then((res) => {
>>>>>>> intern2025-team1
                setForm({
                    orderNumber: res.orderNumber || "",
                    orderType: res.orderType ?? 0,
                    status: res.status ?? 0,
                    startDate: res.startDate?.substring(0, 10) || "",
                    endDate: res.endDate?.substring(0, 10) || "",
                    topupFee: res.topupFee ?? 0,
                    contractId: res.contractId ?? 0,
                });
            });
        }
    }, [id, isEdit]);

<<<<<<< HEAD
    // Handle input change
=======
    // 🔥 Handle change
>>>>>>> intern2025-team1
    const handleChange = (e: any) => {
        let { name, value } = e.target;

        if (["orderType", "status", "contractId", "topupFee"].includes(name)) {
            value = Number(value);
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

<<<<<<< HEAD
    // ==========================
    // CREATE + UPDATE
    // ==========================
=======
    // 🔥 CREATE + UPDATE
>>>>>>> intern2025-team1
    const handleSubmit = async () => {
        try {
            const payload = {
                orderNumber: form.orderNumber,
                orderType: form.orderType,
                status: form.status,
                startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
                endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
                topupFee: Number(form.topupFee),
                contractId: Number(form.contractId),
            };

            if (isEdit) {
<<<<<<< HEAD
                await updateOrder(Number(id), {
                    id: Number(id),
                    ...payload,
                });
                alert("Order updated!");
            } else {
                await createOrder(payload);
=======
                await OrderApi.update(Number(id), payload);
                alert("Order updated!");
            } else {
                await OrderApi.create(payload);
>>>>>>> intern2025-team1
                alert("Order created!");
            }

            navigate("/orders");

        } catch (err) {
            console.error("ORDER ERROR:", err);
            alert("Failed to save order");
        }
    };

<<<<<<< HEAD
    // DELETE
    const handleDelete = async () => {
        try {
            await deleteOrder(Number(id));
=======
    // 🔥 DELETE
    const handleDelete = async () => {
        try {
            await OrderApi.delete(Number(id));
>>>>>>> intern2025-team1
            alert("Order deleted!");
            navigate("/orders");
        } catch (err) {
            console.error(err);
            alert("Delete failed!");
        }
    };

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

            <Paper sx={{ maxWidth: 600, p: 3, mx: "auto" }}>
<<<<<<< HEAD

                {/* ===== TITLE ===== */}
=======
>>>>>>> intern2025-team1
                <Typography variant="h5" mb={3} fontWeight={600}>
                    {isDelete ? "Delete Order" : isEdit ? "Edit Order" : "Create Order"}
                </Typography>

<<<<<<< HEAD
                {/* ===== FORM ===== */}
=======
>>>>>>> intern2025-team1
                <Stack spacing={2}>
                    <TextField
                        label="Order Number"
                        name="orderNumber"
                        fullWidth
                        disabled={isDelete}
                        value={form.orderNumber}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Order Type"
                        name="orderType"
                        fullWidth
                        disabled={isDelete}
                        select
                        value={form.orderType}
                        onChange={handleChange}
                    >
                        <MenuItem value={0}>Gas</MenuItem>
                        <MenuItem value={1}>Electricity</MenuItem>
                    </TextField>

                    <TextField
                        label="Status"
                        name="status"
                        fullWidth
                        disabled={isDelete}
                        select
                        value={form.status}
                        onChange={handleChange}
                    >
                        <MenuItem value={0}>Pending</MenuItem>
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={2}>Completed</MenuItem>
                        <MenuItem value={3}>Cancelled</MenuItem>
                    </TextField>

                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="date"
                            label="Start Date"
                            name="startDate"
                            fullWidth
                            disabled={isDelete}
                            InputLabelProps={{ shrink: true }}
                            value={form.startDate}
                            onChange={handleChange}
                        />

                        <TextField
                            type="date"
                            label="End Date"
                            name="endDate"
                            fullWidth
                            disabled={isDelete}
                            InputLabelProps={{ shrink: true }}
                            value={form.endDate}
                            onChange={handleChange}
                        />
                    </Stack>

                    <TextField
                        type="number"
                        label="Top-up Fee"
                        name="topupFee"
                        fullWidth
                        disabled={isDelete}
                        value={form.topupFee}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Contract"
                        name="contractId"
                        fullWidth
                        disabled={isDelete}
                        select
                        value={form.contractId}
                        onChange={handleChange}
                    >
                        {contracts.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.contractNumber} — {c.firstName} {c.lastName}
                            </MenuItem>
                        ))}
                    </TextField>

<<<<<<< HEAD
                    {/* ===== ACTION BUTTONS ===== */}
=======
>>>>>>> intern2025-team1
                    <Stack direction="row" spacing={2} mt={2}>
                        {!isDelete && (
                            <Button variant="contained" onClick={handleSubmit}>
                                {isEdit ? "Update" : "Create"}
                            </Button>
                        )}

                        {isDelete && (
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}

                        <Button variant="outlined" onClick={() => navigate("/orders")}>
                            Back
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
