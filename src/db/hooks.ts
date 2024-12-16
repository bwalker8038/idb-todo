import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "./context";
import { Todo } from "./types";
import { getAllTodos, updateTodoWithAPI } from "./queries";

export function useStore() {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error(
      "useStore must be used within a StoreProvider. Wrap a parent component in <StoreProvider> to fix this error."
    );
  }

  return store;
}

export function useTodos() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [refetch, setRefetch] = useState(false);

  const store = useStore();

  useEffect(() => {
    getAllTodos(store)
      .then((result) => {
        setTodos(result);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsError(true);
        setError(e as Error);
      });
  }, [refetch, store]);

  return {
    todos,
    isLoading,
    isError,
    error,
    refetch: useCallback(() => setRefetch((r) => !r), []),
  };
}

export function useUpdateTodo() {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const update = useCallback(
    async (todo: Todo) => {
      // Cancel any existing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      try {
        await updateTodoWithAPI(todo, store, controller.signal);
      } catch (e) {
        setIsError(true);
        setError(e as Error);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [store]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    update,
    cancel,
    isLoading,
    isError,
    error,
  };
}
