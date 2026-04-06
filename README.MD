<h1><img src="./logo.png" alt="FinStack" height="100" style="vertical-align:middle; margin-right:8px;"/> FinStack — Finance Dashboard</h1>

A full-stack finance dashboard system with role-based access control, financial entry management, and summary-level analytics. Built as a backend engineering assignment to demonstrate API design, data modelling, business logic, and access control.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Node.js, Express.js               |
| Database | MongoDB (Mongoose ODM)            |
| Auth     | JWT (JSON Web Tokens) + bcryptjs  |
| Logging  | Winston                           |
| Frontend | HTML, CSS, Vanilla JS, Chart.js   |

---

## Project Structure

```
finstack/
├── client/                     # Frontend (SPA)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── api.js              # All HTTP calls centralised here
│   ├── logo.png                # App logo (also used as favicon)
│   ├── login.html
│   └── index.html              # Dashboard SPA
│
├── server/
│   ├── logs/                   # Winston log output (gitignored)
│   ├── src/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── controllers/     # HTTP layer — thin, no business logic
│   │   │       │   ├── auth.controller.js
│   │   │       │   ├── user.controller.js
│   │   │       │   ├── entry.controller.js
│   │   │       │   └── analytics.controller.js
│   │   │       ├── services/        # Business logic — talks to DB
│   │   │       │   ├── auth.service.js
│   │   │       │   ├── user.service.js
│   │   │       │   ├── entry.service.js
│   │   │       │   └── analytics.service.js
│   │   │       ├── models/          # Mongoose schemas
│   │   │       │   ├── user.model.js
│   │   │       │   └── entry.model.js
│   │   │       ├── middlewares/
│   │   │       │   ├── auth.middleware.js    # JWT verification
│   │   │       │   ├── rbac.middleware.js    # Role-based access control
│   │   │       │   └── error.middleware.js  # Global error handler
│   │   │       ├── routes/
│   │   │       │   ├── auth.routes.js
│   │   │       │   ├── user.routes.js
│   │   │       │   ├── entry.routes.js
│   │   │       │   └── analytics.routes.js
│   │   │       └── validators/
│   │   │           ├── auth.validator.js
│   │   │           └── entry.validator.js
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB connection
│   │   │   └── logger.js        # Winston logger setup
│   │   ├── utils/
│   │   │   ├── ApiError.js      # Custom error class
│   │   │   ├── ApiResponse.js   # Consistent response shape
│   │   │   └── asyncHandler.js  # Eliminates try/catch in controllers
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Entry point
│   ├── .env.example
│   └── package.json
│
├── logo.png
└── README.md
```

---

## Getting Started

### Prerequisites

See `requirements.txt` for system-level dependencies.

### 1. Clone and install

```bash
git clone <your-repo-url>
cd finstack/server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/finstack
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

For MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/finstack?retryWrites=true&w=majority
```

### 3. Run

```bash
npm run dev     # development — nodemon, verbose logs
npm start       # production
```

Server: `http://localhost:8000`  
Dashboard: `http://localhost:8000/login.html`

---

## Roles & Permissions

| Action              | Admin | Manager  | Viewer |
|---------------------|:-----:|:--------:|:------:|
| View entries        | ✓     | ✓        | ✓      |
| Create entries      | ✓     | ✓        | ✗      |
| Update entries      | ✓     | Own only | ✗      |
| Delete entries      | ✓     | ✗        | ✗      |
| View analytics      | ✓     | ✓        | ✗      |
| Manage users        | ✓     | ✗        | ✗      |
| Change user roles   | ✓     | ✗        | ✗      |

---

## API Reference

Base URL: `/api/v1`  
Protected routes require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint         | Access | Description        |
|--------|------------------|--------|--------------------|
| POST   | `/auth/register` | Public | Create account     |
| POST   | `/auth/login`    | Public | Login, returns JWT |

