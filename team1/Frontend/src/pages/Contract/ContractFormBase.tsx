import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Stack, MenuItem, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface Contract {
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

interface ContractFormProps {
    mode: "create" | "edit";
    contractNumber?: string;
    onUpdate?: (updated: Contract) => void;
}

const ContractFormBase: React.FC<ContractFormProps> = ({ mode, contractNumber, onUpdate }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Contract>({
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (onUpdate) onUpdate(formData);
        alert(`${mode === "edit" ? "Updated" : "Created"} contract successfully!`);
        navigate("/contracts/list");
    };

    return (
        <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 4, mb: 4 }}
        >
            <Paper sx={{ p: 4, width: "100%", maxWidth: 650, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    {mode === "edit" ? "Edit Contract" : "Create New Contract"}
                </Typography>

                <Stack spacing={2} alignItems="center">
                    {/* Row 1: First & Last Name */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                        <TextField sx={{ maxWidth: 280 }} label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth />
                        <TextField sx={{ maxWidth: 280 }} label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth />
                    </Stack>

                    {/* Row 2: Email & Phone */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                        <TextField sx={{ maxWidth: 280 }} label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                        <TextField sx={{ maxWidth: 280 }} label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
                    </Stack>

                    {/* Row 3: Start & End Date */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                        <TextField
                            sx={{ maxWidth: 280 }}
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            sx={{ maxWidth: 280 }}
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Stack>

                    {/* Row 4: Company & Bank */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                        <TextField sx={{ maxWidth: 280 }} label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth />
                        <TextField sx={{ maxWidth: 280 }} label="Bank Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} fullWidth />
                    </Stack>

                    {/* Row 5: Reseller & Address */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                        <TextField sx={{ maxWidth: 280 }} label="Reseller ID" name="resellerId" value={formData.resellerId} onChange={handleChange} fullWidth />
                        <TextField sx={{ maxWidth: 280 }} label="Address ID" name="addressId" value={formData.addressId} onChange={handleChange} fullWidth />
                    </Stack>

                    {/* Row 6: PDF & Status */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                        <TextField sx={{ maxWidth: 280 }} label="PDF Link" name="pdfLink" value={formData.pdfLink} onChange={handleChange} fullWidth />
                        <TextField
                            sx={{ maxWidth: 280 }}
                            select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Expired">Expired</MenuItem>
                        </TextField>
                    </Stack>

                    {/* Notes */}
                    <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={3} sx={{ width: "100%", maxWidth: 600 }} />

                    {/* Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                        <Button variant="contained" onClick={handleSubmit}>
                            {mode === "edit" ? "Save Changes" : "Create"}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/contracts/list")}>Cancel</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ContractFormBase;
