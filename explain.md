# SMMS - Full Explanation for Interviews

This file explains the entire project from scratch. It's written for someone who knows
basic MERN but wants to understand how a real project is structured and why.

---

## 1. The Big Picture (Mental Model)

Think of a restaurant:

```
 Restaurant                    SMMS
 ──────────                   ──────
 Kitchen     = Backend (server/)     ← cooks food, handles logic
 Waiter      = API (routes)          ← carries requests between frontend-backend
 Menu Card   = Frontend pages        ← what user sees and interacts with
 Customer    = Browser User          ← the person using the app
 Order Slip  = HTTP Request          ← "give me chicken biryani"
 Food Tray   = JSON Response         ← here's your food
```

When you click "Add Machine" on the website, here's what happens:

```
Browser                          Server                      MongoDB
│                                │                           │
│── POST /api/machines ─────────→│                           │
│   { name: "CNC-101", ... }    │                           │
│                                │── validate input ────────→│ (check if data is correct)
│                                │── create in database ────→│
│                                │←──── machine data ───────│
│←── { success: true, data } ───│                           │
│                                │                           │
│ (shows new machine in list)    │                           │
```

---

## 2. Project Structure Explained

```
resume-project/
│
├── server/               ← The backend (Kitchen)
│   └── src/
│       ├── config/       ← DB connection setup (recipes book)
│       ├── models/       ← Data shapes (ingredient list)
│       ├── validators/   ← Input checks (quality control)
│       ├── services/     ← Business logic (the actual cooking)
│       ├── controllers/  ← Request handlers (the waiter taking order)
│       ├── routes/       ← URL mappings (menu with prices)
│       ├── middleware/    ← Interceptors (bouncer at door)
│       └── utils/        ← Helper tools (knife, cutting board)
│
├── client/               ← The frontend (Dining area)
│   └── src/
│       ├── components/   ← Reusable pieces (fork, spoon, plate)
│       ├── pages/        ← Full screens (menu, order page, bill page)
│       ├── layouts/      ← Page frames (table setup)
│       ├── context/      ← Global state (restaurant manager)
│       ├── hooks/        ← Reusable logic (ordering routine)
│       └── services/     ← API caller (the phone to call kitchen)
│
└── package.json          ← What ingredients (packages) we need
```

**Key Rule:** Data flows one way. Request goes in through routes → controller → service →
model → database. Response comes back the same path in reverse.

---

## 3. Backend Flow (Request → Response)

When a request arrives, it travels through layers. Each layer has ONE job.

```
                        REQUEST
                           │
                           ▼
                    ┌──────────────┐
                    │   ROUTES     │  ← Which URL? Which method?
                    │  /api/auth   │     "Oh, this is a login request"
                    │  POST        │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ MIDDLEWARE   │  ← Any gate checks?
                    │ authMiddleware│     "Is there a JWT token?"
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ CONTROLLER   │  ← Parse the request
                    │ login()      │     "Get email + password from body"
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  VALIDATOR   │  ← Is data correct?
                    │ authValidator│     "Email format ok? Password not empty?"
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   SERVICE    │  ← Business logic lives here
                    │ authService  │     "Find user in DB. Compare password.
                    │  .login()    │      Generate JWT. Return user + token."
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    MODEL     │  ← Talk to database
                    │  User.find() │     "SELECT * FROM users WHERE email=?"
                    └──────┬───────┘
                           │
                           ▼
                        MONGODB
```

**Why separate layers?** So you can change one without breaking others.
- Want to switch from MongoDB to PostgreSQL? Only change the MODEL layer.
- Want to add logging? Only change the SERVICE layer.
- Want to change response format? Only change the CONTROLLER layer.

### Example Walkthrough: Register a User

**Route** (`routes/authRoutes.js`):
```
POST /api/auth/register  →  authController.register
```

**Controller** (`controllers/authController.js`):
```js
// Gets the request. Calls the right service. Sends the response.
register = async (req, res) => {
  const { errors } = authValidator.validateRegister(req.body);   // check input
  if (errors.length > 0) return res.status(400).json(...fail...); // bad input
  
  const user = await authService.register(req.body);              // do the work
  res.json({ success: true, data: user });                        // send response
}
```

**Validator** (`validators/authValidator.js`):
```js
validateRegister = ({ name, email, password, role }) => {
  const errors = [];
  if (!email || !email.includes('@')) errors.push({ field: 'email', message: 'Invalid email' });
  if (!password || password.length < 6) errors.push({ field: 'password', message: 'Too short' });
  // ... more checks
  return { errors };  // ← always return { errors: [...] }
}
```

