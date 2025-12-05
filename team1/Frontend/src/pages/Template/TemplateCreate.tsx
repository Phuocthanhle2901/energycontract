import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { templateService } from "../../services/pdfService/TemplateService";

export default function TemplateCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        description: "",
        htmlContent: "",
        isActive: true,
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        await templateService.create(form);
        navigate("/templates");
    };

    return (
        <>
            <NavMenu />
            <Box sx={{ p: 4, ml: "240px" }}>
                <Typography variant="h4" fontWeight={700} mb={3}>
                    Create Template
                </Typography>

                <TextField
                    name="name"
                    label="Template Name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    name="description"
                    label="Description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    name="htmlContent"
                    label="HTML Content"
                    value={form.htmlContent}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={8}
                    sx={{ mb: 2 }}
                />

                <Button variant="contained" onClick={handleCreate}>
                    Save
                </Button>
            </Box>
        </>
    );
}
