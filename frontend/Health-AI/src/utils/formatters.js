export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

export const formatPhone = (phone) => {
  return phone || "N/A";
};