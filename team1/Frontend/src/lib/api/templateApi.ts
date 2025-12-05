import axios from "axios";

const templateApi = axios.create({
    baseURL: "http://localhost:5001/api",
});

export default templateApi;
