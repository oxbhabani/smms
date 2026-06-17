# Smart Maintenance Management System (SMMS)

A web app to manage factory machines, maintenance schedules, and work orders.

## Tech Stack

- **Frontend:** React, React Router, Axios, TailwindCSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT, bcryptjs

## Features

- **Authentication** — Register and login. Two roles: Admin and Technician.
- **Machines** — Add, edit, delete, and search machines. Filter by department or status.
- **Maintenance Schedules** — Schedule preventive maintenance for machines.
- **Work Orders** — Create work orders, assign technicians, update status. Completed orders are saved as history automatically.
- **Dashboard** — See counts of machines, work orders, and upcoming maintenance.
- **Activity Logs** — Every important action is logged and viewable.

## Project Structure

```
server/src/          — Backend code
  config/            — Database connection
  controllers/       — Request handlers
  middleware/         — Auth and error handling
  models/            — Mongoose schemas
  routes/            — API routes
  services/          — Business logic
  validators/        — Input validation
  utils/             — Logger utility

client/src/          — Frontend code
  components/        — Reusable UI components
  pages/             — Page components
  layouts/           — Page layouts
  hooks/             — Custom hooks
  context/           — Auth context
  services/          — API client
  routes/            — Route config
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB running locally on port 27017

### Install & Run

```bash
npm run install-all
npm run dev
```

This starts the backend on port 5000 and frontend on port 3000.

### Environment Variables

Edit `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smms
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## API Endpoints

| Prefix | Description |
|--------|-------------|
| `/api/auth` | Register, login, get current user |
| `/api/machines` | CRUD machines |
| `/api/schedules` | CRUD maintenance schedules |
| `/api/work-orders` | CRUD work orders, assign, update status |
| `/api/history` | View completed work orders |
| `/api/logs` | View activity logs |
| `/api/dashboard` | Dashboard statistics |
| `/api/users` | List users |

## Roles

- **Admin** — Full access to everything.
- **Technician** — Can only update work orders assigned to them.
