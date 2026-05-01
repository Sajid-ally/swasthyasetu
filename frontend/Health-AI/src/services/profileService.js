import api from "./api";

export const fetchProfile = async (userId) => {
  const res = await api.get(`/profile/${userId}`);
  const data = res.data;

  return {
    fullName: data.name || "",
    email: data.email || "",
    phone: data.phone_number || "",
    dob: data.date_of_birth || "",
    bloodGroup: data.blood_group || "",
    address: data.address || "",

    height: data.height_cm || null,
    weight: data.weight_kg || null,
    bmi: data.bmi || null,

    diseases: data.diseases || [],
    medications: data.medications || [],
    lifestyle: data.lifestyle || {},
    vitals: data.vitals || {},
  };
};