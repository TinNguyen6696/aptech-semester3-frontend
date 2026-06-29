# Talent Platform — Frontend

Frontend for the Talent Platform application, built with React 19 and TypeScript.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript 6](https://www.typescriptlang.org/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Routing | [TanStack Router](https://tanstack.com/router) — file-based routing |
| Server State | [TanStack Query](https://tanstack.com/query) — data fetching & caching |
| Forms | [TanStack Form](https://tanstack.com/form) |
| Tables | [TanStack Table](https://tanstack.com/table) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Font | [Inter (variable)](https://rsms.me/inter/) |
| Linting | ESLint 10 + typescript-eslint |
| Formatting | Prettier + prettier-plugin-tailwindcss |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/)
- Backend API running at `http://localhost:5208` (ASP.NET Core)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then open `.env` and set your API URL:

```env
VITE_API_URL=http://localhost:5208/api
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run typecheck` | Run TypeScript type checking without emitting |

---

## State Management

| Type | Solution |
|---|---|
| Server state (API data) | [TanStack Query](https://tanstack.com/query) — caching, fetching, loading/error states |
| Client state (UI state) | `useState` / `useContext` — sufficient for most cases |

> Zustand will be added if global client state becomes complex enough to warrant it.

---

## Project Structure

```
src/
├── assets/                  # Static files (images, svgs)
├── components/
│   ├── common/              # Shared reusable components
│   └── ui/                  # shadcn/ui auto-generated components (do not edit)
├── hooks/                   # Shared custom hooks
├── lib/
│   ├── axios.ts             # Axios instance (base URL + interceptors)
│   └── utils.ts             # Utility functions (cn helper)
├── routes/                  # TanStack Router file-based routes
│   ├── __root.tsx           # Root layout (wraps entire app)
│   ├── index.tsx            # Home page (/)
│   ├── _auth/               # Pathless layout — protected routes (auth guard)
│   └── (public)/            # Pathless group — unauthenticated pages
├── services/                # API call functions grouped by domain
├── types/                   # TypeScript interfaces/DTOs matching backend responses
```

---

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). To add a new component:

```bash
npx shadcn@latest add <component-name>
```

Components are placed in `src/components/ui/`.
