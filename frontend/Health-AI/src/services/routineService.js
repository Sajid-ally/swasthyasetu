import api from "./api";

export const getRoutineData = async (userId) => {
  const res = await api.get(`/routine/${userId}`);
  const data = res.data;

  if (!data || data.error) {
    return { error: data?.error || "Routine data not found" };
  }

  return {
    completed: data.completed ?? 0,

    // supports backend camelCase
    sleepHours: data.sleepHours ?? data.sleep_hours ?? 0,
    waterIntake: data.waterIntake ?? data.water_intake ?? 0,
    steps: data.steps ?? 0,
    workout: data.workout ?? data.workout_minutes ?? 0,

    todayRoutine: data.todayRoutine ?? [],
    weeklyOverview: data.weeklyOverview ?? [],
  };
};

export const updateRoutineData = async (userId, payload) => {
  const res = await api.post(`/routine/${userId}`, payload);
  return res.data;
};