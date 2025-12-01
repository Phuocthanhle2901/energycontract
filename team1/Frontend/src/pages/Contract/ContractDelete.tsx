import { Button, Container, Paper, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";


export default function ContractDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contract = MOCK_CONTRACTS.find((c) => c.id === Number(id));

  if (!contract) return <div>Không tìm thấy hợp đồng.</div>;

  const handleDelete = () => {
    alert(`Đã xoá hợp đồng ${contract.contract_number}`);
    navigate("/contracts/list");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Xác nhận xoá hợp đồng
        </Typography>

        <Typography>
          Bạn có chắc muốn xoá hợp đồng{" "}
          <strong>{contract.contract_number}</strong>?
        </Typography>

        <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Huỷ
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xoá
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
