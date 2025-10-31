import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./StudentDashboard.css";


const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get("/assignments/student");
        setAssignments(data);

        const total = data.length;
        const upcoming = data.filter(a => !a.submitted).length;
        const completed = data.filter(a => a.submitted).length;

        setStats({ total, upcoming, completed });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="student-dashboard">
      <aside className="sidebar">
        <h2>Classroom</h2>
        <ul>
          <li>Dashboard</li>
          <li>Join Classroom</li>
          <li>Submit Work</li>
          <li>My Classrooms</li>
        </ul>
        <button className="logout-btn">Logout</button>
      </aside>

      <main className="dashboard-content">
        <h1>Classroom Assignment Portal</h1>
        <h2>
          Welcome, <span>{user?.name}</span>
        </h2>
        <p>Student</p>

        <div className="stats">
          <div className="stat-box total">
            <h3>Total </h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-box upcoming">
            <h3>Upcoming</h3>
            <p>{stats.upcoming}</p>
          </div>
          <div className="stat-box completed">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>

        <section className="assignments-section">
          <h3>Assignments</h3>
          <div className="assignments-list">
            {assignments.length === 0 ? (
              <p>No assignments found.</p>
            ) : (
              assignments.map(a => (
                <div key={a._id} className="assignment-card">
                  <h4>{a.title}</h4>
                  <p>Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                  <button>Submit</button>
                  <button>View Feedback</button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;