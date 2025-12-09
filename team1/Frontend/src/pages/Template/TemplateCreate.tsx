<<<<<<< HEAD
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
=======
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { templateSchema } from "@/schemas/template.schema";
import { TemplateApi } from "@/api/template.api";
import {
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
    FormControlLabel,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";

type TemplateFormValues = {
    name: string;
    description: string;
    htmlContent: string;
    isActive: boolean;
};

const DEFAULT_HTML_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Service Contract</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        color: #333;
      }
      h1 {
        text-align: center;
        border-bottom: 3px solid #2c3e50;
        padding-bottom: 20px;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }
      .section-title {
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 6px;
      }
      .muted {
        color: #6b7280;
        font-size: 12px;
        text-align: center;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <h1>SERVICE CONTRACT</h1>

    <p class="section-title">Contract Number: {ContractNumber}</p>

    <p class="section-title">Client</p>
    <p>Full name: {FullName}</p>
    <p>Email: {Email}</p>
    <p>Phone: {Phone}</p>

    <p class="section-title">Period</p>
    <p>{StartDate} - {EndDate}</p>

    <p class="section-title">Total Amount</p>
    <p>{Currency} {TotalAmount}</p>

    <p class="muted">Generated: {GeneratedDate}</p>
  </body>
</html>`.trim();

export default function TemplateCreate() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TemplateFormValues>({
        resolver: yupResolver(templateSchema),
        defaultValues: {
            name: "",
            description: "",
            htmlContent: DEFAULT_HTML_TEMPLATE,
            isActive: true,
        },
    });

    const htmlContent = watch("htmlContent");

    const onSubmit = async (values: TemplateFormValues) => {
        try {
            await TemplateApi.create(values);
            toast.success("Template created successfully");
            navigate("/templates");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create template");
        }
>>>>>>> intern2025-team1
    };

    return (
        <>
            <NavMenu />
<<<<<<< HEAD
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
=======
            <Box
                sx={{
                    ml: { xs: 0, md: "260px" },
                    p: 3,
                    bgcolor: "#f5f7fa",
                    minHeight: "100vh",
                }}
            >
                {/* HEADER */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    sx={{ mb: 3, gap: 1.5 }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Create PDF Template
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ maxWidth: 720 }}
                        >
                            Define the HTML layout of your contract. The preview on the right
                            will update in real-time as you edit the template code.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => navigate("/templates")}
                            disabled={isSubmitting}
                        >
                            Back to list
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save template"}
                        </Button>
                    </Stack>
                </Stack>

                {/* MAIN CONTENT */}
                <Grid container spacing={3}>
                    {/* LEFT: FORM + CODE */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={600}>
                                Template settings
                            </Typography>

                            <TextField
                                label="Template name"
                                size="small"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message?.toString()}
                                fullWidth
                            />

                            <TextField
                                label="Description"
                                size="small"
                                {...register("description")}
                                error={!!errors.description}
                                helperText={errors.description?.message?.toString()}
                                fullWidth
                            />

                            <FormControlLabel
                                control={<Switch defaultChecked {...register("isActive")} />}
                                label="Active"
                            />

                            <Typography variant="subtitle2" fontWeight={600}>
                                HTML Template (code)
                            </Typography>

                            <TextField
                                {...register("htmlContent")}
                                error={!!errors.htmlContent}
                                helperText={errors.htmlContent?.message?.toString()}
                                multiline
                                minRows={18}
                                maxRows={26}
                                placeholder="Write your HTML template here..."
                                fullWidth
                                InputProps={{
                                    sx: {
                                        fontFamily:
                                            'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
                                        fontSize: 13,
                                        whiteSpace: "pre",
                                    },
                                }}
                            />
                        </Paper>
                    </Grid>

                    {/* RIGHT: PREVIEW */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600}>
                                Preview
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                This shows how the template will roughly look when rendered as a
                                PDF. Real styling and data binding are handled in the PdfService
                                backend.
                            </Typography>

                            <Box
                                sx={{
                                    mt: 1,
                                    flex: 1,
                                    minHeight: 420,
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    bgcolor: "white",
                                }}
                            >
                                <iframe
                                    title="Template preview"
                                    style={{
                                        border: "none",
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "white",
                                    }}
                                    srcDoc={
                                        htmlContent && htmlContent.trim().length > 0
                                            ? htmlContent
                                            : "<p style='font-family:system-ui;padding:16px;'>No HTML content yet. Start typing in the editor.</p>"
                                    }
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
>>>>>>> intern2025-team1
            </Box>
        </>
    );
}
