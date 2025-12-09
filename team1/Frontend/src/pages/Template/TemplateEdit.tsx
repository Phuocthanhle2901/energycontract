// src/pages/Template/TemplateEdit.tsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TemplateApi } from "@/api/template.api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
} from "@mui/material";
import toast from "react-hot-toast";
import { useEffect, useState, useMemo, useRef } from "react";
import NavMenu from "@/components/NavMenu/NavMenu";

type TemplateEditFormValues = {
    description: string;
    htmlContent: string;
    isActive: boolean;
};

interface Template {
    id: number;
    name: string;
    description: string;
    htmlContent: string;
    isActive: boolean;
}

interface PreviewState {
    previewVariables?: Record<string, string>;
    fillFromContract?: boolean;
}

// HTML mẫu hợp đồng với placeholder
const CONTRACT_TEMPLATE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hợp đồng cung cấp năng lượng</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px 60px;
        color: #111827;
      }
      h1 {
        text-align: center;
        font-size: 24px;
        margin-bottom: 4px;
      }
      h2 {
        text-align: center;
        font-size: 14px;
        font-weight: normal;
        color: #6b7280;
        margin-top: 0;
        margin-bottom: 24px;
      }
      .section-title {
        font-weight: bold;
        margin-top: 16px;
        margin-bottom: 6px;
      }
      .divider {
        border-bottom: 1px solid #e5e7eb;
        margin: 8px 0 12px 0;
      }
      p {
        margin: 2px 0;
        font-size: 13px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
        font-size: 12px;
      }
      th,
      td {
        border-bottom: 1px solid #e5e7eb;
        padding: 6px 4px;
        text-align: left;
      }
      th {
        font-weight: 600;
        background-color: #f3f4f6;
      }
      .sign-row {
        margin-top: 48px;
        display: flex;
        justify-content: space-between;
      }
      .sign-col {
        width: 45%;
        text-align: center;
        font-size: 13px;
      }
      .sign-name {
        margin-top: 48px;
      }
      .muted {
        color: #6b7280;
        font-size: 11px;
        margin-top: 24px;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <h1>HỢP ĐỒNG CUNG CẤP NĂNG LƯỢNG</h1>
    <h2>(Gas / Điện năng · Energy Contract Manager)</h2>

    <div>
      <p class="section-title">1. Thông tin Hợp đồng</p>
      <div class="divider"></div>
      <p><strong>Mã hợp đồng:</strong> {ContractNumber}</p>
      <p><strong>Thời hạn:</strong> {StartDate} - {EndDate}</p>
    </div>

    <div>
      <p class="section-title">2. Thông tin Khách hàng</p>
      <div class="divider"></div>
      <p><strong>Khách hàng:</strong> {FullName}</p>
      <p><strong>Email:</strong> {Email}</p>
      <p><strong>Số điện thoại:</strong> {Phone}</p>
      <p><strong>Công ty:</strong> {CompanyName}</p>
      <p><strong>Số tài khoản:</strong> {BankAccountNumber}</p>
    </div>

    <div>
      <p class="section-title">3. Danh sách Đơn hàng (Orders)</p>
      <div class="divider"></div>
      <table>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th style="text-align: right;">Phí Topup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{OrderNumber}</td>
            <td>{OrderType}</td>
            <td>{OrderStatus}</td>
            <td>{OrderStartDate}</td>
            <td>{OrderEndDate}</td>
            <td style="text-align: right;">{OrderTopupFee}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 8px;"><strong>Tổng cộng:</strong> {Currency} {TotalAmount}</p>
    </div>

    <div class="sign-row">
      <div class="sign-col">
        <p><strong>Đại diện Bên A</strong></p>
        <p>(Ký, ghi rõ họ tên)</p>
        <p class="sign-name">______________________</p>
      </div>
      <div class="sign-col">
        <p><strong>Đại diện Bên B</strong></p>
        <p>(Ký xác nhận)</p>
        <p class="sign-name">{FullName}</p>
      </div>
    </div>

    <p class="muted">Generated: {GeneratedDate}</p>
  </body>
</html>`.trim();

export default function TemplateEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const navigationState = (location.state as PreviewState) || {};
    const previewVariables = navigationState.previewVariables;
    const fillFromContract = navigationState.fillFromContract ?? false;

    const [templateName, setTemplateName] = useState<string>("");
    const [leftWidth, setLeftWidth] = useState<number>(50); // % chiều rộng cột trái
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const numericId = id ? Number(id) : NaN;

    const { data, isLoading, isError } = useQuery<Template>({
        queryKey: ["template", numericId],
        queryFn: () => TemplateApi.getById(numericId),
        enabled: !Number.isNaN(numericId),
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TemplateEditFormValues>({
        resolver: yupResolver(templateSchema.omit(["name"])),
        defaultValues: {
            description: "",
            htmlContent: "",
            isActive: true,
        },
    });

    const htmlContent = watch("htmlContent");

    // Load dữ liệu template từ API + inject dữ liệu hợp đồng vào HTML (nếu có)
    useEffect(() => {
        if (!data) return;

        setTemplateName(data.name);

        // 1. Nếu DB đã có htmlContent thì dùng, nếu chưa có thì dùng template mặc định
        let htmlToUse =
            data.htmlContent && data.htmlContent.trim().length > 0
                ? data.htmlContent
                : CONTRACT_TEMPLATE_HTML;

        // 2. Nếu mở từ trang hợp đồng và có previewVariables => thay placeholder bằng dữ liệu thật
        if (fillFromContract && previewVariables) {
            Object.entries(previewVariables).forEach(([key, value]) => {
                const regex = new RegExp(`\\{${key}\\}`, "g");
                htmlToUse = htmlToUse.replace(regex, value ?? "");
            });
        }

        reset({
            description: data.description,
            htmlContent: htmlToUse,
            isActive: data.isActive,
        });
    }, [data, reset, fillFromContract, previewVariables]);

    // Xử lý kéo divider để thay đổi width
    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!isResizing || !containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            let newLeft = (offsetX / rect.width) * 100;

            // Giới hạn 25% – 75% cho đẹp
            newLeft = Math.max(25, Math.min(75, newLeft));
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

    const onSubmit = async (values: TemplateEditFormValues) => {
        if (Number.isNaN(numericId)) {
            toast.error("Invalid template id");
            return;
        }

        try {
            const payload: TemplateEditFormValues = {
                ...values,
                htmlContent: values.htmlContent.trim(),
            };

            await TemplateApi.update(numericId, payload);

            await queryClient.invalidateQueries({
                queryKey: ["template", numericId],
            });
            await queryClient.invalidateQueries({ queryKey: ["templates"] });

            toast.success("Template updated successfully");
            navigate("/templates");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update template");
        }
    };

    // HTML cho preview: hiển thị đúng những gì đang ở htmlContent (đã merge dữ liệu nếu có)
    const previewHtml = useMemo(() => {
        return htmlContent && htmlContent.trim().length > 0
            ? htmlContent
            : "<p style='font-family:system-ui;padding:16px;'>No HTML content yet. Start typing in the editor.</p>";
    }, [htmlContent]);

    if (Number.isNaN(numericId)) {
        return (
            <>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>
                    <Typography color="error">
                        Invalid template id. Please go back to the list.
                    </Typography>
                </Box>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>
                    <Typography>Loading template...</Typography>
                </Box>
            </>
        );
    }

    if (isError || !data) {
        return (
            <>
                <NavMenu />
                <Box sx={{ ml: { xs: 0, md: "260px" }, p: 3 }}>
                    <Typography color="error">
                        Failed to load template. It may have been deleted.
                    </Typography>
                </Box>
            </>
        );
    }

    return (
        <>
            <NavMenu />
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
                            Edit PDF Template
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ maxWidth: 720 }}
                        >
                            Update the HTML layout and settings of this PDF template. The
                            preview on the right will update in real-time as you edit the
                            code. Nếu bạn mở từ trang hợp đồng, dữ liệu hợp đồng sẽ được chèn
                            sẵn vào HTML Template (code) để bạn chỉnh sửa trực tiếp.
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
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </Stack>
                </Stack>

                {/* MAIN CONTENT: SPLIT + DRAG HANDLE */}
                <Box
                    ref={containerRef}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "stretch",
                        gap: { xs: 2, md: 0 },
                    }}
                >
                    {/* LEFT: TEMPLATE SETTINGS + CODE */}
                    <Box
                        sx={{
                            flexBasis: { xs: "100%", md: `${leftWidth}%` },
                            flexGrow: 0,
                            flexShrink: 0,
                            pr: { xs: 0, md: 1.5 },
                            pb: { xs: 2, md: 0 },
                        }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                width: "100%",
                                height: "100%",
                                minHeight: 520,
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
                                value={templateName}
                                disabled
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
                                control={<Switch {...register("isActive")} />}
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
                                placeholder="Update your HTML template here..."
                                fullWidth
                                sx={{ flex: 1 }}
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
                    </Box>

                    {/* DIVIDER – drag handle (chỉ hiện trên md+) */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "stretch",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            onMouseDown={() => setIsResizing(true)}
                            sx={{
                                width: "6px",
                                cursor: "col-resize",
                                bgcolor: isResizing ? "#3b82f6" : "#e5e7eb",
                                borderRadius: "999px",
                                "&:hover": {
                                    bgcolor: "#cbd5f5",
                                },
                            }}
                        />
                    </Box>

                    {/* RIGHT: PREVIEW */}
                    <Box
                        sx={{
                            flexBasis: { xs: "100%", md: `${100 - leftWidth}%` },
                            flexGrow: 1,
                            flexShrink: 0,
                            pl: { xs: 0, md: 1.5 },
                        }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                width: "100%",
                                height: "100%",
                                minHeight: 520,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600}>
                                Preview
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                This preview is rendered from the HTML template on the left. It
                                always shows exactly what will be stored and used to generate
                                the final PDF.
                            </Typography>

                            <Box
                                sx={{
                                    mt: 1,
                                    flex: 1,
                                    minHeight: 0,
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
