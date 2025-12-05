import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { deleteOrder, getOrderById } from "@/services/customerService/OrderService";
import { useState, useEffect } from "react";

export default function OrderDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getOrderById(Number(id)).then((res) => setOrder(res));
        }
    }, [id]);

    if (!order) return null;

    const handleDelete = async () => {
        await deleteOrder(Number(id));
        alert("Order deleted!");
        navigate("/orders");
    };

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

            <Paper sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
                <Typography variant="h5" fontWeight={600} mb={2}>
                    Delete Order
                </Typography>

                <Typography mb={3}>
                    Are you sure you want to delete order{" "}
                    <b>#{order.orderNumber}</b>?
                </Typography>

                <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>

                <Button
                    variant="outlined"
                    sx={{ ml: 2 }}
                    onClick={() => navigate("/orders")}
                >
                    Cancel
                </Button>
            </Paper>
        </Box>
    );
}
