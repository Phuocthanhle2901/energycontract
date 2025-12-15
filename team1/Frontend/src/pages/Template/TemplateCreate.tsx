// src/pages/Template/TemplateCreate.tsx
import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useCreateTemplate } from "@/hooks/usePdf";
import NavMenu from "@/components/NavMenu/NavMenu";
import { templateSchema } from "@/schemas/template.schema";

import {
    Box,
    Button,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
    FormControlLabel,
    CircularProgress,
    FormHelperText,
    useTheme,
} from "@mui/material";

import Grid from "@mui/material/Grid"; // ✅ Grid2 mới có prop `size`
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

type TemplateCreateFormValues = {
    name: string;
    description: string;
    htmlContent: string;
    isActive: boolean;
};

// Toolbar config
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        ["clean"],
    ],
};

// Default HTML template
const CONTRACT_TEMPLATE_HTML = `
  <h1 style="text-align: center;">HỢP ĐỒNG CUNG CẤP NĂNG LƯỢNG</h1>
  <h2 style="text-align: center; color: #6b7280;">(Gas / Điện năng · Energy Contract Manager)</h2>

  <h3>1. Thông tin Hợp đồng</h3>
  <p><strong>Mã hợp đồng:</strong> {{ContractNumber}}</p>
  <p><strong>Thời hạn:</strong> {{StartDate}} - {{EndDate}}</p>
  <hr />

  <h3>2. Thông tin Khách hàng</h3>
  <p><strong>Khách hàng:</strong> {{FullName}}</p>
  <p><strong>Email:</strong> {{Email}}</p>
  <p><strong>Công ty:</strong> {{CompanyName}}</p>
  <hr />

  <h3>3. Nội dung chi tiết</h3>
  <p>Bên A đồng ý cung cấp năng lượng cho Bên B theo các điều khoản đính kèm...</p>

  <p style="margin-top: 50px;"><strong>Đại diện Bên B</strong></p>
  <p>{{FullName}}</p>
`;

export default function TemplateCreate() {
    const navigate = useNavigate();
    const createMutation = useCreateTemplate();

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // ===== THEME TOKENS (NO HARDCODE) =====
    const pageBg = "background.default";
    const cardBg = "background.paper";
    const borderColor = alpha(theme.palette.divider, 0.8);
    const paperShadow = isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)";

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<TemplateCreateFormValues>({
        resolver: yupResolver(templateSchema),
        defaultValues: {
            name: "",
            description: "Default contract template",
            htmlContent: CONTRACT_TEMPLATE_HTML,
            isActive: true,
        },
    });

    const htmlContent = watch("htmlContent");

    // Preview HTML (keep paper-white inside iframe)
    const previewHtml = useMemo(() => {
        const content =
            htmlContent && htmlContent.trim().length > 0
                ? htmlContent
                : "<p style='font-family:system-ui;padding:16px;color:#888'>No HTML content yet. Start typing in the editor.</p>";

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          h1 { font-size: 18pt; margin-bottom: 10px; }
          h2 { font-size: 14pt; margin-bottom: 8px; }
          h3 { font-size: 12pt; margin-bottom: 6px; }
          p { margin-bottom: 8px; }
          img { max-width: 100%; height: auto; }
          table { width: 100%; border-collapse: collapse; font-size: 9pt; }
          th, td { border: 1px solid #ddd; padding: 4px 8px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
    }, [htmlContent]);

    const onSubmit = (values: TemplateCreateFormValues) => {
        createMutation.mutate(
            {
                ...values,
                htmlContent: values.htmlContent,
            },
            {
                onSuccess: () => navigate("/templates"),
            }
        );
    };

    const isSubmitting = createMutation.isPending;

    // Optional: prevent Quill toolbar icons from flashing wrong colors on first render
    useEffect(() => { }, [isDark]);

    return (
        <>
            <NavMenu />

            <Box
                sx={{
                    ml: { xs: 0, md: "260px" },
                    p: 3,
                    bgcolor: pageBg,
                    color: "text.primary",
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
                        <Typography variant="h5" fontWeight={800}>
                            Create PDF Template
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                            Design your contract template using the editor below.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => navigate("/templates")} disabled={isSubmitting}>
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSubmitting ? "Creating..." : "Create template"}
                        </Button>
                    </Stack>
                </Stack>

                {/* BODY */}
                <Grid container spacing={3}>
                    {/* LEFT */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                bgcolor: cardBg,
                                border: `1px solid ${borderColor}`,
                                boxShadow: paperShadow,
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={700}>
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

                            <FormControlLabel control={<Switch defaultChecked {...register("isActive")} />} label="Active" />

                            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 1 }}>
                                Content Editor
                            </Typography>

                            {/* QUILL */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: 0,

                                    "& .quill": {
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        overflow: "hidden",
                                    },

                                    "& .ql-toolbar": {
                                        flexShrink: 0,
                                        backgroundColor: cardBg,
                                        borderColor: borderColor,
                                    },

                                    "& .ql-container": {
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        overflow: "hidden",
                                        borderColor: borderColor,
                                        borderBottomLeftRadius: "8px",
                                        borderBottomRightRadius: "8px",
                                        backgroundColor: isDark ? alpha(theme.palette.common.white, 0.04) : "#fff",
                                    },

                                    "& .ql-editor": {
                                        flex: 1,
                                        overflowY: "auto",
                                        fontSize: "14px",
                                        color: theme.palette.text.primary,
                                    },

                                    "& .ql-editor.ql-blank::before": {
                                        color: theme.palette.text.secondary,
                                    },

                                    // Quill icons/text colors in dark mode
                                    "& .ql-snow .ql-stroke": { stroke: theme.palette.text.primary },
                                    "& .ql-snow .ql-fill": { fill: theme.palette.text.primary },
                                    "& .ql-snow .ql-picker": { color: theme.palette.text.primary },
                                    "& .ql-snow .ql-picker-options": {
                                        backgroundColor: cardBg,
                                        borderColor: borderColor,
                                        color: theme.palette.text.primary,
                                    },
                                }}
                            >
                                <Controller
                                    name="htmlContent"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={modules}
                                            placeholder="Write your contract content here..."
                                        />
                                    )}
                                />

                                {errors.htmlContent && <FormHelperText error>{errors.htmlContent.message as any}</FormHelperText>}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* RIGHT */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                position: "sticky",
                                top: 20,
                                bgcolor: cardBg,
                                border: `1px solid ${borderColor}`,
                                boxShadow: paperShadow,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={700}>
                                Live Preview
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                This is how the PDF will look (approx).
                            </Typography>

                            <Box
                                sx={{
                                    mt: 1,
                                    flex: 1,
                                    minHeight: 600,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    bgcolor: isDark ? alpha(theme.palette.common.white, 0.04) : "#fff",
                                }}
                            >
                                <iframe
                                    title="Template preview"
                                    style={{
                                        border: "none",
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "white", // keep PDF paper white
                                    }}
                                    srcDoc={previewHtml}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
