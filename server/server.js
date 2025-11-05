const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import route files
const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const classroomRoutes = require("./routes/classroom");
const submissionRoutes = require("./routes/submission");


app.get("/",(req,res)=>{
  console.log("api hit")
  res.send("Server is running on 5000")
})

// Use route files
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});