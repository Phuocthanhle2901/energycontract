import {
  Box, Button, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Stack, IconButton
} from "@mui/material";

import {
  FiEdit, FiTrash2, FiEye, FiPlus
} from "react-icons/fi";

import { useState } from "react";
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<any>(null);
  const [deleteData, setDeleteData] = useState<any>(null);

  // ===============================
  // LOAD CONTRACTS
  // ===============================
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["contracts"],
    queryFn: ContractApi.getContracts,
  });

  const list = data ?? [];

  // ===============================
  // LOAD RESELLERS
  // ===============================
  const { data: resellers = [] } = useQuery<any[]>({
    queryKey: ["resellers"],
    queryFn: () => ResellerApi.getAll(0),
  });


  // ===============================
  // LOAD ADDRESSES
  // ===============================
  const { data: addresses = [] } = useQuery<any[]>({
    queryKey: ["addresses"],
    queryFn: () => AddressApi.getAll(0),
  });

  // ===============================
  // JOIN FUNCTIONS
  // ===============================
  const getResellerName = (id: any) => {
    if (!id) return "-";
    const r = resellers.find((x: any) => x.id === id);
    return r ? r.name : "-";
  };

  const getAddressText = (id: any) => {
    if (!id) return "-";
    const a = addresses.find((x: any) => x.id === id);
    if (!a) return "-";

    return `${a.zipCode} – ${a.houseNumber}${a.extension || ""}`;
  };

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

  return (
    <Box sx={{ display: "flex" }}>
      <NavMenu />

      <Box sx={{ ml: "240px", p: 3, width: "100%" }}>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Contract Management
          </Typography>

          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={openCreate}
            sx={{ fontWeight: 600 }}
          >
            Add Contract
          </Button>
        </Stack>

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
              {list.map((c: any) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.contractNumber}</TableCell>
                  <TableCell>{c.firstName} {c.lastName}</TableCell>
                  <TableCell>{c.email}</TableCell>

                  {/* 🔥 FIXED: SHOW RESELLER */}
                  <TableCell>{getResellerName(c.resellerId)}</TableCell>

                  {/* 🔥 FIXED: SHOW ADDRESS */}
                  <TableCell>{getAddressText(c.addressId)}</TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="end">
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

              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No contracts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

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