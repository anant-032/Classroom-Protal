import React, { useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../DashboardLayout"; // correct import path

function SubmitAssignment() {
  const [studentId, setStudentId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !assignmentId || !fileUrl) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      const response = await api.post("/submissions", {
        studentId,
        assignmentId,
        fileUrl,
      });

      alert("Assignment submitted successfully!");
      console.log(response.data);
      setStudentId("");
      setAssignmentId("");
      setFileUrl("");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="submit-container">
        <h2 className="submit-title">Submit Assignment</h2>

        <form className="submit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="submit-input"
            required
          />

          <input
            type="text"
            placeholder="Assignment ID"
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
            className="submit-input"
            required
          />

          <input
            type="url"
            placeholder="File URL (e.g., Google Drive)"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
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