**Service** (`services/authService.js`):
```js
register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });   // check duplicate
  if (existingUser) throw new Error('Email already in use');
  
  const passwordHash = await bcrypt.hash(password, 10); // hash password
  const user = await User.create({ name, email, passwordHash, role }); // save
  const token = jwt.sign({ id: user._id }, SECRET);     // create JWT
  
  return { user, token };  // ← send back to controller
}
```

**Model** (`models/User.js`):
```js
const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  passwordHash:{ type: String, required: true },
  role:        { type: String, enum: ['Admin', 'Technician'], default: 'Technician' }
}, { timestamps: true });  // ← auto adds createdAt, updatedAt
```

---

## 4. Frontend Flow (Page → API → Render)

```
Page loads (e.g. MachineListPage)
         │
         ▼
  ┌──────────────┐
  │   useFetch   │  ← Custom hook. Calls API. Manages loading state.
  │  (hook)      │     loading=true → show spinner
  │              │     data arrives → loading=false → show data
  │              │     error → show error message
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  services/   │  ← Axios instance with auth token attached
  │   api.js     │     Automatically adds Bearer token from localStorage
  │              │     Automatically redirects to /login on 401
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Express API │  ← Backend (the flow from section 3)
  │  (server)    │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  A response  │  ← { success: true, data: [...] }
  └──────┬───────┘
         │
         ▼
  Page re-renders with data
  (React updates the DOM)
```

### How Data Flows in the Frontend

```
                    ┌─────────────┐
                    │  AuthContext │  ← Stores logged-in user. Available everywhere.
                    │  (user)      │     Login, logout, check role.
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌──────────┐     ┌──────────────┐    ┌──────────────┐
  │ Sidebar  │     │ MachineList  │    │ WorkOrder    │
  │ (shows   │     │ Page         │    │ Detail Page  │
  │  user    │     │              │    │              │
  │  name)   │     │ useFetch()   │    │ useAuth()    │
  └──────────┘     │ getMachines()│    │ (check role) │
                   └──────────────┘    └──────────────┘
```

### The Context API Pattern (What and Why)

AuthContext is like a "global variable" that doesn't need prop drilling.

**Without Context (painful):**
```
App → MainLayout → Sidebar (needs user.name)
  ↓
  DashboardPage (needs user.role)
    ↓
    SomeChild (needs user._id)
```

You'd have to pass `user` through every level. With Context:

```
AuthProvider wraps EVERYTHING
  │
  ├── Sidebar         → useAuth().user.name   ← direct access
  ├── DashboardPage   → useAuth().user.role   ← direct access
  └── AnyComponent    → useAuth().logout()    ← direct access
```

### Why useFetch Exists

Every page follows the same pattern:

```js
// Without useFetch (repetitive):
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  setLoading(true);
  api.get('/machines')
    .then(res => setData(res.data.data))
    .catch(...)
    .finally(() => setLoading(false));
}, []);

// With useFetch (clean):
const { data, loading } = useFetch(() => getMachines());
```

The hook handles loading, error, and data fetching so every page doesn't
rewrite the same boilerplate.

---

## 5. Authentication Flow (The Most Important Part)

### Registration

```
Frontend                    Backend
│                           │
│  RegisterPage             │
│  user fills form          │
│  name, email, password    │
│       │                   │
│       ▼                   │
│  AuthContext.register()   │
│       │                   │
│       ▼                   │
│  api.post('/auth/register')─────→│  authController.register()
│                                  │       │
│                                  │       ▼
│                                  │  authValidator.validateRegister()
│                                  │       │
│                                  │       ▼
│                                  │  authService.register()
│                                  │       │
│                                  │       ├── User.findOne({ email })  ← duplicate check
│                                  │       ├── bcrypt.hash(password)    ← hash it
│                                  │       ├── User.create(...)         ← save to DB
│                                  │       └── jwt.sign(...)            ← create token
│                                  │       │
│                                  │←──────┘ returns { user, token }
│                                  │
│←─── { success: true, data } ────│
│       │                         │
│       ▼                         │
│  Save token to localStorage     │
│  Set user in AuthContext        │
│  Navigate to /dashboard         │
```

### Login (same flow, but simpler)

