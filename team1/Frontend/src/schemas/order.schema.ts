import * as yup from "yup";

export const orderSchema = yup.object({
    order_number: yup
        .string()
        .required("Order number is required"),

    order_type: yup
        .string()
        .oneOf(["gas", "electricity"], "Order type invalid")
        .required("Order type is required"),

    status: yup
        .string()
        .oneOf(["active", "pending", "completed", "cancelled"], "Status invalid")
        .required("Status is required"),

    start_date: yup
        .date()
        .required("Start date is required"),

    end_date: yup
        .date()
        .nullable(),

    topup_fee: yup
        .number()
        .typeError("Topup fee must be a number")
        .min(0, "Fee must be greater than 0")
        .nullable(),

    contractId: yup
        .number()
        .typeError("Contract ID must be a number")
        .required("Contract ID is required"),
});
