import './index.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Dashboard from "./component/Dashboard";
import CreateAssignment from "./component/assignments/CreateAssignment";
import CreateClassroom from "./component/CreateClassroom";
import JoinClassroom from "./component/JoinClassroom";
import ClassroomList from "./component/ClassroomList";
import SubmitAssignment from "./component/assignments/SubmitAssignment";
import DashboardLayout from "./component/DashboardLayout";
import ProtectedRoute from "./component/ProtectedRoute";
import ViewSubmissions from "./component/assignments/ViewSubmissions";
import EditAssignment from "./component/assignments/EditAssignment";
import ViewFeedback from "./component/assignments/ViewFeedback";

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
        <Route path="/view-feedback/:assignmentId" element={<ViewFeedback />} />
        {/* Protected Routes */}
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ProtectedRoute>   
  }
/>

        <Route
  path="/create-assignment"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <CreateAssignment />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
        <Route
  path="/create-classroom"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <CreateClassroom />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
        <Route
          path="/join-classroom"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <JoinClassroom />
              </DashboardLayout>
            </ProtectedRoute>

          }
        />
        <Route
          path="/classrooms"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClassroomList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-assignment"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SubmitAssignment />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* ✅ NEW: Submit page for a specific assignment */}
<Route
  path="/submit/:id"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <SubmitAssignment />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
        {/* View Submissions Route */}
<Route
  path="/view-submissions/:id"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <ViewSubmissions />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/view-feedback/:id"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <ViewSubmissions />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>


{/* Edit Assignment Route */}
<Route
  path="/edit-assignment/:id"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <EditAssignment />
      </DashboardLayout>
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