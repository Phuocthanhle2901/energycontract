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

    // FORM DATA
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        startDate: "",
        endDate: "",
        bankAccountNumber: "",
        pdfLink: "",
        resellerId: "",
        addressId: "",
    });

    /* -------------------- LOAD DROPDOWNS -------------------- */
    useEffect(() => {
        AddressApi.getAll().then((res) => setAddresses(res || []));
        ResellerApi.getAll().then((res) => setResellers(res || []));
    }, []);

    /* -------------------- LOAD CONTRACT WHEN EDIT -------------------- */
    useEffect(() => {
        if (mode === "edit" && id) {
            getContractById(Number(id)).then((res) => {
                setData({
                    firstName: res.firstName ?? "",
                    lastName: res.lastName ?? "",
                    email: res.email ?? "",
                    phone: res.phone ?? "",
                    companyName: res.companyName ?? "",
                    startDate: res.startDate?.slice(0, 10) ?? "",
                    endDate: res.endDate?.slice(0, 10) ?? "",
                    bankAccountNumber: res.bankAccountNumber ?? "",
                    pdfLink: res.pdfLink ?? "",
                    resellerId: res.resellerId?.toString() ?? "",
                    addressId: res.addressId?.toString() ?? "",
                });
            });
        }
    }, [mode, id]);

    /* -------------------- Date → ISO Format -------------------- */
    const toIso = (value: string) => {
        if (!value) return null;
        return new Date(value).toISOString();
    };

    /* -------------------- Handle Change -------------------- */
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    /* -------------------- SUBMIT -------------------- */
    const handleSubmit = async () => {
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            companyName: data.companyName,
            bankAccountNumber: data.bankAccountNumber,
            pdfLink: data.pdfLink || null,
            startDate: new Date(data.startDate + "T00:00:00Z").toISOString(),
            endDate: new Date(data.endDate + "T00:00:00Z").toISOString(),
            addressId: Number(data.addressId),
            resellerId: Number(data.resellerId),
        };

        try {
            if (mode === "create") {
                await createContract(payload);
                alert("Created!");
            } else {
                await updateContract(Number(id), payload);
                alert("Updated!");
            }
            navigate("/contracts/list");
        } catch (err: any) {
            console.log("❌ FULL ERROR:", err.response?.data || err);
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
                {/* First + Last Name */}
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

                {/* Dates */}
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

                {/* Address */}
                <TextField
                    select
                    label="Address"
                    name="addressId"
                    value={data.addressId}
                    onChange={handleChange}
                    fullWidth
                >
                    {addresses.map((a: any) => (
                        <MenuItem key={a.id} value={a.id}>
                            {a.zipCode} – {a.houseNumber} {a.extension ? `(${a.extension})` : ""}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Reseller */}
                <TextField
                    select
                    label="Reseller"
                    name="resellerId"
                    value={data.resellerId}
                    onChange={handleChange}
                    fullWidth
                >
                    {resellers.map((r: any) => (
                        <MenuItem key={r.id} value={r.id}>
                            {r.name} – {r.type}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="PDF Link"
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
