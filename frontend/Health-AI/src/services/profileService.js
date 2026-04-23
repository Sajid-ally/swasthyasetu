import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const fetchProfile = async (userId) => {
  const res = await axios.get(`${BASE_URL}/profile/${userId}`);

  const data = res.data;

  // 🔥 map backend → frontend format (IMPORTANT)
  return {
    fullName: data.name,
    email: data.email,
    phone: data.phone_number,
    dob: data.date_of_birth,
    bloodGroup: data.blood_group,
    address: data.address,

    height: data.height_cm,
    weight: data.weight_kg,
    bmi: data.bmi,  
    diseases: data.diseases || [],
    medications: data.medications || [],
  };
};