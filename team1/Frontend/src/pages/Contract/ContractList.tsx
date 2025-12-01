// src/pages/Contract/ContractList.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";
import NavMenu from "../../components/NavMenu/NavMenu";

export interface ContractData {
  contractNumber: string;
  firstName: string;
  lastName: string;
  customerName: string;
  email: string;
  phone?: string;
  startDate: string;
  endDate?: string;
  companyName?: string;
  bankAccountNumber?: string;
  resellerId?: string;
  addressId?: string;
  pdfLink?: string;
  status: string;
  notes?: string;
}

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
    notes: "Priority customer",
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
    notes: "Needs review",
  },
];

export default function ContractList() {
  const [contracts, setContracts] = useState<ContractData[]>(MOCK_CONTRACTS);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleDelete = (contractNumber: string) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;
    setContracts(contracts.filter(c => c.contractNumber !== contractNumber));
  };

  // Tìm kiếm tự động
  const filteredContracts = useMemo(() => {
    return contracts.filter(c =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.contractNumber.includes(search)
    );
  }, [contracts, search]);

  return (
    <Box sx={{ ml: "240px", p: 3, minHeight: "100vh", background: "#F3F4F6" }}>
      <NavMenu />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Contract Manager
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "#1677ff", textTransform: "none", px: 2 }}
          onClick={() => navigate("/contracts/create")}
        >
          + Create Contract
        </Button>
      </Box>

      {/* Search Box */}
      <Paper
        sx={{
          p: 2,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.08)",
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên khách hàng hoặc số hợp đồng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            sx: { borderRadius: 2, height: 45, bgcolor: "#f9fafb" },
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#9ca3af" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Table */}
      <Paper
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.10)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>SỐ HỢP ĐỒNG</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>KHÁCH HÀNG</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>EMAIL</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>NGÀY BẮT ĐẦU</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>TRẠNG THÁI</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                THAO TÁC
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredContracts.map((c) => (
              <TableRow key={c.contractNumber} hover>
                <TableCell>{c.contractNumber}</TableCell>
                <TableCell>{c.customerName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.startDate}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/contracts/${c.contractNumber}/detail`)}
                  >
                    Detail
                  </Button>
                  <Button
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/contracts/${c.contractNumber}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() => handleDelete(c.contractNumber)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/contracts/${c.contractNumber}/pdf`)}
                  >
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredContracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 3 }}>
                  Không tìm thấy hợp đồng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}