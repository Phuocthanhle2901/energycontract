// src/pages/orders/OrderIndex.tsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TableContainer,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavMenu from "@/components/NavMenu/NavMenu";

// ===== TYPES =====
export interface Order {
  id: string;
  orderNumber: string;
  orderType: "electricity" | "gas";
  status: "active" | "pending" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  topupFee: number;
}

export interface Contract {
  contractNumber: string;
  firstName: string;
  lastName: string;
  customerName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  companyName: string;
  status: string;
  orders: Order[];
}

// ===== MOCK DATA =====
const mockContracts: Contract[] = [
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
    status: "Active",
    orders: [
      {
        id: "1",
        orderNumber: "ORD-E-001",
        orderType: "electricity",
        status: "active",
        startDate: "2025-12-01",
        endDate: "2025-12-01",
        topupFee: 120000,
      },
      {
        id: "2",
        orderNumber: "ORD-G-002",
        orderType: "gas",
        status: "active",
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
    status: "Inactive",
    orders: [
      {
        id: "3",
        orderNumber: "ORD-E-003",
        orderType: "electricity",
        status: "active",
        startDate: "2025-11-15",
        endDate: "2026-11-15",
        topupFee: 100000,
      },
    ],
  },
];

// ===== COMPONENT =====
export default function OrderIndex() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleEdit = (order: Order) => {
    console.log("Edit order:", order);
  };

  const handleDelete = (orderId: string) => {
    console.log("Delete order ID:", orderId);
  };

  return (
    <>
      <NavMenu />
      <Box sx={{ background: "#f5f7fa", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            <span style={{ color: "#1976D2" }}>Order</span> Management
          </Typography>

          {mockContracts.map((contract) => (
            <Accordion
              key={contract.contractNumber}
              expanded={expanded === contract.contractNumber}
              onChange={handleAccordionChange(contract.contractNumber)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>
                  {contract.contractNumber} - {contract.customerName} ({contract.status})
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Paper sx={{ p: 2 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#D1D5DB" }}>
                          <TableCell sx={{ fontWeight: 700 }}>Số Đơn hàng</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Ngày Bắt đầu</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Ngày Kết thúc</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Chi phí</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {contract.orders.map((o) => (
                          <TableRow key={o.id} hover>
                            <TableCell>{o.orderNumber}</TableCell>
                            <TableCell>
                              <Chip
                                icon={o.orderType === "electricity" ? <FlashOnIcon /> : <LocalGasStationIcon />}
                                label={o.orderType.toUpperCase()}
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip label={o.status.toUpperCase()} variant="outlined" sx={{ fontWeight: 600 }} />
                            </TableCell>
                            <TableCell>{o.startDate}</TableCell>
                            <TableCell>{o.endDate}</TableCell>
                            <TableCell>{o.topupFee.toLocaleString()} VND</TableCell>
                            <TableCell>
                              <IconButton color="primary" onClick={() => handleEdit(o)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleDelete(o.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
    </>
  );
}
