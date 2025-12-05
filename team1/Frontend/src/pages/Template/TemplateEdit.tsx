import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { templateService } from "../../services/pdfService/TemplateService";

export default function TemplateEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        if (id) {
            templateService.getById(Number(id)).then(setForm);
        }
    }, [id]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        await templateService.update(Number(id), form);
        navigate("/templates");
    };

    if (!form) return null;

    return (
        <>
            <NavMenu />
            <Box sx={{ p: 4, ml: "240px" }}>
                <Typography variant="h4" fontWeight={700} mb={3}>
                    Edit Template
                </Typography>

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

                <Button variant="contained" onClick={handleUpdate}>
                    Update
                </Button>
            </Box>
        </>
    );
}
