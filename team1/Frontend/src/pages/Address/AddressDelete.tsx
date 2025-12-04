import { useEffect, useState } from "react";
import { AddressApi } from "@/services/customerService/AddressService";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function AddressDelete() {
    const { id } = useParams();
    const nav = useNavigate();

    const handleDelete = async () => {
        await AddressApi.delete(Number(id));
        nav("/addresses");
    };

    return (
        <Box p={4}>
            <Typography variant="h5">Delete Address ID {id}</Typography>

            <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleDelete}>
                Confirm Delete
            </Button>
        </Box>
    );
}
