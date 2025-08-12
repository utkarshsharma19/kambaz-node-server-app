import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course:   { type: String, ref: "CourseModel", required: true },
    title:    { type: String, default: "New Quiz" },
    description: { type: String, default: "" },

    // publishing / availability
    published: { type: Boolean, default: false },
    due:          Date,
    availableFrom: Date,
    availableUntil: Date,

    // meta / settings
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimitMinutes: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    attemptsAllowed:  { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "" }, // simplify
    accessCode:       { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired:     { type: Boolean, default: false },
    lockAfterAnswering: { type: Boolean, default: false },

    createdBy: { type: String, ref: "UserModel" },
  },
  { collection: "quizzes", timestamps: true }
);

export default quizSchema;
