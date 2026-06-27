import axios from "axios";

export const getTimelineData = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8000/timeline/user_1"
    );

    return res.data; // ⚠️ return full response
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return { timeline: [] };
  }
};