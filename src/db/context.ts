import { createContext } from "react";
import { DBStore } from "./types";

export const StoreContext = createContext<DBStore | null>(null);
