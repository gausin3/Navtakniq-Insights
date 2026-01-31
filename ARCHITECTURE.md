# Project Architecture

This project is a **Full-Stack TypeScript Web Application** built with a **Monorepo-style structure**. It combines a React frontend and an Express backend, designed to share types and validation schemas for end-to-end type safety.

## 1. High-Level Architecture
*   **Frontend**: React (built with Vite), using `wouter` for routing, `Tailwind CSS` for styling, and `shadcn/ui` for components.
*   **Backend**: Node.js with Express.
*   **Database**: Neon (Postgres) using `Drizzle ORM`.
*   **Communication**: REST API. The frontend fetches data from the backend endpoints.
*   **Deployment**: Vercel (Frontend served as static assets, Backend as Serverless Functions).

## 2. Directory Structure

### `/shared` (The Glue)
This is the most critical part for type safety. It contains code shared between client and server.
*   **`schema.ts`**: Defines your database tables using Drizzle ORM and auto-generates Zod validation schemas.
*   **`routes.ts`**: (If present) types for API responses or shared utility functions.

### `/server` (The Backend)
Handles API requests and database interactions.
*   **`app_factory.ts`**: Creates and configures the Express app. We refactored this recently to separate "app creation" from "server listening" so it works on Vercel.
*   **`routes.ts`**: Defines the API endpoints (e.g., `GET /api/posts`). It uses the validation schemas from `@shared`.
*   **`storage.ts`**: An abstraction layer (DAO pattern) for database operations. The routes call methods here (like `getBlogPosts`), and this file talks to the DB.
*   **`db.ts`**: Initializes the database connection using `@neondatabase/serverless` and Drizzle.
*   **`index.ts`**: The entry point for **local development**. It starts a traditional Node.js server.

### `/client` (The Frontend)
Standard Vite + React application.
*   **`src/App.tsx`**: The main component setting up Routing (simulated via `wouter`) and Providers (React Query).
*   **`src/pages/`**: Individual page components (Home, Blog, Services).
*   **`src/lib/`**: Utilities, including the React Query client for fetching data.
*   **`src/hooks/`**: Custom hooks (e.g., `usePosts`) that wrap data fetching logic.

### `/api` (Vercel Integration)
*   **`index.ts`**: This is a special file we created. It tells Vercel: "Hey, take the Express app from `server/app_factory.ts` and turn it into a Serverless Function." This bridges the gap between a standard Express app and Vercel's serverless environment.

## 3. Key Workflows

### A. Data Fetching Flow
When a user visits the "Insights" (Blog) page:
1.  **Frontend**: `client/src/pages/Blog.tsx` calls the `usePosts()` hook.
2.  **API Call**: `usePosts` makes a `GET` request to `/api/posts`.
3.  **Vercel Routing**: The request hits `/api/posts`. `vercel.json` rewrites this to the `/api/index.ts` serverless function.
4.  **Backend Processing**:
    *   The request enters `api/index.ts`.
    *   It passes to the Express app in `server/app_factory.ts`.
    *   It matches the route in `server/routes.ts`.
5.  **Database Access**: `server/routes.ts` calls `storage.getBlogPosts()`.
6.  **Query**: `server/storage.ts` uses Drizzle ORM to generate a SQL query and sends it to Neon Postgres via `server/db.ts`.
7.  **Response**: Data flows all the way back up to the React component to be rendered.

### B. Routing Flow
*   **Client-Side Routing**: Handled by `wouter` in React. When you click a link, the URL changes in the browser, and React renders a new component *without* reloading the page.
*   **Server-Side Routing**: Handled by Express. API requests (starting with `/api`) function normally.
*   **The Catch-All**: In `server/static.ts`, we have a "catch-all" route (`app.use((_req, res) => ...)`). If a request comes in that isn't an API call (like `/about` or `/services`), the server sends back `index.html`. This allows the React app to load and handle the routing itself (this is crucial for SPAs).

## 4. Specific Vercel Configurations

### `vercel.json`
This configuration file handles:
*   **Rewrites**: Directs all traffic to the serverless function handler, ensuring the single entry point (`api/index.ts`) logic is used.
*   **Function Config**: Sets up the serverless function environment.

### ESM Strict Mode
The project uses `"type": "module"`, enforcing strict ECMAScript Modules.
*   **Extensions**: All local imports (e.g., `./routes.js`, `./db.js`) **must** include the `.js` extension, even though the source files are `.ts`.
*   **Build**: TypeScript compiles these references correctly, but Node.js (and Vercel) requires the explicit Extension at runtime.
