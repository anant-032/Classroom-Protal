import api from "./axios";

export const getClassrooms = async () => {
  try {
    const res = await api.get("/classrooms");
    return res.data;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return [];
  }
};