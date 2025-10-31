import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // ✅ Fetch assignments specific to logged-in user
        const res = await api.get("/assignments/my", {
          withCredentials: true, // ensures token/cookie is sent
        });
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("Failed to load assignments");
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div>
      <h2>My Assignments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {assignments.map((a) => (
          <li key={a._id}>
            <strong>{a.title}</strong> — {a.description || "No description"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AssignmentList;