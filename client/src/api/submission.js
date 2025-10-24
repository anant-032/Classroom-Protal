import api from "./axios";

// Upload a submission
export const submitAssignment = async (formData) => {
  return await api.post("/submission", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get all submissions (optional, if you want to show submitted ones)
export const getSubmissions = async () => {
  return await api.get("/submission");
};
