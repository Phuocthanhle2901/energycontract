import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  IconButton,
  TextField,
  Pagination,
} from "@mui/material";

import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
} from "react-icons/fi";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { ContractApi } from "@/api/contract.api";
import { ResellerApi } from "@/api/reseller.api";
import { AddressApi } from "@/api/address.api";

import toast from "react-hot-toast";
import NavMenu from "@/components/NavMenu/NavMenu";
import ContractFormDrawer from "./ContractFormDrawer";
import ContractDelete from "./ContractDelete";
import { useNavigate } from "react-router-dom";

export default function ContractList() {
  const navigate = useNavigate();

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<any>(null);
  const [deleteData, setDeleteData] = useState<any>(null);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState<any[]>([]);

  // ===============================
  // LOAD ALL DATA
  // ===============================
  const { data: allContracts = [], isLoading, refetch } = useQuery({
    queryKey: ["contracts"],
    queryFn: ContractApi.getContracts,
  });

  const { data: resellers = [] } = useQuery({
    queryKey: ["resellers"],
    queryFn: () => ResellerApi.getAll(),
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => AddressApi.getAll(),
  });

  // Helpers
  const getResellerName = (id: any) => {
    const r = resellers.find((x: any) => x.id === id);
    return r ? r.name : "-";
  };

  const getAddressText = (id: any) => {
    const a = addresses.find((x: any) => x.id === id);
    return a ? `${a.zipCode} – ${a.houseNumber}${a.extension || ""}` : "-";
  };

  // ===============================
  // SEARCH FILTER (FE)
  // ===============================
  const filteredList = useMemo(() => {
    if (!search.trim()) return allContracts;
    const keyword = search.toLowerCase();

    return allContracts.filter((c: any) => {
      return (
        c.contractNumber?.toLowerCase().includes(keyword) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(keyword) ||
        c.email?.toLowerCase().includes(keyword)
      );
    });
  }, [search, allContracts]);

  // ===============================
  // UPDATE PAGE DATA WHEN PAGE OR LIST CHANGES
  // ===============================
  useEffect(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;

    setPageData(filteredList.slice(startIdx, endIdx));
  }, [page, filteredList]);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);

  // ===============================
  // OPEN FORMS
  // ===============================
  const openCreate = () => {
    setDrawerMode("create");
    setEditData(null);
    setDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setDrawerMode("edit");
    setEditData(row);
    setDrawerOpen(true);
  };

  if (isLoading)
    return <Typography sx={{ ml: "260px", p: 3 }}>Loading...</Typography>;

  // ===============================
  // RENDER UI
  // ===============================
  return (
    <Box sx={{ display: "flex" }}>
      <NavMenu />

      <Box sx={{ ml: "240px", p: 3, width: "100%" }}>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Contract Management
          </Typography>

          <Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>
            Add Contract
          </Button>
        </Stack>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search by contract number, name or email..."
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset về page 1 khi search
          }}
        />

        {/* Table */}
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead sx={{ background: "#f8fafc" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Contract Number</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Reseller</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pageData.map((c: any) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.contractNumber}</TableCell>
                  <TableCell>{c.firstName} {c.lastName}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{getResellerName(c.resellerId)}</TableCell>
                  <TableCell>{getAddressText(c.addressId)}</TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => navigate(`/contracts/${c.id}/detail`)}>
                        <FiEye />
                      </IconButton>

                      <IconButton onClick={() => openEdit(c)}>
                        <FiEdit />
                      </IconButton>

                      <IconButton onClick={() => setDeleteData(c)} color="error">
                        <FiTrash2 />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {pageData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No contracts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* Pagination */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            color="primary"
            onChange={(e, value) => setPage(value)}
          />
        </Box>
      </Box>

      {/* Drawer Create / Edit */}
      <ContractFormDrawer
        open={drawerOpen}
        mode={drawerMode}
        initialData={editData}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => {
          toast.success("Saved");
          refetch();
        }}
      />

      {/* Delete Dialog */}
      <ContractDelete
        open={!!deleteData}
        data={deleteData}
        onClose={() => setDeleteData(null)}
        onDeleted={() => {
          toast.success("Deleted");
          refetch();
        }}
      />
    </Box>
  );
}
