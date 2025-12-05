// src/pages/Contract/ContractPDF.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
import NavMenu from "@/components/NavMenu/NavMenu";

import { getContractById } from "@/services/customerService/ContractService";
import { getOrders } from "@/services/customerService/OrderService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ContractPDF() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
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

  return (
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

        <Divider sx={{ my: 3 }} />

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
            </Box>
          </Grid>

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
            </Box>
          </Grid>
        </Grid>

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
  );
}
