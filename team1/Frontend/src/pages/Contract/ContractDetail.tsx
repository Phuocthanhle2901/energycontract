<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContractById } from "@/services/customerService/ContractService";
import type { ContractResponse } from "@/types/contract";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Button,
  Chip,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

=======
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ContractApi } from "@/api/contract.api";
import { AddressApi } from "@/api/address.api";
import { ResellerApi } from "@/api/reseller.api";

import { FiClock, FiEdit, FiFileText, FiArrowLeft } from "react-icons/fi";
>>>>>>> intern2025-team1
import NavMenu from "@/components/NavMenu/NavMenu";

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD

  const [contract, setContract] = useState<ContractResponse | null>(null);

  useEffect(() => {
    if (id) {
      getContractById(Number(id)).then((res) => setContract(res));
    }
  }, [id]);

  if (!contract)
    return (
      <Box sx={{ ml: "240px", p: 4 }}>
        <NavMenu />
        <Typography>Loading...</Typography>
      </Box>
    );

  const isActive =
    new Date(contract.endDate).getTime() > new Date().getTime();
=======
  const numericId = Number(id);

  // ============================
  // FETCH CONTRACT
  // ============================
  const { data: contract, isLoading } = useQuery({
    queryKey: ["contract", numericId],
    enabled: !!numericId,
    queryFn: () => ContractApi.getById(numericId),
  });

  // FETCH ADDRESS LIST
  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => AddressApi.getAll(),
  });

  // FETCH RESELLER LIST
  const { data: resellers = [] } = useQuery({
    queryKey: ["resellers"],
    queryFn: () => ResellerApi.getAll(),
  });

  if (isLoading)
    return <Typography sx={{ ml: "260px", p: 3 }}>Loading...</Typography>;

  if (!contract)
    return (
      <Typography sx={{ ml: "260px", p: 3 }}>Contract not found</Typography>
    );

  // JOIN DATA
  const address = addresses.find((a: any) => a.id === contract.addressId);
  const reseller = resellers.find((r: any) => r.id === contract.resellerId);