```
Frontend                    Backend
│                           │
│  LoginPage                │
│  email + password         │
│       │                   │
│       ▼                   │
│  authService.login()      │
│       │                   │
│       ▼                   │
│  POST /auth/login ───────→│  User.findOne({ email })   ← find user
│                           │  bcrypt.compare(password)   ← check password
│                           │  jwt.sign(...)              ← create token
│                           │←──── { user, token }
│       │                   │
│       ▼                   │
│  localStorage.setItem     │
│  ('token', token)         │
│  setUser(user)            │
│  navigate('/dashboard')   │
```

### How JWT Works

```
JWT = JSON Web Token = A digitally signed ID card

 ┌──────────────────────────────────────────────────┐
 │  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9           │
 │  .eyJpZCI6IjY0N2YiLCJpYXQiOjE3MDAwMDAwMDAs     │
 │  .sFlKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   │
 └──────────────────────────────────────────────────┘
  └───── header ────┘└───── payload ────┘└─── signature ───┘

  header:   "I'm a JWT"
  payload:  { id: "user123", iat: 1700000000 }  ← user ID + issued at
  signature: prevents tampering (signed with JWT_SECRET)
```

**The key insight:** Server does NOT store sessions. The token IS the proof.
When user sends token, server decodes it, reads `id`, and knows who they are.
This is called "stateless authentication."

```
Token in localStorage:
┌───────────────────────┐
│ localStorage {        │
│   "token": "eyJ..."   │
│ }                     │
└───────────────────────┘
         │
         ▼  Every API request
Axios interceptor adds header:
Authorization: Bearer eyJ...
         │
         ▼
Server verifies signature with JWT_SECRET
If valid → req.user = { id, name, email, role }
If invalid → 401 Unauthorized
```

### Why bcrypt?

NEVER store plain text passwords.

```
User enters: "mypassword123"

bcrypt.hash("mypassword123", 10)
         │
         ▼
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
         │
         ▼
Stored in DB (even if DB is hacked, password is safe)

When user logs in:
bcrypt.compare("mypassword123", "$2a$10$...") → true  (correct)
bcrypt.compare("wrongpassword", "$2a$10$...") → false (wrong)
```

---

## 6. Folder Organization Pattern (Feature-Based)

Group files by what they do, not by their type.

### BAD (type-based):
```
server/
  controllers/
    authController.js
    machineController.js
    userController.js
  models/
    User.js
    Machine.js
  routes/
    authRoutes.js
    machineRoutes.js
```
This is fine for small projects. But when you have 50 features,
you are scrolling through 5 folders with 50 files each.

### GOOD (what we did):
```
server/src/
  controllers/     ← 7 files (one per feature)
  models/          ← 6 files
  routes/          ← 8 files
  services/        ← 7 files
  validators/      ← 4 files
```
Still grouped by layer but small enough to manage. This is feature-based
organization: each feature (auth, machines, workOrders, etc.) has its
own files in each layer.

### For VERY large projects (future reference):
```
features/
  auth/
    authController.js
    authService.js
    authValidator.js
    authRoutes.js
    authModel.js
  machines/
    machineController.js
    machineService.js
    ...
```
Everything for "auth" is in one folder. Everything for "machines" in another.
This scales better for teams where one team owns "auth" and another owns "machines."

---

## 7. Key Interview Questions & Answers

### Q: Why did you choose MongoDB over SQL?

"I chose MongoDB because the data in this app is document-shaped. A work order
has a machine, an assigned technician, and a creator. With MongoDB, I can
store all that in one document and use `populate()` to join them when needed.
With SQL, I'd need 4 separate tables with joins. MongoDB also makes it easier
to add new fields later without running migrations."

### Q: How does authentication work in your app?

"We use JWT-based authentication. When a user registers or logs in, the server
creates a signed token containing the user's ID. The frontend stores this token
in localStorage and sends it with every request via an Axios interceptor. The
server has middleware that verifies the token and attaches the user to the
request object. This is stateless - no sessions, no database lookups for auth."

### Q: How do you handle authorization (Admin vs Technician)?

"We have two middleware functions: `authMiddleware` checks if the user is logged
in, and `adminMiddleware` checks if their role is 'Admin'. For routes like
creating machines, we use both. For updating work orders, a technician can only
update if they're the assigned person - this check happens in the service layer."

### Q: Why do you have a service layer between controllers and models?

"To keep controllers thin. A controller's job is just to parse the request and
send the response. All business logic - like checking if a machine has active
work orders before deleting it, or creating a history entry when a work order
is completed - goes in the service layer. This makes the code testable and
easy to change."

### Q: How did you handle the relationship between work orders and history?

