import { useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import ContractFormBase from "./ContractFormBase";




const emptyContract: Contract = {
  id: 0,
  contract_number: "",
  start_date: "",
  end_date: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  company_name: "",
  bank_account_number: "",
  reseller_id: 1,
  address: {
    zipcode: "",
    housenumber: "",
    extension: "",
    street: "",
    city: "",
  },
  orders: [],
  history: [],
  pdf_link: "",
};

export default function ContractCreate() {
  const [contract, setContract] = useState<Contract>(emptyContract);

  const handleChange = (field: string, value: any) => {
    setContract((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("New Contract: ", contract);
    alert("Tạo hợp đồng thành công!");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Tạo hợp đồng mới
      </Typography>

      <ContractFormBase
        contract={contract}
        resellers={MOCK_RESELLERS}
        onChange={handleChange}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Lưu hợp đồng
      </Button>
    </Container>
  );
}
