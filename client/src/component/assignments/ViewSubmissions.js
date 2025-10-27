import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../DashboardLayout";
import { updateFeedback } from "../../api/submission"; // ✅ make sure this path is correct

function ViewSubmissions() {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/submission/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  const handleFeedbackSave = async (submissionId, grade, feedback) => {
    try {
      setSavingId(submissionId);
      await updateFeedback(submissionId, { grade, feedback });
      alert("Feedback saved successfully!");
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("Failed to save feedback.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h2>Submissions for Assignment</h2>

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Student</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>File</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Submitted On</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Grade</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Feedback</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, index) => (
                <tr key={s._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {s.student?.name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {s.student?.email}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <a
                    href={`http://localhost:5000${s.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff" }}
                    >
                    View File
                    </a>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Date(s.submissionDate).toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <input
                      type="text"
                      defaultValue={s.grade || ""}
                      onChange={(e) => {
                        const newSubmissions = [...submissions];
                        newSubmissions[index].grade = e.target.value;
                        setSubmissions(newSubmissions);
                      }}
                      style={{ width: "70px", padding: "4px" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <textarea
                      defaultValue={s.feedback || ""}
                      onChange={(e) => {
                        const newSubmissions = [...submissions];
                        newSubmissions[index].feedback = e.target.value;
                        setSubmissions(newSubmissions);
                      }}
                      rows="2"
                      style={{ width: "100%", resize: "none" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() =>
                        handleFeedbackSave(s._id, s.grade, s.feedback)
                      }
                      disabled={savingId === s._id}
                      style={{
                        padding: "6px 12px",
                        background: savingId === s._id ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: savingId === s._id ? "not-allowed" : "pointer",
                      }}
                    >
                      {savingId === s._id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ViewSubmissions;
