import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "./DashboardLayout";

function ClassroomList() {
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/classrooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassrooms(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch classrooms");
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "600px", margin: "40px auto" }}>
        <h2>Your Classrooms</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {classrooms.length === 0 ? (
          <p>No classrooms found.</p>
        ) : (
          <ul>
            {classrooms.map((cls) => (
              <li key={cls._id}>
                <strong>{cls.name}</strong> — Invite Code: {cls.inviteCode}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ClassroomList;
