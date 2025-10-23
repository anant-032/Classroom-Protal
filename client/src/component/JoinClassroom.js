import React, { useState } from "react";
import axios from "axios";
import DashboardLayout from "./DashboardLayout";

function JoinClassroom() {
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/classroom/join",
        { inviteCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Joined classroom successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to join classroom");
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
        <h2>Join Classroom</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Join
          </button>
        </form>
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>
    </DashboardLayout>
  );
}

export default JoinClassroom;
