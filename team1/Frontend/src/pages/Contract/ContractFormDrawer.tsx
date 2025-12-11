import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    Stack,
    MenuItem,
    Divider,
} from "@mui/material";

import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ContractApi } from "@/api/contract.api";
import { AddressApi } from "@/api/address.api";
import { ResellerApi } from "@/api/reseller.api";

export default function ContractFormDrawer({ open, mode, id, onClose, onSuccess }) {
    const isEdit = mode === "edit";

    const [resellers, setResellers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [initialData, setInitialData] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            companyName: "",
            bankAccountNumber: "",
            startDate: "",
            endDate: "",
            resellerId: "",
            addressId: "",
        },
    });

    useEffect(() => {
        ResellerApi.getAll({ PageNumber: 1, PageSize: 99 }).then((res) =>
            setResellers(res.items || [])
        );
        AddressApi.getAll({ PageNumber: 1, PageSize: 99 }).then((res) =>
            setAddresses(res.items || [])
        );
    }, []);

    // LOAD DATA INTO FORM
    useEffect(() => {
        if (!open) return;

        if (isEdit && id) {
            ContractApi.getById(id).then((data) => {
                setInitialData(data);

                reset({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    companyName: data.companyName ?? "",
                    bankAccountNumber: data.bankAccountNumber ?? "",
                    startDate: data.startDate?.split("T")[0],
                    endDate: data.endDate?.split("T")[0],
                    resellerId: String(data.resellerId),
                    addressId: String(data.addressId),
                });
            });
        } else {
            reset({});
        }
    }, [open, isEdit, id, reset]);

    // SUBMIT HANDLER
    const onSubmit = async (form) => {

        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            companyName: form.companyName ?? "",
            bankAccountNumber: form.bankAccountNumber ?? "",
            resellerId: Number(form.resellerId),
            addressId: Number(form.addressId),

            startDate: form.startDate
                ? form.startDate + "T00:00:00Z"
                : null,

            endDate: form.endDate
                ? form.endDate + "T00:00:00Z"
                : null,

            pdfLink: initialData?.pdfLink || "",
        };

        console.log("FINAL PAYLOAD SENT TO API:", payload);

        try {
            if (isEdit) {
                await ContractApi.update(id, payload);
                toast.success("Contract updated!");
            } else {
                await ContractApi.create(payload);
                toast.success("Contract created!");
            }

            onSuccess?.();
            onClose();

        } catch (err) {
            console.error("SAVE ERROR:", err);
            toast.error("Failed to save contract!");
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}
            PaperProps={{ sx: { width: 420, p: 3 } }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                    {isEdit ? "Edit Contract" : "Create Contract"}
                </Typography>
                <IconButton onClick={onClose}>
                    <FiX />
                </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>

                    <TextField label="First Name" {...register("firstName")} />

                    <TextField label="Last Name" {...register("lastName")} />

                    <TextField label="Email" {...register("email")} />

                    <TextField label="Phone" {...register("phone")} />

                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            {...register("startDate")}
                            value={watch("startDate") || ""}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            {...register("endDate")}
                            value={watch("endDate") || ""}
                        />
                    </Stack>

                    <TextField label="Company Name" {...register("companyName")} />

                    <TextField
                        label="Bank Account Number"
                        {...register("bankAccountNumber")}
                    />

                    <TextField
                        select
                        label="Reseller"
                        {...register("resellerId")}
                        value={watch("resellerId") || ""}
                    >
                        <MenuItem value="">-- Select --</MenuItem>
                        {resellers.map((r) => (
                            <MenuItem key={r.id} value={String(r.id)}>
                                {r.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Address"
                        {...register("addressId")}
                        value={watch("addressId") || ""}
                    >
                        <MenuItem value="">-- Select --</MenuItem>
                        {addresses.map((a) => (
                            <MenuItem key={a.id} value={String(a.id)}>
                                {a.houseNumber} • {a.zipCode}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {isEdit ? "Save" : "Create"}
                        </Button>
                    </Stack>

                </Stack>
            </form>
        </Drawer>
    );
}
