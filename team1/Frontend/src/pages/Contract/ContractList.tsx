import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
  MenuItem,
  Paper,
  InputAdornment,
} from "@mui/material";

import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiFileText,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useState } from "react";

import { useContracts } from "@/hooks/useContracts";
import { useResellers, useReseller } from "@/hooks/useResellers"; // Import useReseller
import { useGeneratePdf } from "@/hooks/usePdf";

import ContractFormDrawer from "./ContractFormDrawer";
import ContractDelete from "./ContractDelete";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate

// Component con để hiển thị tên Reseller
const ResellerCell = ({ resellerId }: { resellerId: number }) => {
  const { data: reseller, isLoading } = useReseller(resellerId);
  if (isLoading) return <span>Loading...</span>;
  return <span>{reseller?.name || "—"}</span>;
};

export default function ContractList() {
  const navigate = useNavigate(); // Hook điều hướng

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Delete popup
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [resellerId, setResellerId] = useState("");
  const [startFrom, setStartFrom] = useState("");
  const [startTo, setStartTo] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState<"customerName" | "email">("customerName");
  const [sortDesc, setSortDesc] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Data queries
  // Sửa lỗi: Đổi PageNumber -> pageNumber, PageSize -> pageSize
  const resellerQuery = useResellers({ pageNumber: 1, pageSize: 999 });

  const contractQuery = useContracts({
    search: search || undefined, // Sửa key thành lowercase 'search' khớp với interface
    resellerId: resellerId ? Number(resellerId) : undefined,
    startDateFrom: startFrom || undefined,
    startDateTo: startTo || undefined,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    sortBy: sortBy,
    sortDesc: sortDesc,
  });

  const data = contractQuery.data?.items ?? [];
  const totalPages = contractQuery.data?.totalPages ?? 1;

  const generatePdfMutation = useGeneratePdf();

  const handlePdf = (c: any) => {
    // Logic mới: Chỉ cần gửi contractId, backend tự lo
    // Hoặc map dữ liệu nếu backend chưa update
    const pdfRequest = {
        contractId: c.id, // Thêm ID để chắc chắn
        contractNumber: c.contractNumber,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        companyName: c.companyName,
        startDate: c.startDate,
        endDate: c.endDate,
        bankAccountNumber: c.bankAccountNumber,
        addressLine: "", // DTO list thường không có address chi tiết
        totalAmount: 0,
        currency: "VND",
    };

    generatePdfMutation.mutate(
      pdfRequest as any,
      {
        onSuccess: (url) => {
            if(url) window.open(url, "_blank")
        },
      }
    );
  };

  const toggleSort = (field: "customerName" | "email") => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(false);
    }
    setPage(1);
  };

  // ================================ UI ================================
  return (
    <Box sx={{ display: "flex" }}>
      <NavMenu />

      {/* MAIN AREA */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "260px" }, // Responsive margin
          p: 4,
          background: "#f5f6fa",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={3}>
          Contract Management
        </Typography>

        {/* ======================= FILTER BAR ======================= */}
        <Paper
          sx={{
            p: 3,
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": { height: 44, borderRadius: "12px" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch size={18} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filter: Reseller */}
            <TextField
              select
              size="small"
              value={resellerId}
              onChange={(e) => setResellerId(e.target.value)}
              sx={{
                width: 180,
                "& .MuiOutlinedInput-root": { height: 44, borderRadius: "12px" },
              }}
              label="Reseller"
            >
              <MenuItem value="">All</MenuItem>
              {resellerQuery.data?.items?.map((r: any) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Date filters */}
            <TextField
              type="date"
              size="small"
              label="Start Date From"
              InputLabelProps={{ shrink: true }}
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
              sx={{
                width: 160,
                "& .MuiOutlinedInput-root": { height: 44, borderRadius: "12px" },
              }}
            />

            <TextField
              type="date"
              size="small"
              label="Start Date To"
              InputLabelProps={{ shrink: true }}
              value={startTo}
              onChange={(e) => setStartTo(e.target.value)}
              sx={{
                width: 160,
                "& .MuiOutlinedInput-root": { height: 44, borderRadius: "12px" },
              }}
            />

            <Button variant="contained" sx={{ height: 44 }} onClick={() => contractQuery.refetch()}>
              APPLY
            </Button>

            <Button variant="outlined" sx={{ height: 44 }} onClick={() => { setSearch(""); setResellerId(""); setStartFrom(""); setStartTo(""); contractQuery.refetch(); }}>
              CLEAR
            </Button>

            <Button
              variant="contained"
              startIcon={<FiPlus />}
              sx={{ height: 44 }}
              onClick={() => {
                setDrawerMode("create");
                setCurrentId(null);
                setDrawerOpen(true);
              }}
            >
              CREATE
            </Button>
          </Stack>
        </Paper>
        {/* ======================= TABLE ======================= */}
        <Paper
          sx={{
            p: 0,
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >

          {/* ======================= HEADER ======================= */}
          <Stack
            direction="row"
            px={2.2}
            py={1.4}
            sx={{
              fontWeight: 600,
              color: "#555",
              background: "#fafafa",
              borderBottom: "1px solid #e5e7eb",
              fontSize: "14px",
            }}
          >
            <Box sx={{ flex: 1 }}>Contract No.</Box>

            <Box
              sx={{ flex: 1.4, display: "flex", alignItems: "center", cursor: "pointer", gap: 0.4 }}
              onClick={() => toggleSort("customerName")}
            >
              Name
              {sortBy === "customerName"
                ? sortDesc ? <FiChevronDown size={13} /> : <FiChevronUp size={13} />
                : <FiChevronDown size={13} style={{ opacity: 0.25 }} />}
            </Box>

            <Box
              sx={{ flex: 1.6, display: "flex", alignItems: "center", cursor: "pointer", gap: 0.4 }}
              onClick={() => toggleSort("email")}
            >
              Email
              {sortBy === "email"
                ? sortDesc ? <FiChevronDown size={13} /> : <FiChevronUp size={13} />
                : <FiChevronDown size={13} style={{ opacity: 0.25 }} />}
            </Box>

            <Box sx={{ flex: 1.1 }}>Reseller</Box>
            <Box sx={{ flex: 0.8 }}>Start</Box>
            <Box sx={{ flex: 0.8 }}>End</Box>

            <Box sx={{ width: 120, textAlign: "center" }}>Actions</Box>
          </Stack>

          {/* ======================= ROWS ======================= */}
          {data.map((c: any) => (
            <Stack
              key={c.id}
              direction="row"
              px={2.2}
              py={1.6}
              sx={{
                alignItems: "center",
                borderBottom: "1px solid #f1f1f1",
                background: "#fff",
                "&:hover": { background: "#f7f9fc" },
              }}
            >
              <Box sx={{ flex: 1, fontWeight: 500, color: "primary.main", cursor: "pointer" }} onClick={() => navigate(`/contracts/${c.id}/detail`)}>
                  {c.contractNumber}
              </Box>
              <Box sx={{ flex: 1.4 }}>{c.firstName} {c.lastName}</Box> {/* Sửa customerName */}
              <Box sx={{ flex: 1.6 }}>{c.email}</Box>
              
              {/* Sửa resellerName bằng Component con */}
              <Box sx={{ flex: 1.1 }}>
                  <ResellerCell resellerId={c.resellerId} />
              </Box>

              <Box sx={{ flex: 0.8 }}>{c.startDate ? new Date(c.startDate).toLocaleDateString() : "-"}</Box>
              <Box sx={{ flex: 0.8 }}>{c.endDate ? new Date(c.endDate).toLocaleDateString() : "-"}</Box>

              <Stack direction="row" spacing={0.5} sx={{ width: 120, justifyContent: "center" }}>
                <IconButton size="small" onClick={() => handlePdf(c)} title="Generate PDF">
                  <FiFileText size={16} />
                </IconButton>

                <IconButton size="small" onClick={() => { setDrawerMode("edit"); setCurrentId(c.id); setDrawerOpen(true); }} title="Edit">
                  <FiEdit size={16} />
                </IconButton>

                <IconButton size="small" color="error" onClick={() => { setDeleteId(c.id); setDeleteOpen(true); }} title="Delete">
                  <FiTrash2 size={16} />
                </IconButton>
              </Stack>
            </Stack>
          ))}


          {/* PAGINATION */}
          <Stack direction="row" justifyContent="space-between" px={2} py={2}>
            <Typography sx={{ color: "#777" }}>
              Showing {data.length} of {contractQuery.data?.totalCount ?? 0}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>

              <Typography sx={{ display: "flex", alignItems: "center" }}>Page {page} / {totalPages}</Typography>

              <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* POPUPS */}
        <ContractFormDrawer
          open={drawerOpen}
          mode={drawerMode}
          id={currentId}
          onClose={() => setDrawerOpen(false)}
          onSuccess={() => {
            setDrawerOpen(false);
            contractQuery.refetch();
          }}
        />

        <ContractDelete
          open={deleteOpen}
          id={deleteId}
          onClose={() => setDeleteOpen(false)}
          onSuccess={() => {
            setDeleteOpen(false);
            contractQuery.refetch();
          }}
        />
      </Box>
    </Box>
  );
}
