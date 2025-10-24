import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../DashboardLayout";


function ViewSubmissions() {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(`/submission/${id}`,{
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

  if (loading) return <p>Loading submissions...</p>;

  return (
     <DashboardLayout> {/* ✅ WRAPPED INSIDE LAYOUT */}
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
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Student
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                File
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Submitted On
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {s.student?.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {s.student?.email}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <a
                    href={s.fileUrl}
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
