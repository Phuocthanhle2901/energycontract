import NavMenu from "@/components/NavMenu/NavMenu";
import { useDeleteOrder } from "@/hooks/useOrders";
import { Box, Button, Paper, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderDelete() {
    const { id } = useParams();
    const navigate = useNavigate();

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

    return (
        <Box sx={{ ml: "240px", p: 3 }}>
            <NavMenu />

            <Paper sx={{ p: 4, maxWidth: "600px" }}>
                <Typography variant="h5" mb={2}>
                    Delete Order
                </Typography>

                <Typography mb={3}>
                    Are you sure you want to delete order:
                    <b> {data?.order_number}</b> ?
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
function useOrderById(arg0: number): { data: any; isLoading: any; } {
    throw new Error("Function not implemented.");
}

