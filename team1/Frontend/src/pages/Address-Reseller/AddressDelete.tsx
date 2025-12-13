import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import { useAddressForm } from "@/hooks/useAddressForm";

export default function AddressDelete({ open, onClose, onDeleted, data }: any) {
    const { submitDelete, loading } = useAddressForm();

    const handleDelete = () => {
        submitDelete(data.id, () => {
            onDeleted?.();
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Delete Address</DialogTitle>

            <DialogContent>
                <Typography>Are you sure you want to delete this address?</Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
