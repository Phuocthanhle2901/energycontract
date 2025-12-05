import { useEffect, useState } from "react";
import { Box, Button, Typography, Table, TableRow, TableCell, TableHead, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { templateService } from "../../services/pdfService/TemplateService";

export default function TemplateList() {
    const [list, setList] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        templateService.getAll().then(setList);
    }, []);

    return (
        <>
            <NavMenu />
            <Box sx={{ p: 4, ml: "240px" }}>
                <Typography variant="h4" fontWeight={700} mb={3}>
                    PDF Templates
                </Typography>

                <Button variant="contained" onClick={() => navigate("/templates/create")} sx={{ mb: 2 }}>
                    Create New Template
                </Button>

                <Table sx={{ background: "#fff", borderRadius: "10px" }}>
                    <TableHead>
                        <TableRow sx={{ background: "#f8fafc" }}>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {list.map((t) => (
                            <TableRow key={t.id} hover>
                                <TableCell>{t.name}</TableCell>
                                <TableCell>{t.description}</TableCell>
                                <TableCell>{t.isActive ? "Active" : "Inactive"}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => navigate(`/templates/${t.id}/edit`)} sx={{ mr: 1 }}>
                                        Edit
                                    </Button>
                                    <Button color="error" onClick={() => navigate(`/templates/${t.id}/delete`)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}
