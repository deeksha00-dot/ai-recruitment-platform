# HireLens — AI Recruitment Platform (Frontend)

A production-ready React frontend for an AI-powered recruitment / ATS platform, built to talk to a
FastAPI backend over REST.

## Stack

- React 18 (Vite)
- JavaScript (no TypeScript)
- Tailwind CSS (custom blue/white theme, dark mode via `class` strategy)
- React Router DOM v6 (nested + role-based protected routes)
- Axios (with request/response interceptors)
- Context API (Auth, Theme, User)
- Chart.js via react-chartjs-2 (bar, line, doughnut/pie)
- React Icons (Feather icon set)
- React Toastify

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your FastAPI backend
npm run dev
```

The app runs at `http://localhost:5173` by default and expects the backend at the URL configured in
`.env` (`VITE_API_URL`, default `http://localhost:8000`).

## Project structure

```
src/
  assets/        static assets
  components/    reusable UI building blocks (cards, tables, charts, modals, forms...)
  context/        AuthContext, ThemeContext, UserContext
  hooks/          useDebounce, usePagination, useFetch, useClickOutside
  layouts/        DashboardLayout (sidebar/navbar shell), AuthLayout (login/register shell)
  pages/          one file per route/page
  services/       api.js (axios instance) + authService, jobService, candidateService,
                  matchingService, analyticsService
  styles/         global Tailwind entry (index.css)
  utils/          constants, validators, formatters
  App.jsx         route definitions
  main.jsx        app bootstrap (providers + router)
```

## Auth model

- JWT stored in `localStorage` (`access_token`), attached to every request via an Axios request
  interceptor.
- A response interceptor watches for `401` and dispatches a global `auth:logout` event, which
  `AuthContext` listens for to clear state and show a toast — giving a consistent "auto logout on
  401" experience anywhere in the app.
- `ProtectedRoute` guards authenticated routes and can additionally restrict by `allowedRoles`
  (`candidate`, `recruiter`, `admin`).

## Expected backend endpoints

The services layer assumes REST endpoints along these lines (adjust to match your FastAPI routes):

- `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `PUT /auth/me`,
  `POST /auth/change-password`
- `GET/POST /jobs`, `GET/PUT/DELETE /jobs/:id`, `GET /jobs/:id/applicants`,
  `POST /jobs/:id/apply`, `GET /jobs/my-applications`, `PATCH /jobs/:id/applicants/:appId`
- `GET /candidates`, `GET /candidates/:id`, `GET/PUT /candidates/me`,
  `POST /candidates/resume` (multipart), `GET /candidates/me/applications`,
  `GET /candidates/search`
- `GET /matching/candidate/:id`, `GET /matching/job/:id`,
  `GET /matching/job/:jobId/candidate/:candidateId`, `POST /matching/job/:id/run`
- `GET /analytics/overview`, `GET /analytics/applications-per-day`,
  `GET /analytics/top-skills`, `GET /analytics/hiring-funnel`, `GET /analytics/top-candidates`

## Notes

- Dark mode is toggled from the navbar/settings page and persisted in `localStorage`.
- Resume upload supports drag-and-drop, client-side type/size validation (PDF/DOCX, 10MB max),
  and an upload progress bar via Axios `onUploadProgress`.
- Charts, tables, and cards are all reusable components so pages stay thin and declarative.
