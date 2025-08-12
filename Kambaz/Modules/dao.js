import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// READ
export function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

// CREATE (return created doc)
export function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}

// UPDATE — return updated doc (so UI can replace it)
export function updateModule(moduleId, updates) {
  return model.findByIdAndUpdate(
    moduleId,
    { $set: updates },
    { new: true }
  );
}

// DELETE
export function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}
