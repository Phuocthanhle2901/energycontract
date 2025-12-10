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
import NavMenu from "@/components/NavMenu/NavMenu";

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  return (
    <Box sx={{ display: "flex" }}>
      <NavMenu />

      <Box
        sx={{
          ml: "240px",
          p: 4,
          width: "100%",
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
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Contract #{contract.contractNumber}
            </Typography>

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

              <DetailRow label="PDF Link" value={contract.pdfLink || "PDF Link"} />
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}

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
