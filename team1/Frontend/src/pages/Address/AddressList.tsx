import { useEffect, useState } from "react";
import {
    Card,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { AddressApi } from "../../api/address.api";

const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.08)",
};

export default function AddressList() {
    const [addresses, setAddresses] = useState<any[]>([]);

    useEffect(() => {
        AddressApi.getAll().then((res) => setAddresses(res));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this address?")) return;
        await AddressApi.delete(id);
        setAddresses((prev) => prev.filter((x) => x.id !== id));
    };

    return (
        <Card sx={cardStyle}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                📍 Address List
            </Typography>

            <Button
                variant="contained"
                href="/address/create"
                sx={{
                    mb: 2,
                    borderRadius: "12px",
                    background: "linear-gradient(90deg,#3550ff,#4f6bff)",
                }}
                startIcon={<AddIcon />}
            >
                Add Address
            </Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Zip Code</TableCell>
                        <TableCell>House Number</TableCell>
                        <TableCell>Extension</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {addresses.map((a) => (
                        <TableRow key={a.id}>
                            <TableCell>{a.zipCode}</TableCell>
                            <TableCell>{a.houseNumber}</TableCell>
                            <TableCell>{a.extension}</TableCell>
                            <TableCell align="right">
                                <IconButton color="error" onClick={() => handleDelete(a.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
