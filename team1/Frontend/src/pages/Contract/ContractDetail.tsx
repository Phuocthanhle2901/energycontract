// src/pages/Contract/ContractDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardHeader, CardContent, Typography, Button, Divider, Stack, Chip, Link } from "@mui/material";
import { ChevronLeft } from "lucide-react";
import NavMenu from "@/components/NavMenu/NavMenu";

interface ContractDetailType {
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

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetailType | null>(null);

  useEffect(() => {
    const mockContracts: ContractDetailType[] = [
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
        bankAccountNumber: "123456789",
        resellerId: "R101",
        addressId: "ADDR101",
        pdfLink: "https://example.com/101.pdf",
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
        bankAccountNumber: "987654321",
        resellerId: "R102",
        addressId: "ADDR102",
        pdfLink: "https://example.com/102.pdf",
        status: "Inactive",
        notes: "Needs review",
      },
      {
        contractNumber: "103",
        firstName: "Le",
        lastName: "Van C",
        customerName: "Le Van C",
        email: "c.le@example.com",
        phone: "0903456789",
        startDate: "2025-10-30",
        endDate: "2026-10-30",
        companyName: "Tech Co",
        bankAccountNumber: "555666777",
        resellerId: "R103",
        addressId: "ADDR103",
        pdfLink: "https://example.com/103.pdf",
        status: "Active",
        notes: "Standard contract",
      },
    ];

    const found = mockContracts.find(c => c.contractNumber === id);
    setContract(found || null);
  }, [id]);

  if (!contract) {
    return (
      <Box sx={{ p: 4, textAlign: "center", ml: "240px" }}>
        <Typography variant="h6">Contract not found</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/contracts/list")}>Back to List</Button>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Inactive": return "default";
      case "Pending": return "warning";
      case "Expired": return "error";
      default: return "default";
    }
  };

  return (

    <Box sx={{ p: 4, ml: "240px" }}>
      <NavMenu />
      <Button startIcon={<ChevronLeft />} variant="outlined" onClick={() => navigate("/contracts/list")}>Back to List</Button>

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: "0 4px 25px rgba(0,0,0,0.08)" }}>
        <CardHeader title={`Contract #${contract.contractNumber}`} />
        <Divider />
        <CardContent>
          <Stack spacing={1}>
            <Typography><strong>First Name:</strong> {contract.firstName}</Typography>
            <Typography><strong>Last Name:</strong> {contract.lastName}</Typography>
            <Typography><strong>Customer Name:</strong> {contract.customerName}</Typography>
            <Typography><strong>Email:</strong> {contract.email}</Typography>
            {contract.phone && <Typography><strong>Phone:</strong> {contract.phone}</Typography>}
            <Typography><strong>Start Date:</strong> {contract.startDate}</Typography>
            {contract.endDate && <Typography><strong>End Date:</strong> {contract.endDate}</Typography>}
            {contract.companyName && <Typography><strong>Company Name:</strong> {contract.companyName}</Typography>}
            {contract.bankAccountNumber && <Typography><strong>Bank Account Number:</strong> {contract.bankAccountNumber}</Typography>}
            {contract.resellerId && <Typography><strong>Reseller ID:</strong> {contract.resellerId}</Typography>}
            {contract.addressId && <Typography><strong>Address ID:</strong> {contract.addressId}</Typography>}
            {contract.pdfLink && <Typography><strong>PDF Link:</strong> <Link href={contract.pdfLink} target="_blank">{contract.pdfLink}</Link></Typography>}
            <Typography><strong>Status:</strong> <Chip label={contract.status} color={getStatusColor(contract.status)} /></Typography>
            {contract.notes && <Typography><strong>Notes:</strong> {contract.notes}</Typography>}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
