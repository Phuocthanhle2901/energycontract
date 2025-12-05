import { useNavigate, useParams } from "react-router-dom";
import { deleteContract, getContractById } from "@/services/customerService/ContractService";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import NavMenu from "@/components/NavMenu/NavMenu";

export default function ContractDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getContractById(Number(id)).then(setContract);
    }
  }, [id]);

  if (!contract) return null;

  const handleDelete = async () => {
    await deleteContract(Number(id));
    alert("Contract deleted!");
    navigate("/contracts/list");
  };

  return (
    <Box sx={{ ml: "240px", p: 3 }}>
      <NavMenu />

      <Paper sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
        <Typography variant="h5" mb={2}>
          Delete Contract
        </Typography>

        <Typography mb={3}>
          Are you sure you want to delete contract{" "}
          <b>{contract.contractNumber}</b>?
        </Typography>

        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>

        <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate("/contracts/list")}>
          Cancel
        </Button>
      </Paper>
    </Box>
  );
}
