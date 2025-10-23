const express = require("express");
const multer = require("multer");
const path = require("path");
const Submission = require("../models/Submission.js");
const Assignment = require("../models/Assignment.js");

const router = express.Router();

// ------------------------------
// MULTER SETUP
// ------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // store in /server/uploads
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
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { student, assignment } = req.body;

    // validate fields
    if (!student || !assignment || !req.file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check if assignment exists
    const assignmentExists = await Assignment.findById(assignment);
    if (!assignmentExists) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // prevent duplicate submission
    const alreadySubmitted = await Submission.findOne({ student, assignment });
    if (alreadySubmitted) {
      return res
        .status(400)
        .json({ message: "You already submitted this assignment" });
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

    res
      .status(201)
      .json({
        message: "Submission uploaded successfully",
        submission: newSubmission,
      });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------
// GET /api/submission/:assignmentId
// TEACHER: View all submissions for a given assignment
// ------------------------------
router.get("/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .populate("assignment", "title");

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
