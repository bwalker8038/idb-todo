import { openDB } from "idb";
import type { Store } from "./types";
import { getAllTodos, seedTodosFromAPI } from "./queries";

export async function connectStore(persist = false) {
  const store = await openDB<Store>("my-todo-app", 1, {
    upgrade(db) {
      const todoStore = db.createObjectStore("todos", {
        keyPath: "id",
        autoIncrement: true,
      });

      todoStore.createIndex("id", "id", { unique: true });
    },
  });

  try {
    const todos = await getAllTodos(store);
    if (todos.length === 0 || !persist) {
      await seedTodosFromAPI(store);
    }
  } catch (error) {
    console.error("Error during store initialization:", error);
    throw new Error("Failed to initialize IndexedDB.");
  }

  return store;
}
