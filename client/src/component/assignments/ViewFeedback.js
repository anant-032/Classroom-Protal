import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentFeedback } from "../../api/submission";

function ViewFeedback() {
  const { assignmentId } = useParams();
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const studentId = storedUser?._id || storedUser?.id;
        const res = await getStudentFeedback(assignmentId, studentId);
        if (res.data) {
          setFeedback(res.data.feedback || "No feedback yet.");
          setGrade(res.data.grade || "Not graded yet.");
        }
      } catch (err) {
        setError("Could not load feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [assignmentId]);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Your Feedback</h2>
      <p><strong>Grade:</strong> {grade}</p>
      <p><strong>Teacher’s Feedback:</strong></p>
      <p>{feedback}</p>
    </div>
  );
}

export default ViewFeedback;