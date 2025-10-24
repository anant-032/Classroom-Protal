// src/component/DashboardLayout.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLogOut,
  FiBookOpen,
  FiPlusCircle,
  FiUsers,
  FiList,
  FiUploadCloud,
} from "react-icons/fi";
import "./Dashboard.css";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Classroom</h2>
        <ul className="menu">
          <li onClick={() => navigate("/dashboard")}>
            <FiHome /> Dashboard
          </li>

          {role === "teacher" && (
            <>
              <li onClick={() => navigate("/create-classroom")}>
                <FiUsers /> Create Classroom
              </li>
              <li onClick={() => navigate("/create-assignment")}>
                <FiPlusCircle /> Create Assignment
              </li>
            </>
          )}

          {role === "student" && (
            <>
              <li onClick={() => navigate("/join-classroom")}>
                <FiUsers /> Join Classroom
              </li>
              <li onClick={() => navigate("/submit-assignment")}>
                <FiUploadCloud /> Submit Work
              </li>
            </>
          )}

          <li onClick={() => navigate("/classrooms")}>
            <FiList /> My Classrooms
          </li>
        </ul>

        <button className="logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main">{children}</main>
    </div>
  );
}

export default DashboardLayout;
