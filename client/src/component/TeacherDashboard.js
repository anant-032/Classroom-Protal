// TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./TeacherDashboard.css";


function TeacherDashboard({ user }) {
  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [classroomRes, assignmentRes] = await Promise.all([
          api.get("/classrooms", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/assignments/created", { headers: { Authorization: `Bearer ${token}` } }),

        ]);

        setClassrooms(classroomRes.data);
        setAssignments(assignmentRes.data);
      } catch (err) {
        console.error("Error loading teacher dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const now = new Date();
  const upcoming = assignments.filter(a => new Date(a.dueDate) > now);
  const completed = assignments.filter(a => new Date(a.dueDate) <= now);

  if (loading) return <p className="loading">Loading teacher dashboard...</p>;

  return (
    <div className="dashboard teacher">
      <div className="header">
        <h1>
          Welcome, <span>{user.name || "Teacher"}</span>
        </h1>
        <p className="role">Teacher Dashboard</p>
      </div>

      <div className="stats">
        <div className="stat primary">
          <h3>Total Classrooms</h3>
          <p>{classrooms.length}</p>
        </div>
        <div className="stat success">
          <h3>Total Assignments</h3>
          <p>{assignments.length}</p>
        </div>
        <div className="stat warning">
          <h3>Total Students</h3>
          <p>
            {classrooms.reduce((total, c) => total + (c.students?.length || 0), 0)}
          </p>
        </div>
      </div>

      <section className="assignments">
        <h2>Upcoming Assignments</h2>
        <div className="assignment-grid">
          {upcoming.length > 0 ? (
            upcoming.map(a => (
              <div key={a._id} className="assignment-card">
                <h3>{a.title}</h3>
                <p className="due">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                <button>View Details</button>
              </div>
            ))
          ) : (
            <p className="empty">No upcoming assignments.</p>
          )}
        </div>

        <h2>Completed Assignments</h2>
        <div className="assignment-grid">
          {completed.length > 0 ? (
            completed.map(a => (
              <div key={a._id} className="assignment-card">
                <h3>{a.title}</h3>
                <p className="due">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                <button>View Submissions</button>
              </div>
            ))
          ) : (
            <p className="empty">No completed assignments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default TeacherDashboard;