>>>>>>> intern2025-team1

  return (
    <Box sx={{ display: "flex" }}>
      <NavMenu />

      <Box
        sx={{
          ml: "240px",
          p: 4,
          width: "100%",
<<<<<<< HEAD
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* ==== HEADER ==== */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
=======
          background: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        {/* 🔙 BACK BUTTON */}
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate("/contracts/list")}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        {/* ============================
            HEADER
        ============================ */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
>>>>>>> intern2025-team1
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Contract #{contract.contractNumber}
            </Typography>
<<<<<<< HEAD
            <Typography sx={{ color: "#6b7280" }}>
              Detailed contract overview
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={() => navigate(`/contracts/${id}/history`)}>
              HISTORY
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/contracts/${contract.id}/pdf`)

            }>EXPORT PDF</Button>
            <Button variant="contained">EDIT</Button>
          </Stack>
        </Stack>

        {/* ==== STATUS ==== */}
        <Chip
          label={isActive ? "Active" : "Expired"}
          sx={{
            mb: 4,
            px: 2,
            py: 0.7,
            fontWeight: 700,
            fontSize: "0.9rem",
            background: isActive
              ? "linear-gradient(135deg, #4ade80, #16a34a)"
              : "linear-gradient(135deg, #fda4af, #dc2626)",
            color: "white",
          }}
        />

        {/* ==== 2 COLUMN INFO ===== */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <InfoCard title="Customer Information">
              <Info label="Full name" value={`${contract.firstName} ${contract.lastName}`} />
              <Info label="Email" value={contract.email} />
              <Info label="Phone" value={contract.phone || "—"} />
              <Info label="Company" value={contract.companyName || "—"} />
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <InfoCard title="Contract Information">
              <Info label="Start date" value={format(contract.startDate)} />
              <Info label="End date" value={format(contract.endDate)} />
              <Info label="Address ID" value={contract.addressId} />
              <Info label="Reseller ID" value={contract.resellerId} />
            </InfoCard>
          </Grid>
        </Grid>

        {/* ===== ORDERS TABLE ===== */}
        <InfoCard title="Orders" sx={{ mt: 3 }}>
          {contract.orders?.length === 0 ? (
            <Typography sx={{ py: 2, color: "#6b7280" }}>
              No orders found.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell>Order #</HeaderCell>
                  <HeaderCell>Type</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Start</HeaderCell>
                  <HeaderCell>End</HeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {contract.orders?.map((o) => (
                  <TableRow
                    key={o.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f3f4f6" } }}
                  >
                    <TableCell>{o.orderNumber}</TableCell>
                    <TableCell>{o.orderType}</TableCell>
                    <TableCell>
                      <Chip size="small" label={o.status} sx={{ background: "#e5e7eb" }} />
                    </TableCell>
                    <TableCell>{format(o.startDate)}</TableCell>
                    <TableCell>{format(o.endDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </InfoCard>

        <Button onClick={() => navigate("/contracts/list")} sx={{ mt: 3 }}>
          ← BACK
        </Button>
      </Box>
    </Box >
  );
}

/* ========================== COMPONENTS ============================== */

function InfoCard({ title, children, sx }: any) {
  return (
    <Card
      sx={{
        borderRadius: 2.5,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
        ...sx,
      }}
    >
      <CardContent>
        <Typography fontWeight={700} sx={{ mb: 1.5 }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
        {value}
      </Typography>
=======

            <Typography sx={{ color: "#6b7280" }}>
              Detailed information of this contract
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<FiFileText />}
              onClick={() => navigate(`/contracts/${numericId}/pdf`)}
            >
              View PDF
            </Button>

            <Button
              variant="outlined"
              startIcon={<FiClock />}
              onClick={() => navigate(`/contracts/${numericId}/history`)}
            >
              View History
            </Button>

            {/* <Button
              variant="outlined"
              startIcon={<FiEdit />}
              onClick={() => navigate(`/contracts/${numericId}/edit`)}
            >
              Edit Contract
            </Button> */}
          </Stack>
        </Stack>

        {/* ============================
            DETAIL CARD
        ============================ */}
        <Paper
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Contract Details
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Table>
            <TableBody>
              <DetailRow
                label="Full Name"
                value={`${contract.firstName} ${contract.lastName}`}
              />
              <DetailRow label="Email" value={contract.email} />
              <DetailRow label="Phone" value={contract.phone || "-"} />
              <DetailRow label="Company" value={contract.companyName || "-"} />

              {/* Address */}
              <DetailRow
                label="Address"
                value={
                  address
                    ? `${address.zipCode} — ${address.houseNumber} ${address.extension || ""}`
                    : "-"
                }
              />

              {/* Reseller */}
              <DetailRow
                label="Reseller"
                value={
                  reseller ? `${reseller.name} (${reseller.type})` : "-"
                }
              />

              <DetailRow
                label="Start Date"
                value={contract.startDate?.slice(0, 10)}
              />
              <DetailRow
                label="End Date"
                value={contract.endDate?.slice(0, 10) || "-"}
              />

              <DetailRow
                label="Bank Account"
                value={contract.bankAccountNumber || "-"}
              />

              <DetailRow label="Notes" value={contract.notes || "No notes"} />
            </TableBody>
          </Table>
        </Paper>
      </Box>
>>>>>>> intern2025-team1
    </Box>
  );
}

<<<<<<< HEAD
function HeaderCell({ children }: any) {
  return (
    <TableCell
      sx={{
        fontWeight: 700,
        fontSize: "0.85rem",
        color: "#374151",
        textTransform: "uppercase",
      }}
    >
      {children}
    </TableCell>
  );
}

function format(date: string) {
  return new Date(date).toLocaleDateString("vi-VN");
}
=======
/* ============================
   ROW COMPONENT
============================ */
function DetailRow({ label, value }: any) {
  return (
    <TableRow>
      <TableCell
        sx={{
          width: 240,
          fontWeight: 600,
          borderBottom: "1px solid #e5e7eb",
          color: "#374151",
          background: "#fafafa",
        }}
      >
        {label}
      </TableCell>

      <TableCell
        sx={{
          fontWeight: 500,
          borderBottom: "1px solid #e5e7eb",
          color: "#111827",
        }}
      >
        {value}
      </TableCell>
    </TableRow>
  );
}
>>>>>>> intern2025-team1
