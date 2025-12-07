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
        </Typography>
      </DialogContent>

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
  );
}
