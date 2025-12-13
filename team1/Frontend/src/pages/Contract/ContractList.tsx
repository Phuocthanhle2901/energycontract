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
import { useResellers } from "@/hooks/useResellers";
import { useGeneratePdf } from "@/hooks/usePdf";

import ContractFormDrawer from "./ContractFormDrawer";
import ContractDelete from "./ContractDelete";

export default function ContractList() {
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
  const resellerQuery = useResellers({ PageNumber: 1, PageSize: 999 });

  const contractQuery = useContracts({
    Search: search || undefined,
    ResellerId: resellerId || undefined,
    StartDateFrom: startFrom || undefined,
    StartDateTo: startTo || undefined,
    PageNumber: page,
    PageSize: PAGE_SIZE,
    SortBy: sortBy,
    SortDesc: sortDesc,
  });

  const data = contractQuery.data?.items ?? [];
  const totalPages = contractQuery.data?.totalPages ?? 1;

  const generatePdfMutation = useGeneratePdf();

  const handlePdf = (c: any) => {
    generatePdfMutation.mutate(
      {
        contractNumber: c.contractNumber,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        companyName: c.companyName,
        startDate: c.startDate,
        endDate: c.endDate,
        bankAccountNumber: c.bankAccountNumber,
        addressLine: `${c.addressHouseNumber} - ${c.addressZipCode}`,
        totalAmount: 0,
        currency: "EUR",
      },
      {
        onSuccess: (res) => window.open(res.pdfUrl, "_blank"),
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
          ml: "240px",
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
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
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
              label={
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <FiFilter size={16} /> Reseller
                </span>
              }
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
              CREATE CONTRACT
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

            <Box sx={{ width: 90, textAlign: "center" }}>Actions</Box>
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
              <Box sx={{ flex: 1 }}>{c.contractNumber}</Box>
              <Box sx={{ flex: 1.4 }}>{c.customerName}</Box>
              <Box sx={{ flex: 1.6 }}>{c.email}</Box>
              <Box sx={{ flex: 1.1 }}>{c.resellerName}</Box>

              <Box sx={{ flex: 0.8 }}>{c.startDate?.split("T")[0]}</Box>
              <Box sx={{ flex: 0.8 }}>{c.endDate?.split("T")[0]}</Box>

              <Stack direction="row" spacing={0.5} sx={{ width: 90, justifyContent: "center" }}>
                <IconButton size="small" onClick={() => handlePdf(c)}>
                  <FiFileText size={16} />
                </IconButton>

                <IconButton size="small" onClick={() => { setDrawerMode("edit"); setCurrentId(c.id); setDrawerOpen(true); }}>
                  <FiEdit size={16} />
                </IconButton>

                <IconButton size="small" color="error" onClick={() => { setDeleteId(c.id); setDeleteOpen(true); }}>
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

              <Typography>Page {page} / {totalPages}</Typography>

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
