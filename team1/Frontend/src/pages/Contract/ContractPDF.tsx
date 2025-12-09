// src/pages/Contract/ContractPDF.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
<<<<<<< HEAD

import { Zap, Flame } from "lucide-react";
import NavMenu from "@/components/NavMenu/NavMenu";

import { getContractById } from "@/services/customerService/ContractService";
import { getOrders } from "@/services/customerService/OrderService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

=======

import { FiX, FiDownload, FiEdit } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { ContractApi } from "@/api/contract.api";
import { OrderApi } from "@/api/order.api";
import { TemplateApi } from "@/api/template.api";

>>>>>>> intern2025-team1
export default function ContractPDF() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  const [contract, setContract] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);

  const numericId = Number(id);

  if (!id || isNaN(numericId)) {
    return (
      <>
        <NavMenu />
        <Box sx={{ p: 4, ml: "240px" }}>
          <Typography variant="h6">Invalid Contract ID</Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate("/contracts/list")}>
            Back
          </Button>
        </Box>
      </>
    );
  }

  // ===============================
  // Fetch Contract + Orders
  // ===============================
  useEffect(() => {
    async function loadData() {
      try {
        const c = await getContractById(numericId);
        setContract(c);

        // Fetch all orders → filter by contractId
        const allOrders = await getOrders();
        const filtered = allOrders.filter((o: any) => o.contractId === numericId);
        setOrders(filtered);
      } catch (error) {
        console.error("❌ Load error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [numericId]);

  if (loading) {
    return (
      <>
        <NavMenu />
        <Box sx={{ p: 4, ml: "240px" }}>Loading...</Box>
      </>
    );
  }

  if (!contract) {
    return (
      <>
        <NavMenu />
        <Box sx={{ p: 4, ml: "240px" }}>
          <Typography variant="h6">Contract not found</Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate("/contracts/list")}>
            Back
          </Button>
        </Box>
      </>
    );
  }

  // ===============================
  // Export PDF
  // ===============================
  const handleExportPDF = () => {
    const input = document.getElementById("contract-pdf");
=======
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
>>>>>>> intern2025-team1
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
      // nếu chưa có template thì quay về list để user chọn
      navigate("/templates");
      return;
    }

    const firstOrder = orders[0] || {};

    // Chuẩn bị dữ liệu để preview bên TemplateEdit
    const totalAmount = orders.reduce((sum, o) => sum + (o.topupFee ?? 0), 0);

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
<<<<<<< HEAD
    <>
      <NavMenu />

      {/* Export Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 3, mt: 3 }}>
        <Button variant="contained" onClick={handleExportPDF}>
          Export PDF
        </Button>
      </Box>

      {/* PDF CONTENT */}
      <Paper
        id="contract-pdf"
        elevation={4}
        sx={{
          width: "900px",
          mx: "auto",
          p: 5,
          mt: 3,
          borderRadius: "12px",
          background: "#fff",
        }}
      >
        {/* HEADER */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight={700}>
              ENERGY SUPPLY CONTRACT
            </Typography>
            <Typography mt={1}>
              Contract Number: <strong>{contract.contractNumber}</strong>
            </Typography>
          </Grid>

          <Grid item textAlign="right">
            <Typography fontSize={20} fontWeight={700} color="primary">
              ⚡ EnergyCorp
            </Typography>
            <Typography fontSize={14}>
              Created: {new Date().toLocaleDateString("vi-VN")}
            </Typography>
          </Grid>
        </Grid>
=======
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
>>>>>>> intern2025-team1

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

<<<<<<< HEAD
        {/* CUSTOMER INFO */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight={700} sx={{ fontSize: "18px" }}>
              SUPPLIER
            </Typography>
            <Box mt={2}>
              <Typography fontWeight={600}>Energy Corporation</Typography>
              <Typography>Address: 123 Energy Street</Typography>
              <Typography>Hotline: 1900 1000</Typography>
=======
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
                {orders.map((order) => (
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
>>>>>>> intern2025-team1
            </Box>

<<<<<<< HEAD
          <Grid item xs={12} md={6}>
            <Typography fontWeight={700} sx={{ fontSize: "18px" }}>
              CUSTOMER
            </Typography>
            <Box mt={2}>
              <Typography fontWeight={700}>{contract.companyName}</Typography>
              <Typography>
                {contract.firstName} {contract.lastName}
              </Typography>
              <Typography>Phone: {contract.phone}</Typography>
              <Typography>Email: {contract.email}</Typography>
=======
            <Box sx={{ textAlign: "center", width: "45%" }}>
              <Typography fontWeight={700}>Đại diện Bên B</Typography>
              <Typography>(Ký xác nhận)</Typography>
              <Typography sx={{ mt: 2 }}>
                {contract.lastName} {contract.firstName}
              </Typography>
>>>>>>> intern2025-team1
            </Box>
          </Box>
        </Paper>

<<<<<<< HEAD
        <Divider sx={{ my: 4 }} />

        {/* ORDERS LIST */}
        <Typography variant="h6" fontWeight={700} mb={2}>
          REGISTERED SERVICES
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Order No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Top-up Fee
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No services registered
                </TableCell>
              </TableRow>
            )}

            {orders.map((o: any) => (
              <TableRow key={o.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {o.orderType === 1 ? <Zap size={18} /> : <Flame size={18} />}
                    {o.orderType === 1 ? "Electricity" : "Gas"}
                  </Box>
                </TableCell>

                <TableCell>{o.orderNumber}</TableCell>
                <TableCell>
                  {o.startDate?.slice(0, 10)} → {o.endDate?.slice(0, 10)}
                </TableCell>

                <TableCell align="right">
                  {(o.topupFee || 0).toLocaleString("vi-VN")} VND
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 4 }} />

        {/* TERMS */}
        <Typography variant="h6" fontWeight={700} mb={1}>
          TERMS & CONDITIONS
        </Typography>
        <Typography sx={{ lineHeight: 1.7 }}>
          • Customer agrees to pay all service fees.
          <br />
          • Contract renews automatically unless cancelled 30 days in advance.
          <br />
          • Disputes resolved under Vietnam law.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* SIGN SECTION */}
        <Grid container justifyContent="space-between" textAlign="center">
          <Grid item xs={5}>
            <Typography fontWeight={700}>SUPPLIER</Typography>
            <Typography>(Signature & Seal)</Typography>
            <Box sx={{ width: "70%", height: "1px", bgcolor: "#000", mx: "auto", mt: 8 }} />
          </Grid>

          <Grid item xs={5}>
            <Typography fontWeight={700}>CUSTOMER</Typography>
            <Typography>(Signature)</Typography>
            <Box sx={{ width: "70%", height: "1px", bgcolor: "#000", mx: "auto", mt: 8 }} />
            <Typography fontWeight={700} mt={2}>
              {contract.lastName} {contract.firstName}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
=======
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
>>>>>>> intern2025-team1
  );
}
