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
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { ResellerApi } from "../../api/reseller.api";

const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.08)",
};

export default function ResellerList() {
    const [resellers, setResellers] = useState<any[]>([]);

    useEffect(() => {
        ResellerApi.getAll().then((res) => setResellers(res));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete reseller?")) return;
        await ResellerApi.delete(id);
        setResellers((prev) => prev.filter((x) => x.id !== id));
    };

    return (
        <Card sx={cardStyle}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                🏪 Reseller List
            </Typography>

            <Button
                variant="contained"
                href="/reseller/create"
                sx={{
                    mb: 2,
                    borderRadius: "12px",
                    background: "linear-gradient(90deg,#3550ff,#4f6bff)",
                }}
                startIcon={<AddIcon />}
            >
                Add Reseller
            </Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {resellers.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.type}</TableCell>
                            <TableCell align="right">
                                <IconButton color="primary" href={`/reseller/edit/${r.id}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(r.id)}>
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
