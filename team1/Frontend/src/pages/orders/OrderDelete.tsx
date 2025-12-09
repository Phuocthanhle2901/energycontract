<<<<<<< HEAD
import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { deleteOrder, getOrderById } from "@/services/customerService/OrderService";
import { useState, useEffect } from "react";
=======
import NavMenu from "@/components/NavMenu/NavMenu";
import { useDeleteOrder } from "@/hooks/useOrders";
import { Box, Button, Paper, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
>>>>>>> intern2025-team1

export default function OrderDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
<<<<<<< HEAD
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

=======

    // GET data
    const { data, isLoading } = useOrderById(Number(id));

    // DELETE hook (không truyền id ở đây!)
    const deleteOrder = useDeleteOrder();

    const handleDelete = () => {
        deleteOrder.mutate(Number(id), {
            onSuccess: () => {
                toast.success("Order deleted!");
                navigate("/orders");
            },
            onError: () => toast.error("Delete failed"),
        });
    };

    if (isLoading) return <Typography>Loading...</Typography>;

>>>>>>> intern2025-team1
    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

<<<<<<< HEAD
            <Paper sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
                <Typography variant="h5" fontWeight={600} mb={2}>
=======
            <Paper sx={{ p: 4, maxWidth: "600px" }}>
                <Typography variant="h5" mb={2}>
>>>>>>> intern2025-team1
                    Delete Order
                </Typography>

                <Typography mb={3}>
<<<<<<< HEAD
                    Are you sure you want to delete order{" "}
                    <b>#{order.orderNumber}</b>?
=======
                    Are you sure you want to delete order:
                    <b> {data?.order_number}</b> ?
>>>>>>> intern2025-team1
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
<<<<<<< HEAD
=======
function useOrderById(arg0: number): { data: any; isLoading: any; } {
    throw new Error("Function not implemented.");
}

>>>>>>> intern2025-team1
