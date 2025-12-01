import { Container, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import ContractFormBase from "./ContractFormBase";
import { useState } from "react";

// ⬇⬇ SỬA TẠI ĐÂY
import { MOCK_CONTRACTS, MOCK_RESELLERS } from "../../mock/mockData";

export default function ContractEdit() {
  const { id } = useParams();
  const existing = MOCK_CONTRACTS.find((c) => c.id === Number(id));

  const [contract, setContract] = useState(existing);

  if (!contract) return <div>Không tìm thấy hợp đồng.</div>;

  const handleChange = (field: string, value: any) => {
    setContract((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Updated:", contract);
    alert("Cập nhật hợp đồng thành công!");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Chỉnh sửa hợp đồng
      </Typography>

      <ContractFormBase
        contract={contract}
        resellers={MOCK_RESELLERS}
        onChange={handleChange}
      />

      <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave}>
        Lưu thay đổi
      </Button>
    </Container>
  );
}
