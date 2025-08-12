import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" }, // FK to courses._id (string)
    user:   { type: String, ref: "UserModel"   }, // FK to users._id (string)

    // optional extras
    grade: Number,
    letterGrade: String,
    enrollmentDate: Date,
    status: {
      type: String,
      enum: ["ENROLLED", "DROPPED", "COMPLETED"],
      default: "ENROLLED",
    },
  },
  { collection: "enrollments" }
);

export default enrollmentSchema;
