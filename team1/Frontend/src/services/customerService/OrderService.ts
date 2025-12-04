import axiosInstance from "@/lib/axiosInstance";

export async function getOrders() {
    const res = await axiosInstance.get("/orders");
    return res.data;
}

export async function getOrderById(id: number) {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
}

export async function createOrder(data: any) {
    const res = await axiosInstance.post("/orders", data);
    return res.data;
}

export async function updateOrder(id: number, data: any) {
    const res = await axiosInstance.put(`/orders/${id}`, data);
    return res.data;
}

export async function deleteOrder(id: number) {
    const res = await axiosInstance.delete(`/orders/${id}`);
    return res.data;
}
