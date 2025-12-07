import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderSchema } from "@/schemas/order.schema";

export function useOrderForm(defaultValues?: any) {
    return useForm({
        resolver: yupResolver(orderSchema),
        defaultValues,
        mode: "onChange",
    });
}
