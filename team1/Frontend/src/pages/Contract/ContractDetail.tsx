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

import NavMenu from "@/components/NavMenu/NavMenu";

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  return (
    <Box sx={{ display: "flex" }}>
      <NavMenu />

      <Box
        sx={{
          ml: "240px",
          p: 4,
          width: "100%",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* ==== HEADER ==== */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Contract #{contract.contractNumber}
            </Typography>
            <Typography sx={{ color: "#6b7280" }}>
              Detailed contract overview
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={() => navigate(`/contracts/${id}/history`)}>
              HISTORY
            </Button>
            <Button variant="outlined">EXPORT PDF</Button>
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
    </Box>
  );
}

/* =================================================================== */
/* ========================== COMPONENTS ============================== */
/* =================================================================== */

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
    </Box>
  );
}

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