"Whenever a work order's status is changed to 'Completed', the service
automatically creates a History document with the machine, technician, and
completion date. This means the history is always accurate - it's driven by
the actual work order status change, not by someone manually entering it."

### Q: What's the most important thing you learned building this?

"Structure matters more than code. Having a consistent pattern where every
feature follows the same route → controller → service → model flow makes
the project predictable. When I open a file, I know exactly where to find
things. This matters a lot when you're working in a team."

---

## 8. Diagrams for Key Features

### Machine CRUD

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Machine  │    │   Add    │    │   Edit   │    │  Delete  │
│ List     │───→│ Machine  │───→│ Machine  │───→│ Confirm  │
│ Page     │    │  Page    │    │  Page    │    │ Dialog   │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │  GET          │  POST         │  PUT          │  DELETE
     │  /api/        │  /api/        │  /api/        │  /api/
     │  machines     │  machines     │  machines/:id │  machines/:id
     ▼               ▼               ▼               ▼
     ┌─────────────────────────────────────────────────────┐
     │                   Express Server                    │
     │  Route → Controller → Service → Model → MongoDB    │
     └─────────────────────────────────────────────────────┘
```

### Work Order Lifecycle

```
Created by Admin
      │
      ▼
   Open ───────────────────┐
      │                    │
      ▼                    │
In Progress                │  (Admin can cancel)
      │                    │
      ├── Completed ───────┤
      │         │          │
      │         ▼          │
      │    Auto-creates    │
      │    History entry   │
      │                    │
      └── Cancelled  ←────┘
```

### Dashboard Data Flow

```
DashboardPage loads
         │
         ▼
useFetch(() => getDashboardStats())
         │
         ▼
GET /api/dashboard
         │
         ▼
dashboardService.getStats()
         │
         ├── Machine.countDocuments({ status: 'Running' })
         ├── Machine.countDocuments({ status: 'Maintenance' })
         ├── Machine.countDocuments({ status: 'Breakdown' })
         ├── WorkOrder.countDocuments({ status: 'Open' })
         ├── WorkOrder.countDocuments({ status: 'Completed' })
         └── Schedule.countDocuments({ nextMaintenanceDate: { $gte: new Date() } })
         │
         ▼
Returns: { totalMachines, underMaintenance, breakdown, openWorkOrders, ... }
         │
         ▼
7 StatCard components display the numbers
```

---

## 9. The Concept of "Middleware" Explained

Middleware = a function that runs BEFORE your route handler.

```
Request arrives
      │
      ▼
  ┌─────────────────────────────────────────┐
  │ cors()        ← Allows other domains    │
  │ express.json()← Parses JSON body        │
  │ authMiddleware← Verifies JWT token      │
  │ adminMiddleware← Checks Admin role      │
  └─────────────────────────────────────────┘
      │
      ▼
  Route Handler runs (controller)
      │
      ▼
  Response sent back
