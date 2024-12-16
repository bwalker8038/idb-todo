export function isOverdue(dueDate: string | null) {
  if (!dueDate) {
    return false;
  }

  return new Date(dueDate) < new Date();
}
