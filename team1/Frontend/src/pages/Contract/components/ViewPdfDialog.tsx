import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { FiX, FiRefreshCw } from "react-icons/fi";

interface ViewPdfDialogProps {
  open: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  onRegenerate: () => void;
}

export default function ViewPdfDialog({ open, onClose, pdfUrl, onRegenerate }: ViewPdfDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, px: 2 }}>
        <Typography variant="h6">View Contract PDF</Typography>
        <IconButton onClick={onClose}><FiX /></IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, height: '80vh', bgcolor: '#525659' }}>
        {pdfUrl ? (
          <iframe 
            src={pdfUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title="PDF Viewer"
          />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="white">Invalid PDF URL</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button 
            variant="outlined" 
            color="warning" 
            startIcon={<FiRefreshCw />}
            onClick={onRegenerate}
        >
            Regenerate / Edit
        </Button>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}