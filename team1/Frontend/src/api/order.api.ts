import axiosClient from "./axiosClient";

export const OrderApi = {
    // GET /api/orders?limit=0
    getOrders: async (limit: number = 0) => {
        const res = await axiosClient.get(`/orders?limit=${limit}`);
        return res.data;
    },

    // GET /api/orders/{id}
    getById: async (id: number) => {
        const res = await axiosClient.get(`/orders/${id}`);
        return res.data;
    },

    // POST /api/orders
    create: async (data: any) => {
        const payload = {
            orderNumber: data.orderNumber,
            orderType: Number(data.orderType),  // enum backend
            status: Number(data.status),        // enum backend
            startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
            endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
            topupFee: Number(data.topupFee),
            contractId: Number(data.contractId),
        };

        const res = await axiosClient.post("/orders", payload);
        return res.data;
    },

    // PUT /api/orders/{id}
    update: async (id: number, data: any) => {
        const payload = {
            id,
            orderNumber: data.orderNumber,
            orderType: Number(data.orderType),
            status: Number(data.status),
            startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
            endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
            topupFee: Number(data.topupFee),
        };

        const res = await axiosClient.put(`/orders/${id}`, payload);
        return res.data;
    },

    // DELETE /api/orders/{id}
    delete: async (id: number) => {
        const res = await axiosClient.delete(`/orders/${id}`);
        return res.data;
    },

    // GET /api/orders?contractId={contractId}
    getByContractId: async (contractId: number, limit: number = 0) => {
        const res = await axiosClient.get(`/orders?contractId=${contractId}&limit=${limit}`);
        return res.data;
    },
};
