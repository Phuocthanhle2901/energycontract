import axios from "axios";

const api_customer = axios.create({
    baseURL: import.meta.env.VITE_CUSTOMER_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Logging response
api_customer.interceptors.response.use(
    (response) => {
        console.log("✅ API Response:", response.data);
        console.log("🔥 BASE URL:", import.meta.env.VITE_CUSTOMER_API_URL);
        return response;
    },
    (error) => {
        console.error("❌ API Error:", error.message);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);


        } else if (error.request) {
            console.error("❌ No response received. Backend maybe down.");
        }

        return Promise.reject(error);
    }

);

export default api_customer;