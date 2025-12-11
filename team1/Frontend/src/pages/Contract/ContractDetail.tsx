import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import { FiArrowLeft, FiFileText } from "react-icons/fi";

import { useContract } from "@/hooks/useContracts";
import { useGeneratePdf } from "@/hooks/usePdf";

export default function ContractDetail() {
  const { id } = useParams();
  const contractId = Number(id);

  const navigate = useNavigate();

  const { data: contract, isLoading } = useContract(contractId);
  const pdfMutation = useGeneratePdf();

  if (isLoading) return <Box p={3}>Loading...</Box>;
  if (!contract) return <Box p={3}>Not found</Box>;

  const handleGeneratePdf = () => {
    pdfMutation.mutate(
      {
        contractNumber: contract.contractNumber,
        firstName: contract.firstName,
        lastName: contract.lastName,
        email: contract.email,
        phone: contract.phone,
        companyName: contract.companyName,
        startDate: contract.startDate,
        endDate: contract.endDate,
        bankAccountNumber: contract.bankAccountNumber,
        addressLine:
          `${contract.addressHouseNumber} - ${contract.addressZipCode}`,
        totalAmount: 0,
        currency: "EUR",
      },
      {
        onSuccess: (res) => {
          if (res.pdfUrl) window.open(res.pdfUrl, "_blank");
        },
      }
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Button startIcon={<FiArrowLeft />} onClick={() => navigate(-1)}>
          Back
        </Button>

        <Typography variant="h5" fontWeight="bold">
          Contract Detail #{contract.id}
        </Typography>

        <Chip
          label={contract.resellerName}
          color="primary"
          variant="outlined"
          sx={{ ml: "auto" }}
        />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* MAIN CONTENT */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Customer Info
          </Typography>

          <Stack spacing={1} mb={2}>
            <Typography><b>Name:</b> {contract.customerName}</Typography>
            <Typography><b>Email:</b> {contract.email}</Typography>
            <Typography><b>Phone:</b> {contract.phone}</Typography>
            <Typography><b>Company:</b> {contract.companyName}</Typography>
            <Typography><b>Bank Account:</b> {contract.bankAccountNumber}</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" mb={1}>
            Contract Info
          </Typography>

          <Stack spacing={1} mb={2}>
            <Typography><b>Contract Number:</b> {contract.contractNumber}</Typography>
            <Typography><b>Start Date:</b> {contract.startDate.split("T")[0]}</Typography>
            <Typography><b>End Date:</b> {contract.endDate.split("T")[0]}</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" mb={1}>
            Address
          </Typography>
          <Typography mb={2}>
            {contract.addressHouseNumber} - {contract.addressZipCode}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<FiFileText />}
              onClick={handleGeneratePdf}
            >
              Generate PDF
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(`/orders?contractId=${contract.id}`)}
            >
              View Orders
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(`/contracts/history/${contract.id}`)}
            >
              View History
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
