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

export default function OrderEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

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

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

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
                        <MenuItem value={0}>Gas</MenuItem>
                        <MenuItem value={1}>Electricity</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        margin="normal"
                        select
                        label="Status"
                        {...register("status")}
                    >
                        <MenuItem value={0}>Pending</MenuItem>
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={2}>Completed</MenuItem>
                        <MenuItem value={3}>Cancelled</MenuItem>
                    </TextField>

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
    );
}