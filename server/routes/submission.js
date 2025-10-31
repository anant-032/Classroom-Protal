const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const Submission = require("../models/Submission.js");
const Assignment = require("../models/Assignment.js");
const router = express.Router();

const fs = require("fs");

// ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ------------------------------
// MULTER SETUP
// ------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads")); // store in /server/uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ------------------------------
// POST /api/submission
// STUDENT: Submit an assignment
// ------------------------------
// ------------------------------
// POST /api/submission
// STUDENT: Submit an assignment
// ------------------------------
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { student, assignment } = req.body;

    // validate fields
    if (!student || !assignment) {
      return res.status(400).json({ message: "Missing student or assignment ID" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // check if assignment exists
    const assignmentExists = await Assignment.findById(assignment);
    if (!assignmentExists) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // prevent duplicate submission
    const alreadySubmitted = await Submission.findOne({ student, assignment });
    if (alreadySubmitted) {
      return res.status(400).json({ message: "You already submitted this assignment" });
    }

    // construct file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    // save to db
    const newSubmission = new Submission({
      student,
      assignment,
      fileUrl,
      submissionDate: new Date(),
    });

    await newSubmission.save();

    return res.status(201).json({
      message: "Submission uploaded successfully",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("❌ Error submitting assignment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// ------------------------------
// GET /api/submission/:assignmentId
// TEACHER: View all submissions for a given assignment
// ------------------------------
router.get("/:assignmentId/student/:studentId", async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;

    console.log("Fetching feedback for:", { assignmentId, studentId }); // 👈 Add log

    // validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(assignmentId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({ message: "Invalid assignmentId or studentId" });
    }

    const submission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId,
    }).populate("assignment", "title dueDate");

    if (!submission) {
      return res.status(404).json({ message: "No submission found" });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error("❌ Error fetching student feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ------------------------------
// PUT /api/submission/:id
// STUDENT: Edit (resubmit) an assignment
// ------------------------------
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params; // submission id
    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // check if file is provided
    if (!req.file) {
      return res.status(400).json({ message: "No new file uploaded" });
    }

    // delete old file if exists
    if (submission.fileUrl) {
      const oldPath = path.resolve(__dirname, `..${submission.fileUrl}`);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // update file url
    submission.fileUrl = `/uploads/${req.file.filename}`;
    submission.submissionDate = new Date();

    await submission.save();

    res.status(200).json({
      message: "Submission updated successfully",
      submission,
    });
  } catch (error) {
    console.error("❌ Error updating submission:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ------------------------------
// PUT /api/submission/:id/feedback
// TEACHER: Add or update feedback and grade for a submission
// ------------------------------
router.put("/:id/feedback", async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.grade = grade || submission.grade;
    submission.feedback = feedback || submission.feedback;

    await submission.save();

    res.status(200).json({
      message: "Feedback updated successfully",
      submission,
    });
  } catch (error) {
    console.error("❌ Error updating feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ------------------------------
// GET /api/submission/:assignmentId
// TEACHER: Get all submissions for an assignment
// ------------------------------
router.get("/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .populate("assignment", "title dueDate");

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: "No submissions found" });
    }

    res.status(200).json(submissions);
  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ------------------------------
// GET /api/submission/:assignmentId/student/:studentId
// STUDENT: Get feedback for a specific assignment
// ------------------------------
router.get("/:assignmentId/student/:studentId", async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;

    const submission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId,
    }).populate("assignment", "title dueDate");

    if (!submission) {
      return res.status(404).json({ message: "No submission found" });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error("❌ Error fetching student feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;