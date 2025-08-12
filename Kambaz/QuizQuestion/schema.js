import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema(
  {
    _id: false,
    text: String,
    correct: { type: Boolean, default: false },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel", required: true },
    type: { type: String, enum: ["MCQ", "TRUE_FALSE", "FILL_BLANK"], default: "MCQ" },
    title: String,
    points: { type: Number, default: 1 },
    questionHtml: { type: String, default: "" },

    // MCQ
    choices: [choiceSchema],    // for MCQ

    // TRUE_FALSE
    correctBoolean: { type: Boolean, default: true },

    // FILL_BLANK
    acceptableAnswers: [{ type: String }],

    order: { type: Number, default: 0 },
  },
  { collection: "quiz_questions", timestamps: true }
);

export default questionSchema;
