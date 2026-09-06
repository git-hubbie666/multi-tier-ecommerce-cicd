# ShopEase — Full-Stack E-Commerce Web Application

A complete e-commerce web application built for a college cloud computing internship
project. It demonstrates a full shopping workflow (browse → search/filter → product
detail → cart → checkout → order) on a React frontend, an Express REST API, and a
MySQL database, structured to be deployable later as a multi-tier AWS application.

---

## 1. Features

**Frontend**
- Responsive homepage with categories and featured products
- Product listing with search and category filtering
- Product detail page with quantity selector and stock awareness
- Persistent shopping cart (add/remove/update quantity, running total)
- Checkout page that creates a real order in the database (no payment gateway —
  checkout is simulated)
- Order confirmation page
- Login / Register UI backed by JWT authentication
- Loading, error, and empty states throughout
- Clean, responsive design (desktop + mobile)

**Backend**
- REST API built with Express
- Products, categories, cart validation, orders, and auth endpoints
- Server-side re-validation of prices and stock at checkout (never trusts client-sent
  prices)
- Transactional order creation: order + order_items + stock decrement happen atomically
- Input validation (`express-validator`), centralized error handling, consistent
  JSON responses and HTTP status codes
- Configurable CORS (so a future CloudFront/S3 frontend domain can be allow-listed)
- All configuration via environment variables — no hardcoded credentials

**Database**
- MySQL schema: `users`, `categories`, `products`, `orders`, `order_items`
- Seed data: 5 categories, 18 products, ready to browse immediately

---

## 2. Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 18, Vite, React Router, CSS   |
| Backend    | Node.js, Express.js                 |
| Database   | MySQL 8                             |
| Auth       | JWT (jsonwebtoken) + bcrypt          |
| Validation | express-validator                   |

No Docker, Kubernetes, Redis, GraphQL, or other extra infrastructure — kept
intentionally simple per project scope.

---

## 3. Folder Structure

```
ecommerce-project/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── api/              # fetch wrapper / API client
│   │   ├── components/       # Navbar, ProductCard, Loading, ErrorMessage
│   │   ├── context/          # CartContext (localStorage-backed cart state)
│   │   ├── pages/            # Home, ProductList, ProductDetail, Cart,
│   │   │                     # Checkout, OrderConfirmation, Login, Register
│   │   ├── styles/           # index.css (design system)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/db.js      # MySQL connection pool
│   │   ├── controllers/      # products, categories, cart, orders, auth
│   │   ├── middleware/       # errorHandler, validate, auth
│   │   ├── routes/           # route definitions per resource
│   │   ├── app.js            # Express app (middleware + routes)
│   │   └── server.js         # entry point
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── schema.sql            # table definitions + relationships
│   └── seed.sql              # sample categories/products
│
├── screenshots/              # (add UI screenshots here for submission)
├── architecture/             # (add architecture diagram here for submission)
├── .github/workflows/        # placeholder for future CI/CD pipelines
├── .gitignore
├── .env.example
└── README.md
```

---

## 4. Local Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+ running locally (or accessible remotely)

### 4.1 Database setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

This creates the `shopease` database with all tables and populates it with sample
categories and products.

### 4.2 Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your local MySQL credentials
npm run dev        # starts on http://localhost:5000 (nodemon)
# or: npm start
```

Health check: `GET http://localhost:5000/api/health`

### 4.3 Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_BASE_URL defaults to http://localhost:5000/api
npm run dev         # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The full shopping flow (browse →
search/filter → product detail → cart → checkout → order confirmation) works
end-to-end against the local API and database.

---

## 5. Environment Variables

**backend/.env**

| Variable        | Description                                      |
|-----------------|---------------------------------------------------|
| `PORT`          | Port the API listens on (default 5000)            |
| `NODE_ENV`      | `development` / `production`                      |
| `CORS_ORIGIN`   | Comma-separated allowed origins for the frontend  |
| `DB_HOST`       | MySQL host (RDS endpoint in production)           |
| `DB_PORT`       | MySQL port (default 3306)                         |
| `DB_USER`       | MySQL username                                    |
| `DB_PASSWORD`   | MySQL password                                    |
| `DB_NAME`       | Database name (`shopease`)                        |
| `JWT_SECRET`    | Secret used to sign auth tokens                   |
| `JWT_EXPIRES_IN`| Token lifetime (e.g. `7d`)                        |

**frontend/.env**

| Variable              | Description                                  |
|------------------------|----------------------------------------------|
| `VITE_API_BASE_URL`    | Base URL of the backend API                  |

None of these files with real values are committed — only `.env.example` templates
are tracked in git (`.gitignore` excludes all `.env` files).

---

## 6. API Overview

Base path: `/api`

| Method | Endpoint                | Description                                  |
|--------|--------------------------|-----------------------------------------------|
| GET    | `/health`                | API health check                              |
| GET    | `/products`              | List products (`?search=&category=&page=&limit=`) |
| GET    | `/products/:id`          | Get a single product                          |
| GET    | `/categories`            | List categories                               |
| GET    | `/categories/:id`        | Get a single category                         |
| POST   | `/cart/validate`         | Re-price/validate a cart against live stock   |
| POST   | `/orders`                | Create an order (validates stock, transactional) |
| GET    | `/orders/:id`            | Get order details + line items                |
| POST   | `/auth/register`         | Register a new user                           |
| POST   | `/auth/login`            | Log in, returns a JWT                         |
| GET    | `/auth/me`               | Get the current user (requires Bearer token)  |

All responses follow the shape `{ success, data | message, ... }` with appropriate
HTTP status codes (200/201 success, 400/401/404/409 client errors, 500 server errors).

---

## 7. Future AWS Deployment Architecture

This project ("Multi-Tier Web Application with CI/CD") is designed to map onto:

```
                     ┌──────────────────┐
   User  ──────────► │  CloudFront (CDN) │
                     └─────────┬────────┘
                               │ static assets
                     ┌─────────▼────────┐
                     │   S3 (frontend    │
                     │   production build)│
                     └───────────────────┘

   Browser (React) ─── HTTPS ──► EC2 (Node/Express API)
                                       │
                                       ▼
                               RDS (MySQL)
```

- **Frontend → S3 + CloudFront**: `npm run build` in `frontend/` produces static
  assets in `frontend/dist/`, uploaded to an S3 bucket and served via CloudFront.
  `VITE_API_BASE_URL` is set at build time to point at the EC2 API's public URL.
- **Backend → EC2**: the `backend/` app runs with `npm start` on an EC2 instance
  (Node.js installed). `PORT` and all DB/JWT config come from environment variables
  set on the instance (or a `.env` file that is never committed).
- **Database → RDS MySQL**: `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` point at the
  RDS endpoint instead of localhost — no code changes required.
- **CORS**: `CORS_ORIGIN` on the backend is set to the CloudFront domain once it
  exists, so the deployed frontend can call the EC2 API.
- **CI/CD → GitHub Actions**: `.github/workflows/` is reserved for two pipelines to
  be added once infrastructure exists — one to build the frontend and sync it to S3
  (invalidating CloudFront), and one to deploy the backend to EC2. These are not yet
  created, per the current project phase.

### Next step for AWS deployment
Provision the AWS infrastructure (S3 bucket + CloudFront distribution, EC2 instance,
RDS MySQL instance, and appropriate IAM/security groups), then add the GitHub Actions
workflows under `.github/workflows/` to automate the build-and-deploy steps described
above.
