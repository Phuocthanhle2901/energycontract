// import api from "./axiosInstance";

// export const AddressApi = {
//   async create(data: {
//     zipCode: string;
//     houseNumber: string;
//     extension: string;
//   }) {
//     const res = await api.post("/addresses", data);
//     return res.data;
//   },

//   async getAll(limit: number = 0) {
//     const res = await api.get(`/addresses?limit=${limit}`);
//     return res.data;
//   },

//   async delete(id: number) {
//     const res = await api.delete(`/addresses/${id}`);
//     return res.data;
//   }
// };
import axios from "axios";

const API_URL = "http://localhost:5000/api/addresses";

export const AddressApi = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  create: async (data: any) => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  update: async (id: number, data: any) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  }
};
