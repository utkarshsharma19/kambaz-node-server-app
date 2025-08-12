import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    // one-to-many: each module points to its parent course _id
    course: { type: String, ref: "CourseModel", required: true },
  },
  { collection: "modules" }
);

export default moduleSchema;