```

Think of it like airport security:

```
1. Check-in counter (cors) - "Is this flight allowed?"
2. Security check (express.json) - "Let me see what's in your bag"
3. Passport control (authMiddleware) - "Show me your ID"
4. VIP lounge (adminMiddleware) - "Only VIP members past this point"
5. Boarding (controller) - "Welcome aboard"
```

---

## 10. Common Mistakes & How We Avoided Them

| Mistake | How We Fixed It |
|---------|----------------|
| Putting logic in controllers | Service layer handles all business logic |
| Plain text passwords | bcrypt.hash() before storing |
| No input validation | Validators check every field before processing |
| Error leaks stack traces | try/catch with consistent { success, message } format |
| Data fetch loops | useRef in useFetch to prevent re-fetch on re-render |
| Nested response access | Standardized { success, data } response format |
| Hardcoded values | Environment variables (.env file) |

---

## 11. Quick Mental Model

When building any MERN feature, ask yourself:

```
ROUTES:      What URL and method?          POST /api/machines
CONTROLLER:  What do I need from request?  req.body, req.params, req.user
VALIDATOR:   Is the input valid?           Required fields, correct format
SERVICE:     What should happen?           Create in DB, log activity, return data
MODEL:       What fields to save?          machineId, name, department, status
```

Frontend equivalent:

```
PAGE:        What screen is this?             MachineListPage
HOOK/SERVICE: What data do I need?            useFetch(getMachines)
COMPONENT:   How to display it?               DataTable with columns
CONTEXT:     What's shared?                   AuthContext (current user)
```

---

## 12. File-by-File Map (Cheat Sheet for Interview)

```
Backend Files                      Purpose
────────────────────────────────────────────────────────────────
server.js                          Starts the server, connects DB
app.js                             Sets up Express, mounts routes
config/db.js                       MongoDB connection string
models/User.js                     User schema (name, email, role, passwordHash)
models/Machine.js                  Machine schema (machineId, name, status...)
models/Schedule.js                 Schedule schema (machine, frequency, dates...)
models/WorkOrder.js                Work order schema (title, machine, status...)
models/History.js                  History schema (machine, technician, workOrder...)
models/ActivityLog.js              Log schema (user, action, timestamp)
middleware/authMiddleware.js       JWT verification, Admin check
middleware/errorMiddleware.js      Global error handler
validators/authValidator.js        Register/login input validation
validators/machineValidator.js     Machine create/update validation
validators/scheduleValidator.js    Schedule create/update validation
validators/workOrderValidator.js   Work order create validation
services/authService.js            Register, login, getMe with JWT
services/machineService.js         Machine CRUD + activity logging
services/scheduleService.js        Schedule CRUD
services/workOrderService.js       Work order CRUD + assign + auto history
services/historyService.js         Read-only history access
services/logService.js             Read-only log access
services/dashboardService.js       Aggregated dashboard stats
controllers/authController.js      Thin wrapper calling authService
controllers/machineController.js   Thin wrapper calling machineService
controllers/scheduleController.js  etc.
controllers/workOrderController.js
controllers/historyController.js
controllers/logController.js
controllers/dashboardController.js
controllers/userController.js
routes/authRoutes.js               POST /register, POST /login, GET /me
routes/machineRoutes.js            CRUD /machines
routes/scheduleRoutes.js           CRUD /schedules
routes/workOrderRoutes.js          CRUD + assign + status /work-orders
routes/historyRoutes.js            GET /history
routes/logRoutes.js                GET /logs
routes/dashboardRoutes.js          GET /dashboard
routes/userRoutes.js               GET /users
utils/logger.js                    Writes to ActivityLog collection

Frontend Files                     Purpose
────────────────────────────────────────────────────────────────
main.jsx                           Entry point, renders App
App.jsx                            Just renders AppRoutes
index.css                          Tailwind directives + custom utility classes
routes/AppRoutes.jsx               All routes with Protected/Public guards
context/AuthContext.jsx            Global auth state (user, login, logout, register)
services/api.js                    Axios instance + all API functions
hooks/useFetch.js                  Generic data fetching hook
layouts/AuthLayout.jsx             Centered card layout for login/register
layouts/MainLayout.jsx             Sidebar + navbar + content area
components/LoadingSpinner.jsx      Animated spinner
components/EmptyState.jsx          "No data found" message
components/StatusBadge.jsx         Color-coded status/priority badges
components/ConfirmDialog.jsx       Modal for delete confirmation
components/DataTable.jsx           Reusable table with columns
components/SearchBar.jsx           Search input with icon
components/FilterDropdown.jsx      Select dropdown for filters
components/StatCard.jsx            Dashboard stat card
pages/LoginPage.jsx                Login form
pages/RegisterPage.jsx             Registration form
pages/DashboardPage.jsx            Stats cards grid
pages/MachineListPage.jsx          Machine table with search/filter/delete
pages/AddMachinePage.jsx           Create machine form
pages/EditMachinePage.jsx          Edit machine form (pre-filled)
pages/ScheduleListPage.jsx         Schedule table with inline add/edit
pages/WorkOrderListPage.jsx        Work order table with filters
pages/CreateWorkOrderPage.jsx      Create work order form
pages/WorkOrderDetailPage.jsx      Detail view with assign + status update
pages/HistoryPage.jsx              History table (read-only)
pages/LogsPage.jsx                 Activity log table (read-only)
```

---

## Final Tip for Interview

When they ask "Tell me about a project you built," use this structure:

1. **What it does:** "A maintenance management system for factories. Tracks
   machines, schedules maintenance, manages work orders."

2. **Tech stack:** "MERN stack with JWT auth. JavaScript throughout."

3. **Architecture:** "Feature-based organization. Service layer separates
   business logic from controllers. Consistent response format."

4. **Your contribution:** "I designed the entire architecture, set up the
   authentication flow, implemented all CRUD operations, and built the
   auto-history feature that logs completed work orders."

5. **Challenge:** "The flickering issue caused by an infinite re-fetch loop
   in the useFetch hook. Fixed it by using a ref to stabilize the function
   reference."

6. **Result:** "A clean, deployable app that follows production patterns."
