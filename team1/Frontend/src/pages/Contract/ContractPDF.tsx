// src/pages/Contract/ContractPDF.tsx
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { Zap, Flame } from "lucide-react";
import NavMenu from "../../components/NavMenu/NavMenu";
import type { ContractData } from "./ContractList";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// =======================
// MOCK CONTRACTS
// =======================
const MOCK_CONTRACTS: ContractData[] = [
  {
    contractNumber: "101",
    firstName: "Nguyen",
    lastName: "Van A",
    customerName: "Nguyen Van A",
    email: "a.nguyen@example.com",
    phone: "0901234567",
    startDate: "2025-12-01",
    endDate: "2026-12-01",
    companyName: "ABC Corp",
    pdfLink: "",
    status: "Active",
    orders: [
      {
        id: 1,
        orderNumber: "ORD-E-001",
        orderType: 1,
        startDate: "2025-12-01",
        endDate: "2026-12-01",
        topupFee: 120000,
      },
      {
        id: 2,
        orderNumber: "ORD-G-002",
        orderType: 2,
        startDate: "2025-12-01",
        endDate: "2026-12-01",
        topupFee: 80000,
      },
    ],
  },
  {
    contractNumber: "102",
    firstName: "Tran",
    lastName: "Thi B",
    customerName: "Tran Thi B",
    email: "b.tran@example.com",
    phone: "0902345678",
    startDate: "2025-11-15",
    endDate: "2026-11-15",
    companyName: "XYZ Ltd",
    pdfLink: "",
    status: "Inactive",
    orders: [
      {
        id: 3,
        orderNumber: "ORD-E-003",
        orderType: 1,
        startDate: "2025-11-15",
        endDate: "2026-11-15",
        topupFee: 100000,
      },
    ],
  },
];

export default function ContractPDF() {
  const { contractNumber } = useParams<{ contractNumber: string }>();
  const navigate = useNavigate();

  const contract = MOCK_CONTRACTS.find(c => c.contractNumber === contractNumber);

  if (!contract) {
    return (
      <>
        <NavMenu />
        <Box sx={{ p: 4, ml: "240px" }}>
          <Typography variant="h6">Contract not found</Typography>
          <Typography
            sx={{ mt: 2, cursor: "pointer", color: "primary.main" }}
            onClick={() => navigate("/contracts/list")}
          >
            Back to contract list
          </Typography>
        </Box>
      </>
    );
  }

  // Hàm xuất PDF
  const handleExportPDF = () => {
    const input = document.getElementById("contract-pdf");
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Contract-${contract.contractNumber}.pdf`);
    });
  };

  return (
    <>
      <NavMenu />

      {/* Nút Xuất PDF */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 3, mt: 3 }}>
        <Button variant="contained" onClick={handleExportPDF}>
          Xuất PDF
        </Button>
      </Box>

      <Paper
        id="contract-pdf"
        elevation={4}
        sx={{ width: "900px", mx: "auto", p: 5, mt: 3, borderRadius: "12px", background: "#fff" }}
      >
        {/* HEADER */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight={700}>
              HỢP ĐỒNG CUNG CẤP NĂNG LƯỢNG
            </Typography>
            <Typography mt={1}>
              Số hợp đồng: <strong>{contract.contractNumber}</strong>
            </Typography>
          </Grid>
          <Grid item textAlign="right">
            <Typography fontSize={20} fontWeight={700} color="primary">
              ⚡ EnergyCorp
            </Typography>
            <Typography fontSize={14}>
              Ngày tạo: {new Date().toLocaleDateString("vi-VN")}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* PARTIES */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight={700} sx={{ fontSize: "18px" }}>
              BÊN A (Nhà cung cấp)
            </Typography>
            <Box mt={2}>
              <Typography fontWeight={600}>Công ty Năng Lượng Quốc Gia</Typography>
              <Typography>Địa chỉ: 123 Điện Lực, Quận 1, TP.HCM</Typography>
              <Typography>MST: 0101010101</Typography>
              <Typography>Hotline: 1900 1000</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={700} sx={{ fontSize: "18px" }}>
              BÊN B (Khách hàng)
            </Typography>
            <Box mt={2}>
              <Typography fontWeight={700}>{contract.companyName?.toUpperCase()}</Typography>
              <Typography>
                {contract.firstName} {contract.lastName}
              </Typography>
              <Typography>SĐT: {contract.phone}</Typography>
              <Typography>Email: {contract.email}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* SERVICES */}
        <Typography variant="h6" fontWeight={700} mb={2}>
          THÔNG TIN DỊCH VỤ ĐĂNG KÝ
        </Typography>

        <Table sx={{ borderRadius: "8px", overflow: "hidden" }}>
          <TableHead>
            <TableRow sx={{ background: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700 }}>Loại dịch vụ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Phí kích hoạt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contract.orders?.map((o) => (
              <TableRow hover key={o.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {o.orderType === 1 ? <Zap size={18} /> : <Flame size={18} />}
                    {o.orderType === 1 ? "Điện" : "Gas"}
                  </Box>
                </TableCell>
                <TableCell>{o.orderNumber}</TableCell>
                <TableCell>
                  {o.startDate} → {o.endDate}
                </TableCell>
                <TableCell align="right">{o.topupFee.toLocaleString("vi-VN")} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 4 }} />

        {/* TERMS */}
        <Typography variant="h6" fontWeight={700} mb={1}>
          ĐIỀU KHOẢN CHUNG
        </Typography>
        <Typography sx={{ lineHeight: 1.7 }}>
          • Bên B cam kết thanh toán đầy đủ các khoản phí trong quá trình sử dụng dịch vụ.
          <br />
          • Hợp đồng có hiệu lực từ ngày ký và tự động gia hạn nếu không báo trước 30 ngày.
          <br />
          • Mọi tranh chấp sẽ giải quyết theo pháp luật Việt Nam.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* SIGNATURE AREA */}
        <Grid container sx={{ mt: 6, justifyContent: "space-between", textAlign: "center" }}>
          <Grid item xs={5}>
            <Typography fontWeight={700}>ĐẠI DIỆN BÊN A</Typography>
            <Typography variant="body2" mb={6}>
              (Ký tên & đóng dấu)
            </Typography>
            <Box sx={{ width: "70%", height: "1px", bgcolor: "#000", mx: "auto", mt: 8 }} />
          </Grid>

          <Grid item xs={5}>
            <Typography fontWeight={700}>ĐẠI DIỆN BÊN B</Typography>
            <Typography variant="body2" mb={6}>
              (Ký tên)
            </Typography>
            <Box sx={{ width: "70%", height: "1px", bgcolor: "#000", mx: "auto", mt: 8 }} />
            <Typography fontWeight={700} mt={2}>
              {contract.lastName} {contract.firstName}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
