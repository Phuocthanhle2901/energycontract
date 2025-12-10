// src/pages/Contract/ContractPDF.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import { FiX, FiDownload, FiEdit } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { ContractApi } from "@/api/contract.api";
import { OrderApi } from "@/api/order.api";
import { TemplateApi } from "@/api/template.api";

export default function ContractPDF() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  const [contract, setContract] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [open, setOpen] = useState(true);
  const [defaultTemplateId, setDefaultTemplateId] = useState<number | null>(
    null
  );

  // ───────────────── LOAD CONTRACT + ORDERS ─────────────────
  useEffect(() => {
    async function load() {
      const c = await ContractApi.getById(numericId);
      setContract(c);

      const o = await OrderApi.getByContractId(numericId);
      setOrders(o);
    }
    if (!Number.isNaN(numericId)) {
      load();
    }
  }, [numericId]);

  // 🔎 CHỈ LẤY ORDER CÙNG CONTRACT
  const filteredOrders = useMemo(() => {
    if (!contract) return [];

    // ❗️Giả sử trong Order có field `contractId`.
    // Nếu backend của bạn dùng field khác (vd: `contractID`, `contract.id`,
    // hoặc so sánh theo `contractNumber`), hãy đổi điều kiện filter bên dưới cho đúng.
    return orders.filter((o) => o.contractId === contract.id);
    // Ví dụ khác:
    // return orders.filter((o) => o.contract?.id === contract.id);
    // hoặc:
    // return orders.filter((o) => o.contractNumber === contract.contractNumber);
  }, [orders, contract]);

  // ───────────────── LOAD DEFAULT TEMPLATE (để Edit PDF) ─────────────────
  useEffect(() => {
    async function loadDefaultTemplate() {
      try {
        const templates = await TemplateApi.getAll();
        if (Array.isArray(templates) && templates.length > 0) {
          const active = templates.find((t: any) => t.isActive);
          const selected = active || templates[0];
          setDefaultTemplateId(selected.id);
        }
      } catch (error) {
        console.error("Failed to load templates for PDF edit", error);
      }
    }

    loadDefaultTemplate();
  }, []);

  // ───────────────── EXPORT PDF (client-side) ─────────────────
  const exportPDF = () => {
    const input = document.getElementById("pdf-preview");
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(img, "PNG", 0, 0, width, height);
      pdf.save(`Contract-${contract.contractNumber}.pdf`);
    });
  };

  // ───────────────── NÚT EDIT PDF TEMPLATE ─────────────────
  const handleEditTemplate = () => {
    if (!defaultTemplateId || !contract) {
      navigate("/templates");
      return;
    }

    const firstOrder = filteredOrders[0] || {};

    // Chuẩn bị dữ liệu để preview bên TemplateEdit
    const totalAmount = filteredOrders.reduce(
      (sum, o) => sum + (o.topupFee ?? 0),
      0
    );

    const previewVariables = {
      ContractNumber: contract.contractNumber ?? "",
      FullName: `${contract.firstName ?? ""} ${contract.lastName ?? ""}`.trim(),
      Email: contract.email ?? "",
      Phone: contract.phone ?? "",
      StartDate: contract.startDate?.slice(0, 10) ?? "",
      EndDate: contract.endDate?.slice(0, 10) ?? "",
      CompanyName: contract.companyName ?? "",
      BankAccountNumber: contract.bankAccountNumber ?? "",
      OrderNumber: firstOrder.orderNumber ?? "",
      OrderType:
        firstOrder.orderType === "gas"
          ? "Gas"
          : firstOrder.orderType === "electricity"
            ? "Electricity"
            : "",
      OrderStatus: firstOrder.status ?? "",
      OrderStartDate: firstOrder.startDate?.slice(0, 10) ?? "",
      OrderEndDate: firstOrder.endDate?.slice(0, 10) ?? "",
      OrderTopupFee:
        typeof firstOrder.topupFee === "number"
          ? firstOrder.topupFee.toLocaleString("vi-VN")
          : "",
      Currency: "VND",
      TotalAmount: totalAmount > 0 ? totalAmount.toLocaleString("vi-VN") : "",
      GeneratedDate: new Date().toISOString().slice(0, 10),
    };

    navigate(`/templates/edit/${defaultTemplateId}`, {
      state: { previewVariables, fillFromContract: true },
    });
  };

  if (!contract)
    return <Typography sx={{ ml: "260px", p: 3 }}>Loading…</Typography>;

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>📄 Xem trước bản in Hợp đồng</Typography>
        <IconButton
          onClick={() => navigate(`/contracts/${contract.id}/detail`)}
        >
          <FiX size={22} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ background: "#f3f4f6", p: 3 }}>
        <Paper
          id="pdf-preview"
          elevation={3}
          sx={{
            width: "100%",
            p: 5,
            borderRadius: 3,
            background: "#ffffff",
            mx: "auto",
            minHeight: "1120px",
          }}
        >
          {/* --- Nội dung hợp đồng --- */}
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 1 }}
          >
            HỢP ĐỒNG CUNG CẤP NĂNG LƯỢNG
          </Typography>

          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ mb: 4, color: "#4b5563" }}
          >
            (Gas / Điện năng · Energy Contract Manager)
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              1. Thông tin Hợp đồng
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Typography>
              <strong>Mã hợp đồng:</strong> {contract.contractNumber}
            </Typography>
            <Typography>
              <strong>Thời hạn:</strong> {contract.startDate?.slice(0, 10)} -{" "}
              {contract.endDate?.slice(0, 10) || "Không xác định"}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              2. Thông tin Khách hàng
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Typography>
              <strong>Khách hàng:</strong> {contract.firstName}{" "}
              {contract.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {contract.email}
            </Typography>
            <Typography>
              <strong>Số điện thoại:</strong>{" "}
              {contract.phone || "Chưa cung cấp"}
            </Typography>
            <Typography>
              <strong>Công ty:</strong> {contract.companyName || "Cá nhân"}
            </Typography>
            <Typography>
              <strong>Số tài khoản:</strong>{" "}
              {contract.bankAccountNumber || "Không có"}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              3. Danh sách Đơn hàng (Orders)
            </Typography>
            <Divider sx={{ mb: 1.5 }} />

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell align="right">Phí Topup</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>
                      {order.orderType === "gas" ? "Gas" : "Electricity"}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {order.startDate ? order.startDate.slice(0, 10) : "-"}
                    </TableCell>
                    <TableCell>
                      {order.endDate ? order.endDate.slice(0, 10) : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {order.topupFee?.toLocaleString("vi-VN")} đ
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box
            sx={{
              mt: 6,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ textAlign: "center", width: "45%" }}>
              <Typography fontWeight={700}>Đại diện Bên A</Typography>
              <Typography>(Ký, ghi rõ họ tên)</Typography>
              <Typography sx={{ mt: 6 }}>______________________</Typography>
            </Box>

            <Box sx={{ textAlign: "center", width: "45%" }}>
              <Typography fontWeight={700}>Đại diện Bên B</Typography>
              <Typography>(Ký xác nhận)</Typography>
              <Typography sx={{ mt: 2 }}>
                {contract.lastName} {contract.firstName}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FiEdit />}
            onClick={handleEditTemplate}
          >
            Edit PDF Template
          </Button>
          <Button
            variant="contained"
            startIcon={<FiDownload />}
            onClick={exportPDF}
          >
            Tải về PDF
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
