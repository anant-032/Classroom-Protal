import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Dashboard from "./component/Dashboard";
import CreateAssignment from "./component/CreateAssignment";
import CreateClassroom from "./component/CreateClassroom";
import JoinClassroom from "./component/JoinClassroom";
import ClassroomList from "./component/ClassroomList";
import SubmitAssignment from "./component/assignments/SubmitAssignment";
import ProtectedRoute from "./component/ProtectedRoute";
// import SubmitAssignment from "./component/SubmitAssignment";
// import SubmitAssignment from "./component/SubmitAssignment";
import './index.css';

// Component to handle conditional header display
function AppContent() {
  const location = useLocation();

  // Hide the header on login, register, or root ("/") pages
  const hideHeader = ["/login", "/register", "/"].includes(location.pathname);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {!hideHeader && (
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Classroom Assignment Portal
        </h1>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-classroom"
          element={
            <ProtectedRoute>
              <CreateClassroom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-classroom"
          element={
            <ProtectedRoute>
              <JoinClassroom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classrooms"
          element={
            <ProtectedRoute>
              <ClassroomList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-assignment"
          element={
            <ProtectedRoute>
              <SubmitAssignment />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

// Wrap it with Router  
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
