import * as yup from "yup";

export const contractSchema = yup.object({
    contractNumber: yup.string().required("Required"),
    customerName: yup.string().required("Required"),
    email: yup.string().email().required("Required"),
    phone: yup.string().optional(),
    startDate: yup.string().required("Required"),
    endDate: yup.string().optional(),
    status: yup.string().required("Required"),
});
