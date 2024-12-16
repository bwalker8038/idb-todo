import { cancellableFetch } from "../utils";
import { Todo } from "./types";

export const fetchAllTodos = async (): Promise<Todo[]> => {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const API_KEY = import.meta.env.VITE_API_KEY;

  try {
    const response = await fetch(`${ENDPOINT}/get`, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result satisfies Todo[];
  } catch (e) {
    console.error(e);
    throw new Error("An error occurred while fetching todos");
  }
};

export async function patchTodo(todo: Todo, signal: AbortSignal) {
  const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const API_KEY = import.meta.env.VITE_API_KEY;

  try {
    const { fetchPromise, cancel } = cancellableFetch(
      `${ENDPOINT}/patch/${todo.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
        body: JSON.stringify(todo),
        signal,
      }
    );

    const response = await fetchPromise;

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const payload = await response.json();
    if (payload.status !== "success") {
      throw new Error("Network response was not ok");
    }

    return {
      response,
      cancel,
    };
  } catch (e) {
    console.error(e);
    throw new Error("An error occurred while updating the todo");
  }
}
