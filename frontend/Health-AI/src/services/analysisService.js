import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const getAnalysisData = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return null;
  }
};