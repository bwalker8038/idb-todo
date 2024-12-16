# Todo App

A lightweight, offline-first Todo application built with modern web technologies. This app leverages **IndexedDB** for local storage, ensures seamless data synchronization with a backend API, and provides an intuitive user experience with React.

## Features

- **Offline-First Experience**: Todos are stored locally using IndexedDB, ensuring functionality even without an internet connection.
- **Data Synchronization**: Changes are automatically synchronized with the backend API when the app is online.
- **Fast and Efficient**: Optimistic updates ensure UI responsiveness.
- **Customizable Boot Behavior**: The app supports a `persist` flag that determines whether to reseed the database on reloads.
- **Secure Environment Variables**: API endpoint and API key are securely stored in a `.env` file.
- **Robust Error Handling**: Gracefully handles errors during data fetch, update, and sync operations.

## Tech Stack

- **React**: For building a modular, declarative UI.
- **Vite**: A fast build tool for modern web applications.
- **IndexedDB**: For local data storage using the `idb` library.
- **TypeScript**: For type safety and better developer experience.
- **Fetch API**: For RESTful communication with the backend.
- **ErrorBoundary & Suspense**: For managing loading states and fallback behavior.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- npm or Yarn

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/bwalker8038/todo-app.git
   cd todo-app
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root of the project and configure the following variables:

   ```env
   VITE_API_ENDPOINT=https://postman-endpoint-url.example.com
   VITE_API_KEY=your-api-key
   ```

4. **Run the App**:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

---

## Application Structure

### Key Files and Directories

- **`/src/components`**:
  Contains the UI components like `TodoList` and `TodoItem`.

- **`/src/db`**:
  - Implements all IndexedDB logic, including:
    - Store initialization (`connectStore`).
    - Seeding data from the backend API (`seedTodosFromAPI`).
    - Queries for fetching and updating data (`getAllTodos`, `updateTodoWithAPI`, etc.).
  - Contains custom hooks (`useTodos`, `useUpdateTodo`) to manage state and IndexedDB interactions.

### Data Flow

1. **Store Initialization**:

   - The IndexedDB store is initialized on app load using the `connectStore` function.
   - On first boot, or when `persist = false`, the database is seeded with todos fetched from the backend API.

2. **Fetching Todos**:

   - `useTodos` hook retrieves todos from the local store (`IndexedDB`) and manages loading/error states.

3. **Updating Todos**:
   - Updates are managed via the `useUpdateTodo` hook, which supports optimistic UI updates and API synchronization. It also supports request cancellation using `AbortController`.

---

## Customizable Boot Behavior

The app’s boot behavior is determined by the `persist` flag passed to the `connectStore` function:

- **`persist = false` (default)**:

  - Clears existing todos and fetches fresh data from the API during each app reload.
  - Useful for ensuring the app always starts with the latest data from the backend.

- **`persist = true`**:
  - Uses the existing data in the store and skips the network fetch on subsequent reloads.
  - Ideal for scenarios where network access is limited, or local data is sufficient.

Example usage:

```typescript
const store = await connectStore(true); // Skip seeding and use existing data
```

---

## API Endpoints and Environment Variables

### API Endpoints

1. **Fetch All Todos**:

   - **Endpoint**: `${VITE_API_ENDPOINT}/get`
   - **Method**: `GET`
   - **Description**: Fetches all todos from the backend.

2. **Update a Todo**:
   - **Endpoint**: `${VITE_API_ENDPOINT}/patch/${todoId}`
   - **Method**: `PATCH`
   - **Description**: Updates a specific todo item.

### Environment Variables

- **`VITE_API_ENDPOINT`**:
  The base URL for the API.
- **`VITE_API_KEY`**:
  The API key for authenticating requests.

These variables are accessed in the code using Vite's environment variable support:

```typescript
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const API_KEY = import.meta.env.VITE_API_KEY;
```

---

## Developer Notes

### IndexedDB Schema

- **Object Store**: `todos`
  - `id` (Primary Key)
  - `description` (String)
  - `isComplete` (Boolean)
  - `dueDate` (String or null)

### Key Functions and Hooks

- **`connectStore(persist: boolean)`**:
  Initializes the IndexedDB store and seeds data from the API based on the `persist` flag.

- **`seedTodosFromAPI`**:
  Fetches todos from the backend API and populates the IndexedDB store.

- **`useTodos`**:
  A custom hook that handles loading, fetching, and error management for todos from IndexedDB.

- **`useUpdateTodo`**:
  A custom hook that manages todo updates with optimistic UI updates and API synchronization. Supports request cancellation via `AbortController`.


## Possible Enhancements

- **Advanced Sorting**: Add more sophisticated sorting or filtering options for todos.
- **PWA Support**: Make the app installable and usable as a Progressive Web App.
- **Conflict Resolution**: Handle sync conflicts between local changes and the backend.
- **Dark Mode**: Add theming options for better user experience.

---

## Author

Developed by [Brad Walker](https://github.com/bwalker8038).

