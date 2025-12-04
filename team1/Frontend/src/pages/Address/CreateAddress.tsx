import { useState } from "react";
import { AddressApi } from "@/services/customerService/AddressService";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateAddress() {
    const nav = useNavigate();

    const [data, setData] = useState({
        zipCode: "",
        houseNumber: "",
        extension: "",
    });

    const handleCreate = async () => {
        await AddressApi.create(data);
        nav("/addresses");
    };

    return (
        <Box p={4}>
            <Typography variant="h4">Create Address</Typography>

            <TextField
                fullWidth
                label="Zip Code"
                sx={{ mt: 2 }}
                onChange={(e) => setData({ ...data, zipCode: e.target.value })}
            />

            <TextField
                fullWidth
                label="House Number"
                sx={{ mt: 2 }}
                onChange={(e) => setData({ ...data, houseNumber: e.target.value })}
            />

            <TextField
                fullWidth
                label="Extension"
                sx={{ mt: 2 }}
                onChange={(e) => setData({ ...data, extension: e.target.value })}
            />

            <Button variant="contained" sx={{ mt: 3 }} onClick={handleCreate}>
                Create
            </Button>
        </Box>
    );
}
