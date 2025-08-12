import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,                                   // keep string ids (uuid)
    course: { type: String, ref: "CourseModel", required: true },
    title: { type: String, required: true },
    description: String,
    points: { type: Number, default: 0 },
    assignmentGroup: String,
    displayGradeAs: String,
    assignTo: String,
    onlineEntryOptions: { type: [String], default: [] },
    due: String,              // store as ISO string (or Date if you prefer)
    availableFrom: String,
    availableUntil: String,
  },
  { collection: "assignments" }
);

export default assignmentSchema;
