import React, { useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Stack,
    MenuItem,
    Paper,
    Typography,
    Grid, // Use Grid2 for MUI v6 compatibility or alias it
    CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useCreateContract, useUpdateContract } from "@/hooks/useContracts";


// Define the form data structure explicitly to match UI fields
interface ContractFormData {
    contractNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    startDate: string;
    endDate: string;
    companyName: string;
    bankAccountNumber: string;
    resellerId: number | string; // Allow string for form handling
    addressId: number | string;  // Allow string for form handling
    pdfLink: string;
    status: number;
    notes: string;
}

interface ContractFormProps {
    mode: "create" | "edit";
    initialData?: any; // Data passed for edit mode
    contractId?: number; // ID for update
}

const ContractFormBase: React.FC<ContractFormProps> = ({ mode, initialData, contractId }) => {
    const navigate = useNavigate();
    const createMutation = useCreateContract();
    const updateMutation = useUpdateContract();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContractFormData>({
        defaultValues: {
            contractNumber: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            startDate: "",
            endDate: "",
            companyName: "",
            bankAccountNumber: "",
            resellerId: "", // Initialize as empty string
            addressId: "",  // Initialize as empty string
            pdfLink: "",
            status: 1,
            notes: "",
        },
    });

    // Populate form when initialData changes (Edit mode)
    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                startDate: initialData.startDate ? initialData.startDate.split('T')[0] : "",
                endDate: initialData.endDate ? initialData.endDate.split('T')[0] : "",
                resellerId: initialData.resellerId || "",
                addressId: initialData.addressId || "",
            });
        }
    }, [initialData, reset]);

    const onSubmit = (data: ContractFormData) => {
        // Convert form data to API params
        // Casting to 'any' to bypass strict type checks if CreateContractParams is missing fields
        const payload: any = {
            ...data,
            resellerId: Number(data.resellerId) || 0, // Ensure number
            addressId: Number(data.addressId) || 0,   // Ensure number
            status: Number(data.status),
        };

        if (mode === "create") {
            createMutation.mutate(payload, {
                onSuccess: () => navigate("/contracts/list"),
            });
        } else if (mode === "edit" && contractId) {
            updateMutation.mutate(
                { id: contractId, data: payload },
                {
                    onSuccess: () => navigate("/contracts/list"),
                }
            );
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, width: "100%", maxWidth: 800, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700} color="primary">
                    {mode === "edit" ? "Edit Contract" : "Create New Contract"}
                </Typography>
                <Typography variant="body2" textAlign="center" color="text.secondary" mb={4}>
                    {mode === "edit" ? "Update the contract details below." : "Fill in the information to create a new contract."}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {/* Contract Number */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="contractNumber"
                                control={control}
                                rules={{ required: "Contract Number is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Contract Number"
                                        fullWidth
                                        error={!!errors.contractNumber}
                                        helperText={errors.contractNumber?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* First Name & Last Name */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{ required: "First Name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="First Name"
                                        fullWidth
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{ required: "Last Name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Last Name"
                                        fullWidth
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Email & Phone */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Phone" fullWidth />
                                )}
                            />
                        </Grid>

                        {/* Start & End Date */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: "Start Date is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Start Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.startDate}
                                        helperText={errors.startDate?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="End Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Company & Bank */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="companyName"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Company Name" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="bankAccountNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Bank Account Number" fullWidth />
                                )}
                            />
                        </Grid>

                        {/* Reseller & Address IDs */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="resellerId"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Reseller ID" type="number" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="addressId"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Address ID" type="number" fullWidth />
                                )}
                            />
                        </Grid>

                        {/* PDF Link & Status */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="pdfLink"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="PDF Link" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Status"
                                        fullWidth
                                    >
                                        <MenuItem value={1}>Active</MenuItem>
                                        <MenuItem value={0}>Inactive</MenuItem>
                                        <MenuItem value={2}>Pending</MenuItem>
                                        <MenuItem value={3}>Expired</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Notes */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Notes"
                                        multiline
                                        rows={3}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* Actions */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/contracts/list")}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSubmitting ? "Saving..." : (mode === "edit" ? "Save Changes" : "Create Contract")}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default ContractFormBase;
