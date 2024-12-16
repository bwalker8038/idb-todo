import type { IDBPDatabase } from "idb";
import type { Todo, Store } from "./types";
import { fetchAllTodos, patchTodo } from "./api";

export async function bulkAddTodos(todos: Todo[], store: IDBPDatabase<Store>) {
  const tx = store.transaction("todos", "readwrite");
  const todosStore = tx.store;

  await todosStore.clear();
  await Promise.all(todos.map((todo) => todosStore.put(todo)));
  await tx.done;
}

export async function getAllTodos(store: IDBPDatabase<Store>) {
  const tx = store.transaction("todos");
  const todosStore = tx.store;

  return todosStore.getAll();
}

export async function updateTodo(todo: Todo, store: IDBPDatabase<Store>) {
  const tx = store.transaction("todos", "readwrite");
  const todosStore = tx.store;

  await todosStore.put(todo);
  await tx.done;
}

export async function seedTodosFromAPI(store: IDBPDatabase<Store>) {
  try {
    const todos = await fetchAllTodos();
    await bulkAddTodos(todos, store);
  } catch (e) {
    console.error(e);
    throw new Error("An error occurred while fetching todos");
  }
}

export async function updateTodoWithAPI(
  todo: Todo,
  store: IDBPDatabase<Store>,
  signal: AbortSignal
) {
  try {
    // Optimistically update the todo in the store
    await Promise.race([updateTodo(todo, store), patchTodo(todo, signal)]);
  } catch (e) {
    console.error(e);
    throw new Error("An error occurred while updating the todo");
  }
}
