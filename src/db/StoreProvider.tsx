import { StoreContext } from "./context";
import type { DBStore } from "./types";

interface Props {
  store: DBStore;
  children: React.ReactNode;
}

export function StoreProvider({ store, children }: Props) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
