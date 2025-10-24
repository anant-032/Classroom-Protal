import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { submitAssignment } from "../../api/submission";
import DashboardLayout from "../DashboardLayout";

function SubmitAssignment() {
  const [assignmentId, setAssignmentId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // automatically take logged-in student ID
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.id;

  // fetch assignments from backend
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/assignments", {
        headers: { Authorization: `Bearer ${token}` },
});
 // adjust if your backend route differs
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, []);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentId || !selectedFile) {
      alert("Please select an assignment and file before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("student", studentId);
      formData.append("assignment", assignmentId);
      formData.append("file", selectedFile);

     const response = await submitAssignment(formData);

      alert("Assignment submitted successfully!");
      console.log(response.data);
      setAssignmentId("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Submission failed. Please try again.");
    }
  };

  // UI
  return (
     <DashboardLayout> {/* ✅ WRAPPED INSIDE LAYOUT */}
    <div className="submit-container">
      <h2 className="submit-title">Submit Assignment</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          className="submit-input"
          required
        >
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a._id} value={a._id}>
              {a.title}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="submit-input"
          required
        />

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
    </DashboardLayout>
  );
}

export default SubmitAssignment;
