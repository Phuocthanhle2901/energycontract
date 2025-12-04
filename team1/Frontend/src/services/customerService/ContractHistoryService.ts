import axiosInstance from "@/lib/axiosInstance";

export const ContractHistoryApi = {
    getByContractId: async (contractId: number) => {
        const res = await axiosInstance.get(`/contract-histories/${contractId}`);
        return res.data;
    },

    create: async (data: {
        oldValue: string;
        newValue: string;
        contractId: number;
    }) => {
        const res = await axiosInstance.post("/contract-histories", data);
        return res.data;
    }
};
