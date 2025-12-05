import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
    createContract,
    getContractById,
    updateContract,
} from "../../services/customerService/ContractService";

import { AddressApi } from "../../services/customerService/AddressService";
import ResellerApi from "../../services/customerService/ResellerService";

interface Props {
    mode: "create" | "edit";
    id?: string;
}

export default function ContractFormBase({ mode, id }: Props) {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<any[]>([]);
    const [resellers, setResellers] = useState<any[]>([]);

    // FORM STATE
    const [data, setData] = useState({
        contractNumber: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        bankAccountNumber: "",
        pdfLink: "",
        startDate: "",
        endDate: "",
        resellerId: "",
        addressId: "",
    });

    /* -------------------- LOAD DROPDOWNS -------------------- */
    useEffect(() => {
        AddressApi.getAll().then((res) => setAddresses(res || []));
        ResellerApi.getAll().then((res) => setResellers(res || []));
    }, []);

    /* -------------------- LOAD DATA WHEN EDIT -------------------- */
    useEffect(() => {
        if (mode === "edit" && id) {
            getContractById(Number(id)).then((res) => {
                setData({
                    contractNumber: res.contractNumber ?? "",
                    firstName: res.firstName ?? "",
                    lastName: res.lastName ?? "",
                    email: res.email ?? "",
                    phone: res.phone ?? "",
                    companyName: res.companyName ?? "",
                    bankAccountNumber: res.bankAccountNumber ?? "",
                    pdfLink: res.pdfLink ?? "",
                    startDate: res.startDate?.slice(0, 10) ?? "",
                    endDate: res.endDate?.slice(0, 10) ?? "",
                    resellerId: res.resellerId?.toString() ?? "",
                    addressId: res.addressId?.toString() ?? "",
                });
            });
        }
    }, [id, mode]);

    /* -------------------- Handle input change -------------------- */
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    /* -------------------- Convert YYYY-MM-DD → ISO -------------------- */
    const convertDate = (d: string) => {
        if (!d) return null;
        return new Date(d).toISOString();
    };

    /* -------------------- SUBMIT -------------------- */
    const handleSubmit = async () => {
        const payload = {
            id: mode === "edit" ? Number(id) : undefined,

            contractNumber: data.contractNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            companyName: data.companyName,
            bankAccountNumber: data.bankAccountNumber,
            pdfLink: data.pdfLink || null,

            startDate: convertDate(data.startDate),
            endDate: convertDate(data.endDate),

            resellerId: Number(data.resellerId),
            addressId: Number(data.addressId),
        };

        try {
            if (mode === "create") {
                await createContract(payload);
                alert("Contract created!");
            } else {
                await updateContract(Number(id), payload);
                alert("Contract updated!");
            }

            navigate("/contracts/list");

        } catch (err: any) {
            console.log("❌ SERVER ERROR:", err.response?.data || err);
            alert(JSON.stringify(err.response?.data || err, null, 2));
        }
    };

    /* -------------------- UI -------------------- */
    return (
        <Box sx={{ maxWidth: 650, mx: "auto", mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {mode === "create" ? "Create Contract" : "Edit Contract"}
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Contract Number"
                    name="contractNumber"
                    value={data.contractNumber}
                    onChange={handleChange}
                    fullWidth
                />

                <Stack direction="row" spacing={2}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleChange}
                        fullWidth
                    />
                </Stack>

                <TextField label="Email" name="email" value={data.email} onChange={handleChange} fullWidth />
                <TextField label="Phone" name="phone" value={data.phone} onChange={handleChange} fullWidth />

                <TextField
                    label="Company Name"
                    name="companyName"
                    value={data.companyName}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Bank Account Number"
                    name="bankAccountNumber"
                    value={data.bankAccountNumber}
                    onChange={handleChange}
                    fullWidth
                />

                <Stack direction="row" spacing={2}>
                    <TextField
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={data.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <TextField
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={data.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Stack>

                <TextField
                    select
                    fullWidth
                    label="Reseller"
                    name="resellerId"
                    value={data.resellerId}
                    onChange={handleChange}
                >
                    {resellers.map((r) => (
                        <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Address"
                    name="addressId"
                    value={data.addressId}
                    onChange={handleChange}
                >
                    {addresses.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                            {a.zipCode} - {a.houseNumber}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="PDF Link (optional)"
                    name="pdfLink"
                    value={data.pdfLink}
                    onChange={handleChange}
                    fullWidth
                />

                <Button variant="contained" onClick={handleSubmit}>
                    {mode === "create" ? "Create" : "Update"}
                </Button>
            </Stack>
        </Box>
    );
}
