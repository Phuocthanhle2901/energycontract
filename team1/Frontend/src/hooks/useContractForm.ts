import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contractSchema } from "@/schemas/contract.schema";

export function useContractForm(defaultValues?: any) {
    return useForm({
        defaultValues,
        resolver: yupResolver(contractSchema),
    });
}
