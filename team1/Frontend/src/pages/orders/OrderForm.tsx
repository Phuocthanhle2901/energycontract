import { useEffect, useState } from "react";
import { Box, Button, TextField, MenuItem, Stack, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";

import {
    createOrder,
    updateOrder,
    getOrderById,
    deleteOrder
} from "@/services/customerService/OrderService";

import { getContracts } from "@/services/customerService/ContractService";

export default function OrderForm() {
    const { id, mode } = useParams();
    const navigate = useNavigate();

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

    useEffect(() => {
        getContracts().then((res) => Array.isArray(res) && setContracts(res));
    }, []);

    useEffect(() => {
        if (isEdit && id) {
            getOrderById(Number(id)).then((res) => {
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

    const handleChange = (e: any) => {
        let { name, value } = e.target;
        if (["orderType", "status", "contractId", "topupFee"].includes(name)) {
            value = Number(value);
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            startDate: new Date(form.startDate).toISOString(),
            endDate: new Date(form.endDate).toISOString(),
        };

        if (isEdit && id) {
            await updateOrder(Number(id), payload);
            alert("Order updated!");
        } else {
            await createOrder(payload);
            alert("Order created!");
        }
        navigate("/orders");
    };

    const handleDelete = async () => {
        await deleteOrder(Number(id));
        alert("Order deleted!");
        navigate("/orders");
    };

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

            <Paper sx={{ maxWidth: 600, p: 3, mx: "auto" }}>
                <Typography variant="h5" mb={3} fontWeight={600}>
                    {isDelete ? "Delete Order" : isEdit ? "Edit Order" : "Create Order"}
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Order Number"
                        name="orderNumber"
                        disabled={isDelete}
                        fullWidth
                        value={form.orderNumber}
                        onChange={handleChange}
                    />

                    <TextField select fullWidth label="Order Type" name="orderType" disabled={isDelete}
                        value={form.orderType} onChange={handleChange}>
                        <MenuItem value={0}>Gas</MenuItem>
                        <MenuItem value={1}>Electricity</MenuItem>
                    </TextField>

                    <TextField select fullWidth label="Status" name="status" disabled={isDelete}
                        value={form.status} onChange={handleChange}>
                        <MenuItem value={0}>Pending</MenuItem>
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={2}>Completed</MenuItem>
                        <MenuItem value={3}>Cancelled</MenuItem>
                    </TextField>

                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            name="startDate"
                            disabled={isDelete}
                            value={form.startDate}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            name="endDate"
                            disabled={isDelete}
                            value={form.endDate}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Stack>

                    <TextField
                        type="number"
                        fullWidth
                        label="Top-up Fee"
                        name="topupFee"
                        disabled={isDelete}
                        value={form.topupFee}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Contract"
                        name="contractId"
                        disabled={isDelete}
                        value={form.contractId}
                        onChange={handleChange}
                    >
                        {contracts.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.contractNumber} — {c.firstName} {c.lastName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction="row" spacing={2} mt={2}>
                        {!isDelete && (
                            <Button variant="contained" onClick={handleSubmit}>
                                {isEdit ? "Update" : "Create"}
                            </Button>
                        )}

                        {isDelete && (
                            <Button color="error" variant="contained" onClick={handleDelete}>
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
