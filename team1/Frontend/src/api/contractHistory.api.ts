import axiosClient from "./axiosClient";

export const ContractHistoryApi = {
    getByContractId: async (contractId: number) => {
        const res = await axiosClient.get(`/contract-histories/${contractId}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosClient.post("/contract-histories", data);
        return res.data;
    },
};
