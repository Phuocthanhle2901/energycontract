import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useCreateTemplate } from "@/hooks/usePdf"; // Use the hook
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
    CircularProgress
} from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { templateSchema } from "@/schemas/template.schema";

type TemplateCreateFormValues = {
    name: string;
    description: string;
    htmlContent: string;
    isActive: boolean;
};

// HTML mẫu hợp đồng chung cho tất cả template
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

export default function TemplateCreate() {
    const navigate = useNavigate();
    const createMutation = useCreateTemplate();

    const {
        register,
        handleSubmit,
        watch,
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

    const previewHtml = useMemo(
        () =>
            htmlContent && htmlContent.trim().length > 0
                ? htmlContent
                : "<p style='font-family:system-ui;padding:16px;'>No HTML content yet. Start typing in the editor.</p>",
        [htmlContent]
    );

    const onSubmit = (values: TemplateCreateFormValues) => {
        createMutation.mutate(
            {
                ...values,
                htmlContent: values.htmlContent.trim(),
            },
            {
                onSuccess: () => {
                    navigate("/templates"); // Redirect to list after success
                },
            }
        );
    };

    const isSubmitting = createMutation.isPending;

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
                            Create PDF Template
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ maxWidth: 720 }}
                        >
                            Create a reusable PDF template for contracts. You can customize
                            the HTML on the left and see the preview on the right.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/templates")}
                            disabled={isSubmitting}
                        >
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
                    {/* LEFT: FORM + CODE */}
                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                placeholder="Update your HTML template here..."
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
                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                This preview is rendered from the HTML template on the left.
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