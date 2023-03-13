export function validationTasksData({ title, description }) {
  if (!title) {
    return "Title is required"
  }

  if (!description) {
    return "Description is required"
  }
}