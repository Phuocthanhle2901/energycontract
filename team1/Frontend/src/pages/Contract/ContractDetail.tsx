import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  CircularProgress
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import { FiArrowLeft, FiFileText } from "react-icons/fi";

import { useContract } from "@/hooks/useContracts";
import { useGeneratePdf } from "@/hooks/usePdf";
import { useReseller } from "@/hooks/useResellers"; // Import hook

export default function ContractDetail() {
  const { id } = useParams();
  const contractId = Number(id);

  const navigate = useNavigate();

  const { data: contract, isLoading: isLoadingContract } = useContract(contractId);
  
  // Fetch Reseller info
  const { data: reseller, isLoading: isLoadingReseller } = useReseller(contract?.resellerId ?? 0);

  const pdfMutation = useGeneratePdf();

  if (isLoadingContract) return <Box p={3}>Loading contract...</Box>;
  if (!contract) return <Box p={3}>Contract not found</Box>;

  const handleGeneratePdf = () => {
    const pdfRequest = {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        firstName: contract.firstName,
        lastName: contract.lastName,
        email: contract.email,
        phone: contract.phone,
        companyName: contract.companyName || "",
        startDate: contract.startDate,
        endDate: contract.endDate,
        bankAccountNumber: contract.bankAccountNumber || "",
        addressLine: "", // Placeholder
        totalAmount: 0,
        currency: "VND",
    };

    pdfMutation.mutate(
      pdfRequest as any,
      {
        onSuccess: (url) => {
          if (url) window.open(url, "_blank");
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
          Contract Detail #{contract.contractNumber}
        </Typography>

        <Chip
          label={isLoadingReseller ? "Loading..." : (reseller?.name || "Unknown Reseller")}
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
            <Typography><b>Name:</b> {contract.firstName} {contract.lastName}</Typography>
            <Typography><b>Email:</b> {contract.email}</Typography>
            <Typography><b>Phone:</b> {contract.phone}</Typography>
            <Typography><b>Company:</b> {contract.companyName || "N/A"}</Typography>
            <Typography><b>Bank Account:</b> {contract.bankAccountNumber || "N/A"}</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" mb={1}>
            Contract Info
          </Typography>

          <Stack spacing={1} mb={2}>
            <Typography><b>Contract Number:</b> {contract.contractNumber}</Typography>
            <Typography><b>Start Date:</b> {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A"}</Typography>
            <Typography><b>End Date:</b> {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "N/A"}</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" mb={1}>
            Address
          </Typography>
          <Typography mb={2} color="text.secondary">
            {/* Placeholder vì DTO chưa có thông tin chi tiết địa chỉ */}
            Address details not available in current view.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={pdfMutation.isPending ? <CircularProgress size={20} color="inherit"/> : <FiFileText />}
              onClick={handleGeneratePdf}
              disabled={pdfMutation.isPending}
            >
              {pdfMutation.isPending ? "Generating..." : "Generate PDF"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(`/orders?contractId=${contract.id}`)}
            >
              View Orders
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(`/contracts/${contract.id}/pdf`)}
            >
              Preview PDF
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
