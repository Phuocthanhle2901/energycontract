<<<<<<< HEAD
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
=======
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography
} from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractApi } from "@/api/contract.api";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function ContractDelete({ open, onClose, data, onDeleted }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => ContractApi.delete(id),
    onSuccess: () => {
      toast.success("Contract deleted");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      onDeleted?.();
      onClose();
    },
    onError: () => toast.error("Delete failed"),
  });

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Contract</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete contract {" "}
          <strong>{data.contractNumber}</strong>?
>>>>>>> intern2025-team1
        </Typography>
      </DialogContent>

<<<<<<< HEAD
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>

        <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate("/contracts/list")}>
          Cancel
        </Button>
      </Paper>
    </Box>
=======
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => mutation.mutate(data.id)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
>>>>>>> intern2025-team1
  );
}
