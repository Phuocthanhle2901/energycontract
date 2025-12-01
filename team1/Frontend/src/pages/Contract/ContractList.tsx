import {
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { Edit, Delete, PictureAsPdf, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NavMenu from "@/components/NavMenu/NavMenu";

// =============================
// DATA STRUCTURE
// =============================
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

// =============================
// COMPONENT
// =============================
export default function ContractList() {
  const navigate = useNavigate();

  // search + filter
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // filtered list
  const filtered = MOCK_CONTRACTS.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch =
      c.contractNumber.toLowerCase().includes(s) ||
      c.customerName.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s);

    const matchStatus = status === "all" ? true : c.status === status;

    return matchSearch && matchStatus;
  });

  // Tìm kiếm tự động
  const filteredContracts = useMemo(() => {
    return contracts.filter(c =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.contractNumber.includes(search)
    );
  }, [contracts, search]);

  return (
    <Container sx={{ mt: 4 }}>
      <NavMenu />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={700}>
          Quản lý Hợp đồng
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "#1677ff", textTransform: "none", px: 2 }}
          onClick={() => navigate("/contracts/create")}
        >
          + Thêm Hợp đồng
        </Button>
      </Box>

      {/* Filter Box */}
      <Paper
        sx={{
          p: 2,
          mt: 3,
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Box display="flex" gap={2}>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên, số hợp đồng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              sx: { borderRadius: 2, height: 45, bgcolor: "#f9fafb" },
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Status */}
          <TextField
            select
            sx={{ width: 200 }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            InputProps={{ sx: { borderRadius: 2, height: 45 } }}
          >
            <MenuItem value="all">Tất cả trạng thái</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="expired">Hết hạn</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Table */}
      <Paper
        sx={{
          mt: 3,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.10)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>SỐ HỢP ĐỒNG</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>KHÁCH HÀNG</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>EMAIL</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>NGÀY BẮT ĐẦU</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ĐẠI LÝ</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                THAO TÁC
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((c) => (
              <TableRow hover key={c.contractNumber}>
                <TableCell sx={{ fontWeight: 600 }}>{c.contractNumber}</TableCell>

                <TableCell>{c.customerName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.startDate}</TableCell>

                <TableCell>
                  <Chip
                    label={c.resellerName}
                    sx={{
                      bgcolor: "#e8f1ff",
                      color: "#2563eb",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    onClick={() => navigate(`/contracts/edit/${c.contractNumber}`)}
                    sx={{ color: "#6b7280", "&:hover": { color: "#1677ff" } }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate(`/contracts/delete/${c.contractNumber}`)}
                    sx={{ color: "#6b7280", "&:hover": { color: "#ef4444" } }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate(`/contracts/${c.contractNumber}/pdf`)}
                    sx={{ color: "#6b7280", "&:hover": { color: "#0ea5e9" } }}
                  >
                    <PictureAsPdf fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          borderTop="1px solid #e5e7eb"
        >
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Hiển thị {filtered.length} kết quả
          </Typography>

          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small">
              Trước
            </Button>
            <Button variant="contained" size="small" sx={{ bgcolor: "#1677ff" }}>
              1
            </Button>
            <Button variant="outlined" size="small">
              Sau
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
