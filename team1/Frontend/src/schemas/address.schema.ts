import * as yup from "yup";

export const addressSchema = yup.object({
    zipcode: yup
        .string()
        .required("Zipcode is required")
        .matches(/^[0-9]{4,10}$/, "Zipcode must be numeric"),

    housenumber: yup
        .string()
        .required("House number is required"),

    extension: yup
        .string()
        .nullable(),
});
