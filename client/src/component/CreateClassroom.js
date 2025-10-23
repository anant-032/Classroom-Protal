import React, { useState } from "react";
import API from "../api/axios";
import DashboardLayout from "./DashboardLayout";

function CreateClassroom() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // token from login

      const res = await API.post(
        "/classrooms",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(`✅ Classroom "${res.data.name}" created successfully!`);
      setName("");
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Failed to create classroom");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Create Classroom</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter classroom name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateClassroom;
