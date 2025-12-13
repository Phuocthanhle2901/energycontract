// src/pages/Template/TemplateEdit.tsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    Box,
    Button,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
    FormControlLabel,
    CircularProgress
} from "@mui/material";
import { useEffect, useState, useMemo, useRef } from "react";
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

// 🔹 HTML mẫu hợp đồng chung (Fallback)
export const CONTRACT_TEMPLATE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hợp đồng cung cấp năng lượng</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; }
      h1 { text-align: center; }
    </style>
  </head>
  <body>
    <h1>HỢP ĐỒNG MẪU</h1>
    <p>Mã hợp đồng: {ContractNumber}</p>
  </body>
</html>`;

export default function TemplateEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const numericId = id ? Number(id) : NaN;

    const navigationState = (location.state as PreviewState) || {};
    const previewVariables = navigationState.previewVariables;
    const fillFromContract = navigationState.fillFromContract ?? !!previewVariables;

    const [templateName, setTemplateName] = useState<string>("");
    const [leftWidth, setLeftWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // --- Hooks ---
    const { data, isLoading, isError } = useTemplate(numericId);
    const updateMutation = useUpdateTemplate();

    const {
        register,
        handleSubmit,
        reset,
        watch,
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

    // 🔹 Load template từ API + Merge dữ liệu
    useEffect(() => {
        if (data) {
            setTemplateName(data.name);

            const htmlFromDb = data.htmlContent?.trim();
            let htmlBase = htmlFromDb && htmlFromDb.length > 0 ? htmlFromDb : CONTRACT_TEMPLATE_HTML;

            if (fillFromContract && previewVariables) {
                Object.entries(previewVariables).forEach(([key, value]) => {
                    const regex = new RegExp(`\\{${key}\\}`, "g");
                    htmlBase = htmlBase.replace(regex, value ?? "");
                });
            }

            reset({
                description: data.description,
                htmlContent: htmlBase,
                isActive: data.isActive,
            });
        }
    }, [data, reset, fillFromContract, previewVariables]);

    // 🔹 Drag handle logic
    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!isResizing || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            let newLeft = (offsetX / rect.width) * 100;
            newLeft = Math.max(25, Math.min(75, newLeft));
            setLeftWidth(newLeft);
        }
        function handleMouseUp() { if (isResizing) setIsResizing(false); }

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
                    htmlContent: values.htmlContent.trim(),
                },
            },
            {
                onSuccess: () => {
                    navigate("/templates");
                },
            }
        );
    };

    const isSubmitting = updateMutation.isPending;

    // 🔹 Preview
    const previewHtml = useMemo(
        () => htmlContent && htmlContent.trim().length > 0
            ? htmlContent
            : "<p style='font-family:system-ui;padding:16px;'>No HTML content yet.</p>",
        [htmlContent]
    );

    if (Number.isNaN(numericId)) return <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>Invalid ID</Box>;
    if (isLoading) return <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>Loading...</Box>;
    if (isError || !data) return <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>Error loading template.</Box>;

    return (
        <>
            <NavMenu />
            <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
                {/* HEADER */}
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Edit PDF Template</Typography>
                        <Typography variant="body2" color="text.secondary">Update HTML layout and settings.</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => navigate("/templates")} disabled={isSubmitting}>Back</Button>
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
                <Box ref={containerRef} sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 0 } }}>
                    {/* LEFT */}
                    <Box sx={{ flexBasis: { xs: "100%", md: `${leftWidth}%` }, pr: { md: 1.5 } }}>
                        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>Settings</Typography>
                            <TextField label="Name" size="small" value={templateName} disabled fullWidth />
                            <TextField label="Description" size="small" {...register("description")} fullWidth />
                            <FormControlLabel control={<Switch {...register("isActive")} />} label="Active" />
                            
                            <Typography variant="subtitle2" fontWeight={600}>HTML Code</Typography>
                            <TextField
                                {...register("htmlContent")}
                                multiline minRows={18} fullWidth sx={{ flex: 1 }}
                                InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
                            />
                        </Paper>
                    </Box>

                    {/* DRAG HANDLE */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
                        <Box onMouseDown={() => setIsResizing(true)} sx={{ width: "6px", cursor: "col-resize", bgcolor: isResizing ? "#3b82f6" : "#e5e7eb", borderRadius: "999px" }} />
                    </Box>

                    {/* RIGHT */}
                    <Box sx={{ flexBasis: { xs: "100%", md: `${100 - leftWidth}%` }, pl: { md: 1.5 } }}>
                        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                            <Typography variant="subtitle1" fontWeight={600}>Preview</Typography>
                            <Box sx={{ mt: 1, flex: 1, border: "1px solid #e2e8f0", borderRadius: 1, bgcolor: "white" }}>
                                <iframe title="preview" style={{ border: "none", width: "100%", height: "100%" }} srcDoc={previewHtml} />
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
