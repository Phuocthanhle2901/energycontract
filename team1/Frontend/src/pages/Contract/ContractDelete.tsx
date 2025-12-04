import { useParams, useNavigate } from "react-router-dom";
import { deleteContract } from "../../services/customerService/ContractService";
import { Box, Button, Paper, Typography } from "@mui/material";
import NavMenu from "@/components/NavMenu/NavMenu";

export default function ContractDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteContract(Number(id));
    alert("Deleted!");
    navigate("/contracts/list");
  };

  return (
    <Box sx={{ ml: "240px", p: 3 }}>
      <NavMenu />

      <Paper sx={{ maxWidth: 500, p: 4 }}>
        <Typography variant="h6">Delete contract #{id}?</Typography>

        <Button sx={{ mr: 2 }} onClick={() => navigate(-1)}>
          Cancel
        </Button>

        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </Paper>
    </Box>
  );
}
