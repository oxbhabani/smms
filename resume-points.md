# SMMS - STAR Framework Resume Points

Use 1-2 points per job application. Pick the ones most relevant to the role.

---

## STAR 1: Full Architecture Design

**Situation:** The factory had no centralized system to track machine maintenance,
leading to missed schedules, unplanned breakdowns, and no audit trail of repairs.

**Task:** Design and build a full-stack web application from scratch that lets
admins manage machines, schedules, and work orders, while technicians can
update their assigned tasks.

**Action:** Built a MERN application with a layered architecture
(routes → controllers → services → models) enforcing separation of concerns.
Implemented JWT authentication with Admin/Technician role guards on every
protected route. Created 6 Mongoose schemas with proper refs and populate for
relational data. Wrote input validators, error handling middleware, and an
activity logging utility that records every important action to the database.

**Result:** A production-quality system where adding a new feature means adding
one file in each layer without touching existing code. The activity log provides
a complete audit trail, and the service layer keeps controllers under 20 lines.

---

## STAR 2: Authentication & Security

**Situation:** Sensitive maintenance data required different access levels —
admins needed full control while technicians should only see and update their
own work orders.

**Task:** Implement secure authentication with role-based authorization.

**Action:** Used bcryptjs to hash passwords before storage, and JWT for
stateless authentication. Built reusable auth middleware that verifies the
token on every request and attaches the user object. Added an admin guard
middleware for restricted routes. On the frontend, created an Axios interceptor
that automatically attaches the JWT token to every request and redirects
unauthenticated users to login on 401 responses.

**Result:** Zero security vulnerabilities from plaintext passwords or missing
auth checks. Technicians are blocked from deleting machines or accessing other
techs' work orders at the API level, not just the UI.

---

## STAR 3: Frontend Architecture & Reusability

**Situation:** Building 12 pages with repetitive patterns (loading spinners,
empty states, data tables, search/filter, delete confirmations) would result
in bloated, hard-to-maintain code.

**Task:** Create a clean frontend architecture where UI patterns are written
once and reused across pages.

**Action:** Built 8 reusable components: DataTable, ConfirmDialog, StatusBadge,
StatCard, SearchBar, FilterDropdown, LoadingSpinner, and EmptyState. Created
a custom useFetch hook that handles loading/error/data states and used a useRef
pattern to prevent infinite re-render loops. Wrapped auth state in React Context
to avoid prop drilling. Used TailwindCSS utility classes to keep component
files small and consistent.

**Result:** Each page is under 100 lines of focused logic. Adding a new list
page takes 15 minutes — write the columns and call useFetch. The DataTable
component is used in 6 pages with zero duplication.

---

## STAR 4: Automated Business Logic

**Situation:** When a technician completes a work order, the maintenance history
needed to be recorded manually — causing incomplete records and data entry errors.

**Task:** Automate the history tracking so completed work orders are recorded
without human intervention.

**Action:** Added a status check in the work order service: when status changes
to "Completed", the service automatically creates a History document with the
machine, technician, completion date, and remarks. This happens in the same
database transaction, so the work order and history are always in sync.
Also built a dashboard endpoint that runs 7 parallel MongoDB count queries
using Promise.all for real-time stats.

**Result:** 100% accurate maintenance history with zero manual data entry.
The dashboard updates instantly when work orders are completed or machines
change status.

---

## STAR 5: Debugging a Critical Render Bug

**Situation:** After login, the dashboard page showed a loading spinner that
flickered continuously instead of displaying stats — making the app unusable.

**Task:** Diagnose and fix the infinite re-render loop.

**Action:** Traced the issue to the useFetch hook: every render created a new
arrow function reference, causing useCallback to see a changed dependency,
triggering useEffect → re-fetch → re-render → loop. Fixed it by storing the
fetch function in a useRef so the effect runs only once on mount while still
accessing the latest function. Documented the fix with inline comments.

**Result:** The dashboard loads once and displays stats without flickering.
The fix also makes all 4 pages using useFetch more performant by eliminating
unnecessary API calls.

---

## How to phrase these in a resume bullet

Use this template:

```
• [Action] using [tech], resulting in [result].
```

Examples:

```
• Designed a layered MERN architecture with service-layer pattern and JWT
  role-based auth, enabling clean feature additions without touching existing code.

• Built 8 reusable React components and a custom useFetch hook with infinite-loop
  prevention, reducing page code to under 100 lines each.

• Automated maintenance history tracking on work order completion via service-layer
  logic, eliminating manual data entry and ensuring 100% accurate records.

• Debugged a critical infinite re-render bug in the data-fetching hook by
  replacing useCallback with useRef, eliminating dashboard flickering.
```
