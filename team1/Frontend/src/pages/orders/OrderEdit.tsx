<<<<<<< HEAD
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Stack,
    Typography,
    Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";

import {
    getOrderById,
    updateOrder
} from "@/services/customerService/OrderService";

import { getContracts } from "@/services/customerService/ContractService";
=======
import {
    Box, Button, TextField, Typography, Paper, MenuItem
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderSchema } from "@/schemas/order.schema";

import { useOrder, useUpdateOrder } from "@/hooks/useOrders";
import toast from "react-hot-toast";
>>>>>>> intern2025-team1

export default function OrderEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

<<<<<<< HEAD
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

    // Load hợp đồng
    useEffect(() => {
        getContracts().then((res) => Array.isArray(res) && setContracts(res));
    }, []);

    // Load Order cần edit
    useEffect(() => {
        if (id) {
            getOrderById(Number(id)).then((res) => {
                setForm({
                    orderNumber: res.orderNumber || "",
                    orderType: res.orderType,
                    status: res.status,
                    startDate: res.startDate?.substring(0, 10),
                    endDate: res.endDate?.substring(0, 10),
                    topupFee: res.topupFee ?? 0,
                    contractId: res.contractId ?? 0,
                });
            });
        }
    }, [id]);

    // Handle change input
    const handleChange = (e: any) => {
        let { name, value } = e.target;

        if (["orderType", "status", "contractId", "topupFee"].includes(name)) {
            value = Number(value);
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // SAVE UPDATE
    const handleUpdate = async () => {
        try {
            const payload = {
                id: Number(id),
                orderNumber: form.orderNumber,
                orderType: form.orderType,
                status: form.status,
                startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
                endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
                topupFee: Number(form.topupFee),
            };

            await updateOrder(Number(id), payload);
            alert("Order updated!");
            navigate("/orders");

        } catch (err) {
            console.error("UPDATE ORDER ERROR:", err);
            alert("Failed to update order");
        }
    };
=======
    const { data, isLoading } = useOrder(Number(id));
    const updateOrder = useUpdateOrder(Number(id));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(orderSchema),
    });

    // Load dữ liệu ban đầu
    if (data && !isLoading) {
        reset(data);
    }

    const onSubmit = (formData: any) => {
        updateOrder.mutate(formData, {
            onSuccess: () => {
                toast.success("Order updated successfully!");
                navigate("/orders");
            },
            onError: () => toast.error("Update failed"),
        });
    };

    if (isLoading) return <Typography ml="260px">Loading…</Typography>;
>>>>>>> intern2025-team1

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

<<<<<<< HEAD
            <Paper sx={{ maxWidth: 600, p: 3, mx: "auto" }}>
                <Typography variant="h5" mb={3} fontWeight={600}>
                    Edit Order
                </Typography>

                <Stack spacing={2}>

                    <TextField
                        label="Order Number"
                        name="orderNumber"
                        fullWidth
                        value={form.orderNumber}
                        onChange={handleChange}
                    />

                    <TextField select fullWidth label="Order Type" name="orderType"
                        value={form.orderType} onChange={handleChange}>
=======
            <Paper sx={{ p: 4, maxWidth: "700px" }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Edit Order
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Order Number"
                        {...register("order_number")}
                        error={!!errors.order_number}
                        helperText={errors.order_number?.message}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        select
                        label="Order Type"
                        {...register("order_type")}
                    >
>>>>>>> intern2025-team1
                        <MenuItem value={0}>Gas</MenuItem>
                        <MenuItem value={1}>Electricity</MenuItem>
                    </TextField>

<<<<<<< HEAD
                    <TextField select fullWidth label="Status" name="status"
                        value={form.status} onChange={handleChange}>
=======
                    <TextField
                        fullWidth
                        margin="normal"
                        select
                        label="Status"
                        {...register("status")}
                    >
>>>>>>> intern2025-team1
                        <MenuItem value={0}>Pending</MenuItem>
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={2}>Completed</MenuItem>
                        <MenuItem value={3}>Cancelled</MenuItem>
                    </TextField>

<<<<<<< HEAD
                    {/* DATE */}
                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            name="endDate"
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
                        value={form.topupFee}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Contract"
                        name="contractId"
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
                        <Button variant="contained" onClick={handleUpdate}>
                            Save
                        </Button>

                        <Button variant="outlined" onClick={() => navigate("/orders")}>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Paper >
        </Box >
=======
                    <TextField
                        fullWidth
                        type="date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        label="Start Date"
                        {...register("start_date")}
                    />

                    <TextField
                        fullWidth
                        type="date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        label="End Date"
                        {...register("end_date")}
                    />

                    <TextField
                        fullWidth
                        type="number"
                        margin="normal"
                        label="Top-up Fee"
                        {...register("topup_fee")}
                    />

                    <TextField
                        fullWidth
                        type="number"
                        margin="normal"
                        label="Contract ID"
                        {...register("contractId")}
                    />

                    <Box mt={3} display="flex" gap={2}>
                        <Button variant="contained" type="submit">
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/orders")}>
                            Back
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
>>>>>>> intern2025-team1
    );
}
