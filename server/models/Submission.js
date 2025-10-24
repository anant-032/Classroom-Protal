const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      default: "",
    },
    feedback: {
      type: String,
      default: "",
    },

  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Submission ||
  mongoose.model("Submission", submissionSchema);
