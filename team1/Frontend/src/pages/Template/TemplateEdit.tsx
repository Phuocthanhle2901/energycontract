// src/pages/Template/TemplateEdit.tsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
import { alpha } from "@mui/material/styles";

import { useEffect, useMemo, useRef, useState } from "react";
import NavMenu from "@/components/NavMenu/NavMenu";
import { useTemplate, useUpdateTemplate } from "@/hooks/usePdf";
import { templateSchema } from "@/schemas/template.schema";

type TemplateEditFormValues = {
    description: string;
    htmlContent: string;
    isActive: boolean;
};

interface PreviewState {
    previewVariables?: Record<string, string>;
    fillFromContract?: boolean;
}

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

// Fallback HTML template
export const CONTRACT_TEMPLATE_HTML = `
  <h1 style="text-align: center;">HỢP ĐỒNG MẪU</h1>
  <p>Mã hợp đồng: {ContractNumber}</p>
`;

export default function TemplateEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // ===== THEME TOKENS (NO HARDCODE) =====
    const pageBg = "background.default";
    const cardBg = "background.paper";
    const borderColor = alpha(theme.palette.divider, 0.8);
    const paperShadow = isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)";

    const numericId = id ? Number(id) : NaN;

    const navigationState = (location.state as PreviewState) || {};
    const previewVariables = navigationState.previewVariables;
    const fillFromContract = navigationState.fillFromContract ?? !!previewVariables;

    const [templateName, setTemplateName] = useState<string>("");

    // drag resize
    const [leftWidth, setLeftWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // API
    const { data, isLoading, isError } = useTemplate(numericId);
    const updateMutation = useUpdateTemplate();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm<TemplateEditFormValues>({
        resolver: yupResolver(templateSchema.omit(["name"])),
        defaultValues: {
            description: "",
            htmlContent: "",
            isActive: true,
        },
    });

    const htmlContent = watch("htmlContent");

    // Load template + merge preview variables
    useEffect(() => {
        if (!data) return;

        setTemplateName(data.name);

        const htmlFromDb = data.htmlContent?.trim();
        let htmlBase = htmlFromDb && htmlFromDb.length > 0 ? htmlFromDb : CONTRACT_TEMPLATE_HTML;

        if (fillFromContract && previewVariables) {
            Object.entries(previewVariables).forEach(([key, value]) => {
                // Replace {Key} tokens
                const regex = new RegExp(`\\{${key}\\}`, "g");
                htmlBase = htmlBase.replace(regex, value ?? "");
            });
        }

        reset({
            description: data.description,
            htmlContent: htmlBase,
            isActive: data.isActive,
        });
    }, [data, reset, fillFromContract, previewVariables]);

    // Drag handle logic
    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!isResizing || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;

            let newLeft = (offsetX / rect.width) * 100;
            newLeft = Math.max(30, Math.min(70, newLeft));
            setLeftWidth(newLeft);
        }

        function handleMouseUp() {
            if (isResizing) setIsResizing(false);
        }

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const onSubmit = (values: TemplateEditFormValues) => {
        if (Number.isNaN(numericId)) return;

        updateMutation.mutate(
            {
                id: numericId,
                data: {
                    ...values,
                    htmlContent: values.htmlContent,
                },
            } as any,
            {
                onSuccess: () => navigate("/templates"),
            }
        );
    };

    const isSubmitting = updateMutation.isPending;

    // Preview HTML (paper stays white inside iframe)
    const previewHtml = useMemo(() => {
        const content =
            htmlContent && htmlContent.trim().length > 0
                ? htmlContent
                : "<p style='font-family:system-ui;padding:16px;color:#888'>No HTML content yet.</p>";

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

    // Guards
    if (Number.isNaN(numericId)) {
        return (
            <Box sx={{ display: "flex" }}>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>Invalid ID</Box>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: "flex" }}>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>Loading...</Box>
            </Box>
        );
    }

    if (isError || !data) {
        return (
            <Box sx={{ display: "flex" }}>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>Error loading template.</Box>
            </Box>
        );
    }

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
                            Edit PDF Template
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Update HTML layout and settings.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => navigate("/templates")} disabled={isSubmitting}>
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </Stack>
                </Stack>

                {/* BODY */}
                <Box
                    ref={containerRef}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 2, md: 0 },
                        height: { xs: "auto", md: "calc(100vh - 180px)" },
                    }}
                >
                    {/* LEFT: EDITOR */}
                    <Box
                        sx={{
                            flexBasis: { xs: "100%", md: `${leftWidth}%` },
                            pr: { md: 1.5 },
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 0,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                height: { xs: "auto", md: "100%" },
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                bgcolor: cardBg,
                                border: `1px solid ${borderColor}`,
                                boxShadow: paperShadow,
                                minHeight: 0,
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={700}>
                                Settings
                            </Typography>

                            <TextField label="Name" size="small" value={templateName} disabled fullWidth />

                            <TextField
                                label="Description"
                                size="small"
                                {...register("description")}
                                error={!!errors.description}
                                helperText={errors.description?.message?.toString()}
                                fullWidth
                            />

                            <FormControlLabel control={<Switch {...register("isActive")} />} label="Active" />

                            <Typography variant="subtitle2" fontWeight={700}>
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

                                    // Quill icons/text colors for dark mode
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
                                            placeholder="Edit contract content here..."
                                        />
                                    )}
                                />

                                {errors.htmlContent && <FormHelperText error>{errors.htmlContent.message as any}</FormHelperText>}
                            </Box>
                        </Paper>
                    </Box>

                    {/* DRAG HANDLE */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", alignItems: "center" }}>
                        <Box
                            onMouseDown={() => setIsResizing(true)}
                            sx={{
                                width: "8px",
                                height: "120px",
                                cursor: "col-resize",
                                bgcolor: isResizing ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.25),
                                borderRadius: "4px",
                                transition: "background-color 0.2s",
                                "&:hover": { bgcolor: alpha(theme.palette.text.secondary, 0.4) },
                            }}
                        />
                    </Box>

                    {/* RIGHT: PREVIEW */}
                    <Box sx={{ flexBasis: { xs: "100%", md: `${100 - leftWidth}%` }, pl: { md: 1.5 }, minHeight: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                height: { xs: 520, md: "100%" },
                                display: "flex",
                                flexDirection: "column",
                                bgcolor: cardBg,
                                border: `1px solid ${borderColor}`,
                                boxShadow: paperShadow,
                                minHeight: 0,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={700}>
                                Live Preview
                            </Typography>

                            <Box
                                sx={{
                                    mt: 1,
                                    flex: 1,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    bgcolor: isDark ? alpha(theme.palette.common.white, 0.04) : "#fff",
                                }}
                            >
                                <iframe
                                    title="preview"
                                    style={{
                                        border: "none",
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "white",
                                    }}
                                    srcDoc={previewHtml}
                                />
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
