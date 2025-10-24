import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import DashboardLayout from "./DashboardLayout";
import "./Dashboard.css";

function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "student";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [navigate, user]);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  const total = assignments.length;
  const upcoming = assignments.filter((a) => new Date(a.dueDate) > new Date()).length;
  const completed = total - upcoming;

  const stats = [
    { title: "Total", count: total, color: "primary" },
    { title: "Upcoming", count: upcoming, color: "warning" },
    { title: "Completed", count: completed, color: "success" },
  ];

  return (
    <DashboardLayout>
      <header className="header">
        <div>
          <h1>
            Welcome, <span>{user?.name || "User"}</span>
          </h1>
          <p className="role">{role}</p>
        </div>
      </header>

      <section className="stats">
        {stats.map((s) => (
          <div key={s.title} className={`stat ${s.color}`}>
            <h3>{s.title}</h3>
            <p>{s.count}</p>
          </div>
        ))}
      </section>

      <section className="assignments">
        <h2>Assignments</h2>
        {assignments.length === 0 ? (
          <p className="empty">No assignments found.</p>
        ) : (
          <div className="assignment-grid">
            {assignments.map((a) => {
              const isExpired = new Date(a.dueDate) < new Date();

              return (
                <div key={a._id} className="assignment-card">
                  <h3>{a.title}</h3>
                  <p className="due">
                    Due: {new Date(a.dueDate).toLocaleDateString()}
                  </p>

                  {role === "teacher" ? (
                    <>
                      <button onClick={() => navigate(`/view-submissions/${a._id}`)}>
                        View Submissions
                      </button>
                      <button onClick={() => navigate(`/edit-assignment/${a._id}`)}>
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      {isExpired ? (
                        <button className="expired" disabled>
                          Expired
                        </button>
                      ) : (
                        <button onClick={() => navigate(`/submit/${a._id}`)}>Submit</button>
                      )}
                      <button onClick={() => navigate(`/view-feedback/${a._id}`)}>
                        View Feedback
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;
