import api from "./api";

export const getDashboard = (userId) => {
  return api.get(`/dashboard/${userId}`);
};