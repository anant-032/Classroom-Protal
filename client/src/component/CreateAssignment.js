import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateAssignment.css";
import DashboardLayout from "..//component/DashboardLayout";

function CreateAssignment() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    classroom: "",
  });
  const [message, setMessage] = useState("");
  const [classrooms, setClassrooms] = useState([]); // to store fetched classrooms

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "teacher";

  // Fetch classrooms for the logged-in teacher
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/classrooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassrooms(res.data); // assuming API returns array of classrooms
      } catch (error) {
        console.error("Error fetching classrooms:", error);
        setMessage("❌ Failed to load classrooms");
      }
    };
    fetchClassrooms();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/assignments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Assignment created successfully!");
      setFormData({ title: "", description: "", dueDate: "", classroom: "" });
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "❌ Failed to create assignment"
      );
    }
  };

  return (
    <div className={`create-assignment ${role}`}>
      <h2>Create Assignment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        {/* Dropdown for classroom selection */}
        <select
          name="classroom"
          value={formData.classroom}
          onChange={handleChange}
          required
        >
          <option value="">Select Classroom</option>
          {classrooms.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name || `Classroom ${cls._id.slice(-5)}`}
            </option>
          ))}
        </select>

        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateAssignment;
