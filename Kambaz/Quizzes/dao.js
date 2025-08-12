import { v4 as uuidv4 } from "uuid";
import QuizModel from "./model.js";
import QuestionModel from "../QuizQuestion/model.js";
import AttemptModel from "../QuizAttempts/model.js";

/* ---------- Quizzes ---------- */
export const findQuizzesForCourse = (courseId) =>
  QuizModel.find({ course: courseId });

export const findQuizById = (id) => QuizModel.findById(id);

export const createQuiz = (quiz) => {
  const newQuiz = { ...quiz, _id: uuidv4() };
  return QuizModel.create(newQuiz);
};

export const updateQuiz = (quizId, updates) =>
  QuizModel.findOneAndUpdate({ _id: quizId }, { $set: updates }, { new: true });

export const deleteQuiz = (quizId) =>
  QuizModel.deleteOne({ _id: quizId });

/* ---------- Questions ---------- */
export const listQuestions = (quizId) =>
  QuestionModel.find({ quiz: quizId }).sort({ order: 1, createdAt: 1 });

export const createQuestion = (quizId, q) => {
  const _id = uuidv4();
  return QuestionModel.create({ ...q, quiz: quizId, _id });
};

export const updateQuestion = (questionId, updates) =>
  QuestionModel.findOneAndUpdate({ _id: questionId }, { $set: updates }, { new: true });

export const deleteQuestion = (questionId) =>
  QuestionModel.deleteOne({ _id: questionId });

/* ---------- Attempts ---------- */
export const countAttemptsForUserQuiz = (userId, quizId) =>
  AttemptModel.countDocuments({ user: userId, quiz: quizId });

export const findLastAttemptForUserQuiz = (userId, quizId) =>
  AttemptModel.findOne({ user: userId, quiz: quizId }).sort({ attemptNumber: -1, createdAt: -1 });

/* Grade + save attempt */
export async function submitAttempt(userId, quizId, answersPayload) {
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  const questions = await QuestionModel.find({ quiz: quizId });
  const byId = new Map(questions.map((q) => [q._id, q]));

  // grade
  let score = 0;
  const gradedAnswers = (answersPayload || []).map(({ questionId, value }) => {
    const q = byId.get(questionId);
    if (!q) return { question: questionId, value, isCorrect: false, pointsAwarded: 0 };

    let isCorrect = false;
    if (q.type === "TRUE_FALSE") {
      isCorrect = Boolean(value) === Boolean(q.correctBoolean);
    } else if (q.type === "FILL_BLANK") {
      const norm = String(value || "").trim().toLowerCase();
      isCorrect = (q.acceptableAnswers || []).some(
        (ans) => String(ans).trim().toLowerCase() === norm
      );
    } else {
      // MCQ → value is index or choice text; we accept either
      let idx = -1;
      if (typeof value === "number") idx = value;
      else {
        const text = String(value || "");
        idx = (q.choices || []).findIndex((c) => c.text === text);
      }
      isCorrect = idx >= 0 && q.choices?.[idx]?.correct === true;
    }

    const pointsAwarded = isCorrect ? (q.points || 0) : 0;
    score += pointsAwarded;

    return {
      question: q._id,
      value,
      isCorrect,
      pointsAwarded,
    };
  });

  const attemptCount = await countAttemptsForUserQuiz(userId, quizId);
  const attemptNumber = attemptCount + 1;

  const attempt = {
    _id: uuidv4(),
    quiz: quizId,
    user: userId,
    attemptNumber,
    startedAt: new Date(),
    submittedAt: new Date(),
    score,
    answers: gradedAnswers,
  };

  const saved = await AttemptModel.create(attempt);
  return saved;
}
