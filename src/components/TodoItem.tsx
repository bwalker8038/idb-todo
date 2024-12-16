import { Todo, useUpdateTodo } from "../db";
import { isOverdue } from "../utils";
import styles from "./TodoItem.module.css";

type Props = {
  todo: Todo;
  onUpdate: () => void;
};

export function TodoItem({ todo, onUpdate }: Props) {
  const updateTodo = useUpdateTodo();

  const onToggle = async (todo: Todo) => {
    // Cancel any existing requests
    updateTodo.cancel();
    await updateTodo.update({
      ...todo,
      isComplete: !todo.isComplete,
    });
    onUpdate();
  };

  const setClasses = () => {
    const classes = [styles.TodoItem];

    // A todo cannot be both complete and overdue
    if (todo.isComplete) {
      classes.push(styles.Completed);
    } else if (isOverdue(todo.dueDate)) {
      classes.push(styles.Overdue);
    }

    return classes.join(" ");
  };

  return (
    <div className={setClasses()}>
      <input
        id={todo.id}
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => onToggle(todo)}
      />
      <label htmlFor={todo.id}>
        <span>{todo.description}</span>
        {todo.dueDate && (
          <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
        )}
      </label>
    </div>
  );
}
