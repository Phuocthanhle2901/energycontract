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

import { FiX, FiDownload } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { ContractApi } from "@/api/contract.api";
import { OrderApi } from "@/api/order.api";

export default function ContractPDF() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  const [contract, setContract] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    async function load() {
      const c = await ContractApi.getById(numericId);
      setContract(c);

      const o = await OrderApi.getByContractId(numericId);
      setOrders(o);
    }
    load();
  }, [numericId]);

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

  if (!contract)
    return <Typography sx={{ ml: "260px", p: 3 }}>Loading…</Typography>;

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      {/* ───────── HEADER ───────── */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>📄 Xem trước bản in Hợp đồng</Typography>

        {/* ❗ Đóng → quay lại trang chi tiết */}
        <IconButton onClick={() => navigate(`/contracts/${contract.id}/detail`)}>
          <FiX size={22} />
        </IconButton>
      </DialogTitle>

      {/* ───────── CONTENT ───────── */}
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
            minHeight: "1120px", // tương đương chiều dài A4
          }}
        >
          {/* TITLE */}
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 1 }}
          >
            HỢP ĐỒNG CUNG CẤP
          </Typography>

          <Typography textAlign="center" sx={{ mb: 3 }}>
            Số: CTR-{contract.contractNumber}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* A + B INFO */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            {/* BÊN A */}
            <Box sx={{ width: "45%" }}>
              <Typography fontWeight={700}>Bên A (Nhà cung cấp)</Typography>
              <Typography>Công ty Năng lượng Quốc gia</Typography>
              <Typography>123 Đường Điện Lực, TP.HCM</Typography>
              <Typography>MST: 0101010101</Typography>
            </Box>

            {/* BÊN B */}
            <Box sx={{ width: "45%" }}>
              <Typography fontWeight={700}>Bên B (Khách hàng)</Typography>
              <Typography>{contract.companyName}</Typography>
              <Typography>
                {contract.firstName} {contract.lastName}
              </Typography>
              <Typography>SDT: {contract.phone}</Typography>
              <Typography>Email: {contract.email}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* SERVICE TABLE */}
          <Typography variant="h6" fontWeight={700} mb={2}>
            Thông tin dịch vụ đăng ký
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Loại dịch vụ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày bắt đầu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phí kích hoạt</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không có dịch vụ
                  </TableCell>
                </TableRow>
              )}

              {orders.map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell>
                    {o.orderType === 1 ? "Electricity" : "Gas"}
                  </TableCell>
                  <TableCell>{o.orderNumber}</TableCell>
                  <TableCell>{o.startDate?.slice(0, 10)}</TableCell>
                  <TableCell>
                    {(o.topupFee || 0).toLocaleString("vi-VN")} VND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 5 }} />

          {/* SIGN AREA */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
            <Box sx={{ textAlign: "center", width: "45%" }}>
              <Typography fontWeight={700}>Đại diện Bên A</Typography>
              <Typography>(Ký, đóng dấu)</Typography>
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

        {/* ACTION BAR */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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
