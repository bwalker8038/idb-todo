import { LoadingFallback, TodoList } from "./components/TodoList";

import "./styles/root.css";
import { connectStore, Store, StoreProvider } from "./db";
import { Suspense, useEffect, useState } from "react";

import style from "./App.module.css";
import { IDBPDatabase } from "idb";

// const store = await connectStore();

function App() {
  const [store, setStore] = useState<IDBPDatabase<Store> | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    async function initializeStore() {
      const connectedStore = await connectStore();
      setStore(connectedStore);
      setIsBooting(false);
    }

    initializeStore();
  }, []);

  if (isBooting || !store) {
    return (
      <>
        <header className={style.Header}>
          <h1>Todo List</h1>
        </header>
        <main>
          <LoadingFallback itemCount={3} />
        </main>
      </>
    );
  }

  return (
    <>
      <header className={style.Header}>
        <h1>Todo List</h1>
      </header>
      <main>
        <Suspense fallback={<div>Booting...</div>}>
          <StoreProvider store={store}>
            <TodoList />
          </StoreProvider>
        </Suspense>
      </main>
    </>
  );
}

export default App;
