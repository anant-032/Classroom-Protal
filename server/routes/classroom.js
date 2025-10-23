const express = require("express");
const Classroom = require("../models/classroom");
const authMiddleware = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// CREATE CLASSROOM (Teacher)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create classrooms" });
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Classroom name is required" });

    const inviteCode = uuidv4().slice(0, 8);
    const classroom = await Classroom.create({
      name,
      teacher: user._id,
      inviteCode,
    });

    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// JOIN CLASSROOM (Student)
router.post("/join", authMiddleware, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const classroom = await Classroom.findOne({ inviteCode });
    if (!classroom) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    if (classroom.students.includes(req.user.id)) {
      return res.status(400).json({ message: "You already joined this classroom" });
    }

    classroom.students.push(req.user.id);
    await classroom.save();

    res.json({ message: "Joined classroom successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while joining classroom" });
  }
});

// GET CLASSROOMS (For logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    let classrooms;

    if (user.role === "teacher") {
      classrooms = await Classroom.find({ teacher: user._id });
    } else if (user.role === "student") {
      classrooms = await Classroom.find({ students: user._id });
    } else {
      return res.status(403).json({ message: "Invalid user role" });
    }

    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
