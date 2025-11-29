import React, { useState } from "react";
import { createContract } from "../../api/contract.api";
import type { ContractCreateInput } from "../../api/contract.api";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

// import NavMenu
import NavMenu from "../../components/NavMenu/NavMenu";

const ContractCreate: React.FC = () => {
  const [data, setData] = useState<ContractCreateInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    bankAccountNumber: "",
    startDate: "",
    endDate: "",
    resellerId: 0,
    addressId: 0,
    pdfLink: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "resellerId" || name === "addressId") {
      setData({ ...data, [name]: Number(value) });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!data.firstName || !data.lastName || !data.email) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await createContract(data);
      alert("Contract created successfully!");
      navigate("/contracts/list");
    } catch (err) {
      console.error(err);
      alert("Failed to create contract");
    }
  };

  return (
    <>
      {/* NavMenu */}
      <NavMenu />

      {/* Page content */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Create New Contract
        </Typography>

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="First Name" name="firstName" value={data.firstName} onChange={handleChange} fullWidth />
            <TextField label="Last Name" name="lastName" value={data.lastName} onChange={handleChange} fullWidth />
          </Stack>

          <TextField label="Email" name="email" value={data.email} onChange={handleChange} type="email" fullWidth />
          <TextField label="Phone" name="phone" value={data.phone} onChange={handleChange} fullWidth />
          <TextField label="Company Name" name="companyName" value={data.companyName} onChange={handleChange} fullWidth />
          <TextField label="Bank Account" name="bankAccountNumber" value={data.bankAccountNumber} onChange={handleChange} fullWidth />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Start Date" type="date" name="startDate" value={data.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="End Date" type="date" name="endDate" value={data.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Reseller ID" type="number" name="resellerId" value={data.resellerId} onChange={handleChange} fullWidth />
            <TextField label="Address ID" type="number" name="addressId" value={data.addressId} onChange={handleChange} fullWidth />
          </Stack>

          <TextField label="PDF Link" name="pdfLink" value={data.pdfLink} onChange={handleChange} fullWidth />

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Create Contract
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ContractCreate;
