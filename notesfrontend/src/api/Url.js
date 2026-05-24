import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4005/api/v1";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/notes`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
