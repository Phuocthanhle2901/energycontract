import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import { ContractApi } from "@/api/contract.api";

export default function ContractDelete({
  open,
  id,
  onClose,
  onSuccess,
}: {
  open: boolean;
  id: number | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const handleDelete = async () => {
    if (!id) return;

    try {
      await ContractApi.delete(id);
      onSuccess();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Contract</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete contract <b>#{id}</b>?
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
