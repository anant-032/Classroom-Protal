import api from "./axios";

// -----------------------------
// STUDENT: Upload a submission
// -----------------------------
export const submitAssignment = async (formData) => {
  return await api.post("/submission", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// -----------------------------
// TEACHER: Get all submissions for an assignment
// -----------------------------
export const getSubmissionsByAssignment = async (assignmentId) => {
  return await api.get(`/submission/${assignmentId}`);
};

// -----------------------------
// TEACHER: Add or update feedback and grade
// -----------------------------
export const updateFeedback = async (submissionId, data) => {
  return await api.put(`/submission/${submissionId}/feedback`, data);
};

// -----------------------------
// STUDENT: Get feedback for a specific assignment
// -----------------------------
export const getStudentFeedback = async (assignmentId, studentId) => {
  return await api.get(`/submission/${assignmentId}/student/${studentId}`);
};