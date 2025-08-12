import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: String, ref: "QuizQuestionModel", required: true },
    value: mongoose.Schema.Types.Mixed,   // string | number | boolean
    isCorrect: Boolean,
    pointsAwarded: { type: Number, default: 0 },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel", required: true },
    user: { type: String, ref: "UserModel", required: true },
    attemptNumber: Number,
    startedAt: Date,
    submittedAt: Date,
    score: { type: Number, default: 0 },
    answers: [answerSchema],
  },
  { collection: "quiz_attempts", timestamps: true }
);

export default attemptSchema;
