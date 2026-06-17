# SMMS - Resume Points

Pick 2-3 that best fit the job you're applying for.

---

## For a Full-Stack Developer role

- Built a full-stack MERN maintenance management system with JWT authentication,
  role-based access (Admin/Technician), and complete CRUD operations across 6 data models.

- Designed a layered backend architecture (routes → controllers → services → models)
  with input validation, error handling middleware, and activity logging for
  production-level code quality.

- Implemented stateless JWT authentication with bcrypt password hashing and Axios
  interceptors that automatically attach tokens and handle 401 responses.

- Developed 12 React pages with reusable components (DataTable, ConfirmDialog,
  StatusBadge, SearchBar, FilterDropdown) and a custom useFetch hook that prevents
  infinite re-render loops using useRef.

- Built auto-history tracking that creates maintenance records when work orders
  are completed, and a dashboard with parallel-count queries for real-time stats.

- Wrote 68 source files with consistent coding patterns, proper error handling,
  and simple inline comments for maintainability.

---

## For a Backend Developer role

- Designed a REST API with Express following a service-layer pattern where
  controllers handle request parsing, services contain business logic, and models
  handle database operations — achieving clear separation of concerns.

- Implemented JWT authentication middleware with role-based guards
  (Admin/Technician) protecting routes, with bcryptjs for secure password storage.

- Built MongoDB schemas with Mongoose using proper relationships (refs, populate),
  timestamps on all models, and validation at both schema and application layers.

- Created an activity logging system using a utility function that records user
  actions to a dedicated collection for audit trail purposes.

- Wrote a dashboard aggregation endpoint that runs 7 parallel MongoDB count
  queries using Promise.all for efficient stats retrieval.

---

## For a Frontend Developer role

- Built 12 React pages with React Router v6, protected route guards, and a
  responsive sidebar layout that collapses on mobile.

- Created 8 reusable components (DataTable, ConfirmDialog, StatusBadge,
  StatCard, SearchBar, FilterDropdown, LoadingSpinner, EmptyState) that are
  shared across multiple pages for consistent UI.

- Implemented AuthContext with React Context API for global authentication state,
  eliminating prop drilling across the component tree.

- Built a custom useFetch hook that handles loading, error, and data states
  with a useRef pattern to prevent infinite re-fetch loops — a common React
  pitfall.

- Used Axios with request/response interceptors for automatic JWT token injection
  and 401 redirect, keeping authentication logic centralized.

---

## Keywords to sprinkle in

MERN Stack | React | Node.js | Express | MongoDB | Mongoose | JWT | bcrypt
REST API | CRUD | Authentication | Authorization | Middleware | Context API
Axios | React Router | TailwindCSS | Async/Await | Service Layer | MVC

---

## How to present it on your resume

```
Smart Maintenance Management System (SMMS)
Full-Stack MERN Application | github.com/oxbhabani/smms

• Built a full-stack maintenance management platform with JWT authentication,
  role-based access (Admin/Technician), and CRUD for machines, work orders,
  and schedules.
• Designed a layered API architecture with Express, Mongoose ODM, and service-layer
  pattern achieving clean separation of business logic from request handling.
• Developed 12 responsive React pages with reusable components, Context API for
  auth state, and a custom useFetch hook with infinite-loop prevention.
• Implemented auto-maintenance-history tracking triggered on work order completion
  and a real-time dashboard with 7 aggregated stats via parallel DB queries.
```
