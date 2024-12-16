import { TodoItem } from "./TodoItem";
import { Suspense } from "react";
import { Todo, useTodos } from "../db";
import { ErrorBoundary } from "react-error-boundary";

import styles from "./TodoList.module.css";
import { isOverdue } from "../utils";

function sortTodos(todos: Todo[]) {
  // if overdue, sort to the top
  // if complete, sort to the bottom
  // otherwise, sort by due date
  return todos.sort((a, b) => {
    if (a.isComplete && !b.isComplete) {
      return 1;
    }

    if (!a.isComplete && b.isComplete) {
      return -1;
    }

    if (isOverdue(a.dueDate) && !isOverdue(b.dueDate)) {
      return -1;
    }

    if (!isOverdue(a.dueDate) && isOverdue(b.dueDate)) {
      return 1;
    }

    return new Date(a.dueDate || "") < new Date(b.dueDate || "") ? -1 : 1;
  });
}

export function TodoList() {
  const { todos, error, refetch } = useTodos();
  return (
    <ErrorBoundary
      fallback={<ErrorFallback error={error} onReset={() => {}} />}
    >
      <Suspense fallback={<LoadingFallback itemCount={3} />}>
        <ul className={styles.TodoList}>
          {sortTodos(todos).map((todo) => (
            <li key={todo.id}>
              <TodoItem todo={todo} onUpdate={() => refetch()} />
            </li>
          ))}
        </ul>
      </Suspense>
    </ErrorBoundary>
  );
}

export function LoadingFallback({ itemCount = 3 }: { itemCount: number }) {
  return (
    <div>
      <ul className={styles.TodoList}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <li key={i}>Loading...</li>
        ))}
      </ul>
    </div>
  );
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  if (!error) {
    return null;
  }

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={onReset}>Try again</button>
    </div>
  );
}
