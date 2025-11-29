import api from "../api/axiosInstance";

export const ResellerApi = {
  create(data: { name: string; type: string }) {
    return api.post("/resellers", data).then((r) => r.data);
  },

  getAll() {
    return api.get("/resellers").then((r) => r.data);
  },

  getById(id: number) {
    return api.get(`/resellers/${id}`).then((r) => r.data);
  },

  update(id: number, data: { name: string; type: string }) {
    return api.put(`/resellers/${id}`, data).then((r) => r.data);
  },

  delete(id: number) {
    return api.delete(`/resellers/${id}`).then((r) => r.data);
  },
};
