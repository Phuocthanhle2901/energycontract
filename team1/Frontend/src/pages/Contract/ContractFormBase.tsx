// src/pages/Contract/ContractFormBase.tsx
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Stack, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ContractFormProps {
    mode: "create" | "edit";
    contractNumber?: string;
    onUpdate?: (updated: ContractData) => void;
}

export interface ContractData {
    contractNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    startDate: string;
    endDate?: string;
    companyName?: string;
    bankAccountNumber?: string;
    resellerId?: string;
    addressId?: string;
    pdfLink?: string;
    status: string;
    notes?: string;
}

// Mock data
const mockContracts: ContractData[] = [
    {
        contractNumber: "101",
        firstName: "Nguyen",
        lastName: "Van A",
        email: "a.nguyen@example.com",
        phone: "0901234567",
        startDate: "2025-12-01",
        endDate: "2026-12-01",
        companyName: "ABC Corp",
        bankAccountNumber: "123456789",
        resellerId: "R101",
        addressId: "ADDR101",
        pdfLink: "https://example.com/101.pdf",
        status: "Active",
        notes: "Priority customer",
    },
    {
        contractNumber: "102",
        firstName: "Tran",
        lastName: "Thi B",
        email: "b.tran@example.com",
        phone: "0902345678",
        startDate: "2025-11-15",
        endDate: "2026-11-15",
        companyName: "XYZ Ltd",
        bankAccountNumber: "987654321",
        resellerId: "R102",
        addressId: "ADDR102",
        pdfLink: "https://example.com/102.pdf",
        status: "Inactive",
        notes: "Needs review",
    },
];

const ContractFormBase: React.FC<ContractFormProps> = ({ mode, contractNumber, onUpdate }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ContractData>({
        contractNumber: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        startDate: "",
        endDate: "",
        companyName: "",
        bankAccountNumber: "",
        resellerId: "",
        addressId: "",
        pdfLink: "",
        status: "Active",
        notes: "",
    });

    useEffect(() => {
        if (mode === "edit" && contractNumber) {
            const contract = mockContracts.find(c => c.contractNumber === contractNumber);
            if (contract) setFormData(contract);
        }
    }, [mode, contractNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (onUpdate) onUpdate(formData); // update List nếu có callback
        alert(`${mode === "edit" ? "Updated" : "Created"} contract successfully!`);
        navigate("/contracts/list");
    };

    return (
        <Box sx={{ p: 4, ml: "240px", maxWidth: 600 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {mode === "edit" ? `Edit Contract #${contractNumber}` : "Create New Contract"}
            </Typography>

            <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth />
                    <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth />
                </Stack>

                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                    <TextField label="End Date" type="date" name="endDate" value={formData.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                </Stack>

                <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth />
                <TextField label="Bank Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} fullWidth />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="Reseller ID" name="resellerId" value={formData.resellerId} onChange={handleChange} fullWidth />
                    <TextField label="Address ID" name="addressId" value={formData.addressId} onChange={handleChange} fullWidth />
                </Stack>

                <TextField label="PDF Link" name="pdfLink" value={formData.pdfLink} onChange={handleChange} fullWidth />

                <TextField select label="Status" name="status" value={formData.status} onChange={handleChange} fullWidth>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Expired">Expired</MenuItem>
                </TextField>

                <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={3} fullWidth />

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={handleSubmit}>
                        {mode === "edit" ? "Save Changes" : "Create Contract"}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/contracts/list")}>Cancel</Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ContractFormBase;
