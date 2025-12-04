import { useEffect, useState } from "react";
import { AddressApi } from "@/services/customerService/AddressService";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AddressList() {
    const nav = useNavigate();
    const [list, setList] = useState([]);

    useEffect(() => {
        AddressApi.getAll().then(setList);
    }, []);

    return (
        <Box p={4}>
            <Typography variant="h4" mb={2}>Address List</Typography>

            <Button variant="contained" onClick={() => nav("/addresses/create")}>
                Create Address
            </Button>

            <Box mt={3}>
                {list.map((a: any) => (
                    <Box
                        key={a.id}
                        p={2}
                        mb={2}
                        border="1px solid #ddd"
                        borderRadius={2}
                    >
                        <Typography>ID: {a.id}</Typography>
                        <Typography>Zip: {a.zipCode}</Typography>

                        <Button
                            variant="outlined"
                            onClick={() => nav(`/addresses/${a.id}/edit`)}
                            sx={{ mr: 1, mt: 1 }}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => nav(`/addresses/${a.id}/delete`)}
                            sx={{ mt: 1 }}
                        >
                            Delete
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
