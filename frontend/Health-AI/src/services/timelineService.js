import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getTimelineData = async (
  userId,
  eventType = "all",
  timeRange = "all"
) => {
  try {
    const safeUserId =
      userId || localStorage.getItem("loggedInUserId") || "user_1";

    const res = await axios.get(`${API_BASE_URL}/timeline/${safeUserId}`, {
      params: {
        event_type: eventType,
        time_range: timeRange,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return {
      success: false,
      user_id: userId,
      total_events: 0,
      timeline: [],
    };
  }
};

export const addTimelineEvent = async (userId, payload) => {
  const safeUserId =
    userId || localStorage.getItem("loggedInUserId") || "user_1";

  const res = await axios.post(`${API_BASE_URL}/timeline/${safeUserId}`, payload);
  return res.data;
};

export const deleteTimelineEvent = async (userId, eventId) => {
  const safeUserId =
    userId || localStorage.getItem("loggedInUserId") || "user_1";

  const res = await axios.delete(
    `${API_BASE_URL}/timeline/${safeUserId}/${eventId}`
  );

  return res.data;
};