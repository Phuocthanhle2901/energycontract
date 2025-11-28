import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});
// Kiểm tra định dạng của API
api.interceptors.response.use(
  (response) => {
     console.log('✅ API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Backend might be down.');
    }
}
);
export default api;