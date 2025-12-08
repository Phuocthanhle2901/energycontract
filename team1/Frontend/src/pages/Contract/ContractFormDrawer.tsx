import {
    Drawer, Box, Typography, IconButton, Divider, Stack,
    TextField, MenuItem, Button
} from "@mui/material";

import { FiX } from "react-icons/fi";
import { useEffect } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ContractApi } from "@/api/contract.api";
import { AddressApi } from "@/api/address.api";
import { ResellerApi } from "@/api/reseller.api";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// =============================
// FORM TYPE
// =============================
export interface ContractFormValues {
    contractNumber: string;      // chỉ dùng để hiển thị, BE không nhận
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    companyName: string | null;
    bankAccountNumber: string | null;
    resellerId: string;
    addressId: string;
    notes: string | null;        // BE không nhận, chỉ lưu FE nếu muốn
    startDate: string | null;
    endDate: string | null;
}

// =============================
// PROPS
// =============================
interface ContractFormDrawerProps {
    open: boolean;
    mode: "create" | "edit";
    initialData?: any;
    onClose: () => void;
    onSaved?: () => void;
}

// =============================
// YUP SCHEMA
// =============================
const schema = yup.object({
    contractNumber: yup.string(), // không required vì BE không cần
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().email().required("Required"),

    phone: yup.string().nullable(),
    companyName: yup.string().nullable(),
    bankAccountNumber: yup.string().nullable(),

    resellerId: yup.string().required("Select reseller"),
    addressId: yup.string().required("Select address"),

    notes: yup.string().nullable(),
    startDate: yup.string().nullable(),
    endDate: yup.string().nullable(),
});

export default function ContractFormDrawer({
    open,
    mode,
    initialData,
    onClose,
    onSaved,
}: ContractFormDrawerProps) {

    const isEdit = mode === "edit";

    // ================================
    // QUERY DATA
    // ================================
    const { data: addresses = [] } = useQuery({
        queryKey: ["addresses"],
        queryFn: () => AddressApi.getAll(),
    });

    const { data: resellers = [] } = useQuery({
        queryKey: ["resellers"],
        queryFn: () => ResellerApi.getAll(),
    });

    // ================================
    // FORM CONFIG
    // ================================
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<ContractFormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            contractNumber: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            companyName: "",
            bankAccountNumber: "",
            resellerId: "",
            addressId: "",
            notes: "",
            startDate: "",
            endDate: "",
        },
    });

    // ================================
    // EDIT MODE — RESET FORM DATA
    // ================================
    useEffect(() => {
        if (!isEdit || !initialData) {
            // nếu create thì reset trắng
            if (!isEdit) {
                reset({
                    contractNumber: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    companyName: "",
                    bankAccountNumber: "",
                    resellerId: "",
                    addressId: "",
                    notes: "",
                    startDate: "",
                    endDate: "",
                });
            }
            return;
        }

        reset({
            contractNumber: initialData.contractNumber ?? "",
            firstName: initialData.firstName ?? "",
            lastName: initialData.lastName ?? "",
            email: initialData.email ?? "",
            phone: initialData.phone ?? "",
            companyName: initialData.companyName ?? "",
            bankAccountNumber: initialData.bankAccountNumber ?? "",
            resellerId: initialData.resellerId ? String(initialData.resellerId) : "",
            addressId: initialData.addressId ? String(initialData.addressId) : "",
            notes: initialData.notes ?? "",
            startDate: initialData.startDate?.slice(0, 10) ?? "",
            endDate: initialData.endDate?.slice(0, 10) ?? "",
        });
    }, [initialData, isEdit, reset]);

    // ================================
    // SUBMIT FORM
    // ================================
    const onSubmit: SubmitHandler<ContractFormValues> = async (form) => {
        const payloadBase = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone || "",
            startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
            endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
            companyName: form.companyName || "",
            bankAccountNumber: form.bankAccountNumber || "",
            resellerId: Number(form.resellerId),
            addressId: Number(form.addressId),
        };

        try {
            if (isEdit) {
                if (!initialData?.id) {
                    toast.error("Missing contract id");
                    return;
                }

                const payload = {
                    id: initialData.id,
                    pdfLink: initialData.pdfLink ?? "",
                    ...payloadBase,
                };

                console.log("UPDATE PAYLOAD:", payload);

                await ContractApi.update(initialData.id, payload);
                toast.success("Updated successfully");
            } else {
                const payload = {
                    pdfLink: "",
                    ...payloadBase,
                };

                console.log("CREATE PAYLOAD:", payload);

                await ContractApi.create(payload);
                toast.success("Created successfully");
            }

            onSaved?.();
            onClose();
        } catch (err) {
            console.error("ERROR PAYLOAD:", isEdit ? "UPDATE" : "CREATE", {
                ...(isEdit && { id: initialData?.id }),
                ...payloadBase,
            });
            toast.error("Failed to save contract");
        }
    };

    // ================================
    // UI
    // ================================
    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 480 } }}>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={700}>
                        {isEdit ? "Edit Contract" : "Create Contract"}
                    </Typography>

                    <IconButton onClick={onClose}>
                        <FiX />
                    </IconButton>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>

                        {/* Contract Number: chỉ hiển thị ở edit */}
                        <TextField
                            label="Contract Number"
                            {...register("contractNumber")}
                            disabled={!isEdit}
                            error={!!errors.contractNumber}
                            helperText={
                                isEdit
                                    ? errors.contractNumber?.message
                                    : "Auto generated after create"
                            }
                        />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="First Name"
                                fullWidth
                                {...register("firstName")}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />

                            <TextField
                                label="Last Name"
                                fullWidth
                                {...register("lastName")}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Stack>

                        <TextField
                            label="Email"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField label="Phone" {...register("phone")} />

                        {/* DATES */}
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
                        <TextField label="Bank Account Number" {...register("bankAccountNumber")} />

                        {/* SELECT: RESELLER */}
                        <TextField
                            select
                            label="Reseller"
                            {...register("resellerId")}
                            value={watch("resellerId") || ""}
                            error={!!errors.resellerId}
                            helperText={errors.resellerId?.message}
                        >
                            {resellers.map((r: any) => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.name} ({r.type})
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* SELECT: ADDRESS */}
                        <TextField
                            select
                            label="Address"
                            {...register("addressId")}
                            value={watch("addressId") || ""}
                            error={!!errors.addressId}
                            helperText={errors.addressId?.message}
                        >
                            {addresses.map((a: any) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.zipCode} — {a.houseNumber} {a.extension}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField multiline rows={3} label="Notes" {...register("notes")} />

                        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button variant="contained" type="submit">
                                {isEdit ? "Update" : "Create"}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Drawer>
    );
}
