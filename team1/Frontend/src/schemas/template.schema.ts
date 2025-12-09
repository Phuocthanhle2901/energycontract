import * as yup from "yup";

export const templateSchema = yup.object({
    name: yup.string().required("Required"),
    description: yup.string().required("Required"),
    htmlContent: yup.string().required("HTML cannot be empty"),
    isActive: yup.boolean().required(),
});
