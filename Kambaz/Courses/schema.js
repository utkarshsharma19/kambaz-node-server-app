import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    // (optional) startDate, endDate, image, etc. if you store them on the course doc
    startDate: String,
    endDate: String,
    image: String,
  },
  { collection: "courses" }
);

export default courseSchema;
