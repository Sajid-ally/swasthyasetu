import api from "./api";

// =======================
// AUTH API
// =======================

export const loginUser = async (identifier) => {
  const res = await api.post("/auth/login", { identifier });
  return res.data;
};

// =======================
// DASHBOARD APIs
// =======================

export const getDashboard = async (userId) => {
  const res = await api.get(`/dashboard/${userId}`);
  return res.data;
};

export const smartAddText = async (userId, text) => {
  const res = await api.post(`/smart-add/${userId}`, { text });
  return res.data;
};

// =======================
// AI ALL-ROUNDER COMMAND API
// =======================

export const assistantCommand = async (userId, text) => {
  const res = await api.post(`/assistant-command/${userId}`, { text });
  return res.data;
};

export const uploadVoiceCommand = async (
  userId,
  audioBlob,
  language = "en-IN"
) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice-command.wav");

  const res = await api.post(`/voice-command/${userId}`, formData, {
    params: { language },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =======================
// MEDICINE IMAGE OCR COMMAND API
// =======================

export const previewMedicineImage = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await api.post(`/image-command/preview/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const confirmMedicineImage = async (userId, medicineData) => {
  const res = await api.post(`/image-command/confirm/${userId}`, medicineData);
  return res.data;
};

// =======================
// MEDICAL REPORT COMMAND API
// =======================

export const previewMedicalReport = async (userId, reportFile) => {
  const formData = new FormData();
  formData.append("file", reportFile);

  const res = await api.post(`/report-command/preview/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const confirmMedicalReport = async (userId, reportData) => {
  const res = await api.post(`/report-command/confirm/${userId}`, reportData);
  return res.data;
};

// =======================
// PROFILE APIs
// =======================

export const getAllUsers = async () => {
  const res = await api.get("/profile/users/all");
  return res.data;
};

export const getProfile = async (userId) => {
  const res = await api.get(`/profile/${userId}`);
  return res.data;
};

// =======================
// FAMILY PAGE APIs
// =======================

export const getFamilyData = async (userId) => {
  const res = await api.get(`/family/${userId}`);
  return res.data;
};

export const addFamilyMember = async (userId, memberData) => {
  const res = await api.post(`/family/add/${userId}`, memberData);
  return res.data;
};

// =======================
// DELETE APIs
// =======================

export const deleteFamilyMember = async (userId, memberId) => {
  const res = await api.delete(`/family/${userId}/member/${memberId}`);
  return res.data;
};

export const deleteProfileCondition = async (userId, conditionIndex) => {
  const res = await api.delete(
    `/profile/${userId}/condition/${conditionIndex}`
  );
  return res.data;
};

export const deleteProfileMedication = async (userId, medicationIndex) => {
  const res = await api.delete(
    `/profile/${userId}/medication/${medicationIndex}`
  );
  return res.data;
};