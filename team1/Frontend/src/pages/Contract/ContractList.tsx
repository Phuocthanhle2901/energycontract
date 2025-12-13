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
} from "react-icons/fi";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useState } from "react";

import { useContracts } from "@/hooks/useContracts";
import { useResellers } from "@/hooks/useResellers";
import { useGeneratePdf } from "@/hooks/usePdf";

import ContractFormDrawer from "./ContractFormDrawer";
import ContractDelete from "./ContractDelete";

export default function ContractList() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // --- State cho Input (Chưa gọi API ngay) ---
  const [tempSearch, setTempSearch] = useState("");
  const [tempResellerId, setTempResellerId] = useState("");
  const [tempStartFrom, setTempStartFrom] = useState("");
  const [tempStartTo, setTempStartTo] = useState("");

  // --- State thực tế để Query (Khi bấm Apply mới cập nhật vào đây) ---
  const [queryParams, setQueryParams] = useState({
    search: "",
    resellerId: "",
    startFrom: "",
    startTo: "",
    page: 1,
  });

  const PAGE_SIZE = 10;

  // Lấy danh sách Reseller cho Dropdown
  const resellerQuery = useResellers({ pageNumber: 1, pageSize: 999 });

  // Hook lấy danh sách Contract
  const contractQuery = useContracts({
    pageNumber: queryParams.page,
    pageSize: PAGE_SIZE,
    search: queryParams.search || undefined,
    // Chuyển đổi string sang number/undefined cho resellerId
    resellerId: queryParams.resellerId ? Number(queryParams.resellerId) : undefined,
    // Truyền date string (YYYY-MM-DD) trực tiếp nếu backend nhận DateTime?
    startDateFrom: queryParams.startFrom || undefined,
    startDateTo: queryParams.startTo || undefined,
  });

  const data = contractQuery.data?.items ?? [];
  const totalPages = Math.ceil((contractQuery.data?.totalCount ?? 0) / PAGE_SIZE) || 1;

  const generatePdfMutation = useGeneratePdf();
  const handlePdf = (contract: any) => {
    generatePdfMutation.mutate(contract.id);
  }

  // Hàm xử lý khi bấm APPLY
  const handleApplyFilter = () => {
    setQueryParams({
      ...queryParams,
      search: tempSearch,
      resellerId: tempResellerId,
      startFrom: tempStartFrom,
      startTo: tempStartTo,
      page: 1, // Reset về trang 1 khi filter
    });
  };

  // Hàm xử lý khi bấm CLEAR
  const handleClearFilter = () => {
    setTempSearch("");
    setTempResellerId("");
    setTempStartFrom("");
    setTempStartTo("");

    setQueryParams({
      search: "",
      resellerId: "",
      startFrom: "",
      startTo: "",
      page: 1,
    });
  };

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
        <Typography variant="h5" fontWeight={700} mb={2}>
          Contract List
        </Typography>

        {/* FILTER CARD */}
        <Paper
          sx={{
            p: 3,
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {/* SEARCH BAR */}
            <TextField
              size="small"
              placeholder="Search by name or email..."
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
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

            {/* RESELLER */}
            <TextField
              select
              size="small"
              value={tempResellerId}
              onChange={(e) => setTempResellerId(e.target.value)}
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

            {/* DATE FROM */}
            <TextField
              type="date"
              size="small"
              label="Start Date From"
              InputLabelProps={{ shrink: true }}
              value={tempStartFrom}
              onChange={(e) => setTempStartFrom(e.target.value)}
              sx={{
                width: 160,
                "& .MuiOutlinedInput-root": { height: 44, borderRadius: "12px" },
              }}
            />

            {/* DATE TO */}
            <TextField
              type="date"
              size="small"
              label="Start Date To"
              InputLabelProps={{ shrink: true }}
              value={tempStartTo}
              onChange={(e) => setTempStartTo(e.target.value)}
              sx={{
                width: 160,
                "& .MuiOutlinedInput-root": { height: 44, borderRadius: "12px" },
              }}
            />

            <Button variant="contained" sx={{ height: 44, px: 3 }} onClick={handleApplyFilter}>
              APPLY
            </Button>

            <Button
              variant="outlined"
              sx={{ height: 44, px: 3 }}
              onClick={handleClearFilter}
            >
              CLEAR
            </Button>

            <Button
              variant="contained"
              startIcon={<FiPlus />}
              sx={{ height: 44, px: 3, borderRadius: "10px" }}
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

        {/* TABLE CARD */}
        <Paper
          sx={{
            p: 2,
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* HEADER */}
          <Stack direction="row" px={2} py={1.5} sx={{ fontWeight: 600, color: "#555" }}>
            <Box sx={{ flex: 2 }}>Name</Box>
            <Box sx={{ flex: 2 }}>Email</Box>
            <Box sx={{ flex: 1.5 }}>Reseller</Box>
            <Box sx={{ flex: 1 }}>Start</Box>
            <Box sx={{ flex: 1 }}>End</Box>
            <Box sx={{ width: 70 }}>PDF</Box>
            <Box sx={{ width: 100 }}>Actions</Box>
          </Stack>

          {/* DATA ROWS */}
          {contractQuery.isLoading ? (
             <Box p={3} textAlign="center">Loading...</Box>
          ) : (
            data.map((c: any) => (
              <Box
                key={c.id}
                sx={{
                  display: "flex",
                  px: 2,
                  py: 1.5,
                  borderRadius: "12px",
                  background: "#fff",
                  mb: 1,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  "&:hover": { background: "#f9fafc" },
                }}
              >
                <Box sx={{ flex: 2 }}>{c.customerName}</Box>
                <Box sx={{ flex: 2 }}>{c.email}</Box>
                <Box sx={{ flex: 1.5 }}>{c.resellerName}</Box>
                <Box sx={{ flex: 1 }}>{c.startDate?.split("T")[0]}</Box>
                <Box sx={{ flex: 1 }}>{c.endDate?.split("T")[0]}</Box>

                <Box sx={{ width: 70 }}>
                  <IconButton onClick={() => handlePdf(c)} disabled={generatePdfMutation.isPending}>
                    <FiFileText />
                  </IconButton>
                </Box>

                <Stack direction="row" spacing={1} sx={{ width: 100 }}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setDrawerMode("edit");
                      setCurrentId(c.id);
                      setDrawerOpen(true);
                    }}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeleteId(c.id);
                      setDeleteOpen(true);
                    }}
                  >
                    <FiTrash2 />
                  </IconButton>
                </Stack>
              </Box>
            ))
          )}

          {/* PAGINATION */}
          <Stack direction="row" justifyContent="space-between" px={2} py={2}>
            <Typography sx={{ color: "#777" }}>
              Showing {data.length} of {contractQuery.data?.totalCount ?? 0}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                disabled={queryParams.page <= 1}
                onClick={() => setQueryParams(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                PREVIOUS
              </Button>

              <Typography>Page {queryParams.page} / {totalPages}</Typography>

              <Button
                variant="outlined"
                disabled={queryParams.page >= totalPages}
                onClick={() => setQueryParams(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                NEXT
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
            // Không cần gọi refetch() thủ công vì useCreateContract/useUpdateContract
            // đã invalidate query 'contracts' rồi.
          }}
        />

        <ContractDelete
          open={deleteOpen}
          id={deleteId}
          onClose={() => setDeleteOpen(false)}
          onSuccess={() => {
            setDeleteOpen(false);
            // Tương tự, không cần refetch thủ công
          }}
        />
      </Box>
    </Box>
  );
}