**Register body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "password": "secret123",
  "role": "manager"
}
```

**Login body:**
```json
{
  "email": "jane@company.com",
  "password": "secret123"
}
```

---

### Users

| Method | Endpoint          | Access         | Description      |
|--------|-------------------|----------------|------------------|
| GET    | `/users`          | Admin          | List all users   |
| GET    | `/users/:id`      | Admin, Manager | Get user by ID   |
| PATCH  | `/users/:id/role` | Admin          | Update user role |
| DELETE | `/users/:id`      | Admin          | Deactivate user  |

---

### Financial Entries

| Method | Endpoint        | Access         | Description              |
|--------|-----------------|----------------|--------------------------|
| GET    | `/entries`      | All roles      | List entries (paginated) |
| GET    | `/entries/:id`  | All roles      | Get single entry         |
| POST   | `/entries`      | Admin, Manager | Create entry             |
| PATCH  | `/entries/:id`  | Admin, Manager | Update entry             |
| DELETE | `/entries/:id`  | Admin only     | Soft delete entry        |

**Query parameters for `GET /entries`:**

| Param    | Type   | Example            | Description             |
|----------|--------|--------------------|-------------------------|
| page     | number | `?page=2`          | Page number (default 1) |
| limit    | number | `?limit=20`        | Per page (max 100)      |
| type     | string | `?type=income`     | Filter by type          |
| category | string | `?category=Rent`   | Filter by category      |
| from     | date   | `?from=2026-01-01` | Date range start        |
| to       | date   | `?to=2026-03-31`   | Date range end          |

**Entry body:**
```json
{
  "title": "Office Rent",
  "amount": 50000,
  "type": "expense",
  "category": "Utilities",
  "date": "2026-04-01",
  "note": "Monthly rent Q2"
}
```

---

### Analytics

| Method | Endpoint             | Access         | Description                         |
|--------|----------------------|----------------|-------------------------------------|
| GET    | `/analytics/summary` | Admin, Manager | Totals, monthly trends, by-category |

**Query parameters:**

| Param | Type | Example            | Description       |
|-------|------|--------------------|-------------------|
| from  | date | `?from=2026-01-01` | Filter start date |
| to    | date | `?to=2026-03-31`   | Filter end date   |

**Response shape:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "income": 200000,
      "expense": 85000,
      "net": 115000
    },
    "byCategory": [
      {
        "_id": { "type": "expense", "category": "Utilities" },
        "total": 50000,
        "count": 2
      }
    ],
    "byMonth": [
      {
        "_id": { "year": 2026, "month": 3, "type": "income" },
        "total": 100000
      }
    ]
  }
}
```

---

## Response Format

Every API response follows the same envelope:

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Entries fetched",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Amount must be a positive number"]
}
```

---

## Design Decisions

**Service/controller separation**  
Controllers handle HTTP — parse the request, send the response. Services own business logic and talk to the database. This keeps each layer independently testable and the codebase easy to extend without touching HTTP handling.

**Soft delete on financial entries**  
Financial records should never be hard deleted — they may be needed for audits or reconciliation. A `isDeleted` flag hides records from all queries via a Mongoose pre-find hook, preserving the underlying data permanently.

**MongoDB aggregation for analytics**  
Grouping and summing in the database is significantly more efficient than fetching all records into Node and computing in JS. The analytics endpoint runs three aggregation pipelines in parallel via `Promise.all` — one round trip, no memory overhead regardless of dataset size.

**Single-page frontend**  
The dashboard is a single HTML shell with JS switching visible sections. This avoids re-running auth checks and re-fetching shared user state on every navigation, which would be the case with separate HTML files.

**Consistent error handling**  
A custom `ApiError` class and a single global error handler middleware mean controllers never need their own try/catch or error formatting. All error paths — Mongoose, JWT, validation, business logic — funnel through one place and return a consistent JSON shape.

---

## Environment Variables

| Variable       | Required | Default       | Description                          |
|----------------|----------|---------------|--------------------------------------|
| PORT           | No       | 5000          | Server port                          |
| MONGO_URI      | Yes      | —             | MongoDB connection string            |
| JWT_SECRET     | Yes      | —             | Secret key for signing JWTs          |
| JWT_EXPIRES_IN | No       | 7d            | Token expiry duration                |
| NODE_ENV       | No       | development   | Affects log level and morgan output  |

---
