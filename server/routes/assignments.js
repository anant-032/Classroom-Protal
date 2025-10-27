const express = require("express");
const Assignment = require("../models/Assignment");
const authMiddleware = require("../middleware/auth");
const Classroom = require("../models/classroom");

const router = express.Router();

// ✅ GET all assignments (for logged-in users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("classroom", "name");
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

// ✅ POST new assignment (only teachers)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Only teachers can create assignments
    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create assignments" });
    }

    const { title, description, dueDate, classroom } = req.body;
    if (!title || !dueDate || !classroom) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      classroom,
      createdBy: user._id,
    });

    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get assignments created by the logged-in teacher
router.get("/created", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access this endpoint" });
    }

    // find assignments created by this teacher
    const assignments = await Assignment.find({ createdBy: user._id }).populate("classroom", "name");
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching created assignments:", error);
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

// Get assignments relevant for the logged-in student
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // if student -> fetch classrooms they belong to, then assignments for those classrooms
    if (user.role === "student") {
      // find classrooms that include this student
      const classrooms = await Classroom.find({ students: user._id }).select("_id");
      const classroomIds = classrooms.map((c) => c._id);

      const assignments = await Assignment.find({ classroom: { $in: classroomIds } }).populate(
        "classroom",
        "name"
      );
      return res.json(assignments);
    }

    // if teacher -> return assignments created by this teacher (helpful if teacher hits /my)
    if (user.role === "teacher") {
      const assignments = await Assignment.find({ createdBy: user._id }).populate("classroom", "name");
      return res.json(assignments);
    }

    res.status(403).json({ message: "Invalid user role" });
  } catch (error) {
    console.error("Error fetching my assignments:", error);
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

// ✅ GET single assignment by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ message: "Error fetching assignment" });
  }
});

// ✅ UPDATE assignment by ID (only teacher who created it)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can update assignments" });
    }

    const { title, description, dueDate } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Optional: ensure the teacher who created it is editing it
    if (assignment.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own assignments" });
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;

    await assignment.save();

    res.json({ message: "Assignment updated successfully", assignment });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ message: "Error updating assignment" });
  }
});


module.exports = router;
