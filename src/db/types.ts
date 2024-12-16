import { DBSchema, IDBPDatabase } from "idb";

export type Todo = {
  id: string;
  description: string;
  isComplete: boolean;
  dueDate: string | null;
};

export interface Store extends DBSchema {
  todos: {
    key: string;
    value: Todo;
    indexes: { id: string };
  };
}

export type DBStore = IDBPDatabase<Store>;
