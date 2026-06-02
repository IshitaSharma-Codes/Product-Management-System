# AeroInventory: Enterprise Product Management System

AeroInventory is a complete, production-ready full-stack Product Management System designed with granular Role-Based Access Control (RBAC), secure JWT token rotations, real-time analytics aggregation, and a stunning dark-mode-first Next.js 15 UI.

---

## 🚀 Tech Stack

### Backend
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB & Mongoose
* **Caching**: Redis Cache integration (safe fallback if Redis is offline)
* **API Documentation**: Swagger UI Express
* **Security & Loggers**: Helmet security headers, CORS, Express Validator, Morgan, and Winston Logger
* **Authentication**: JWT Access Token (15m expiry) + Refresh Token (7d rotation)

### Frontend
* **Core**: Next.js 15+ (App Router, JavaScript)
* **Styling**: Tailwind CSS v4.0 (class-based toggles with smooth transition times)
* **State & Forms**: Context API, React Hook Form, Zod validation resolver
* **Toasts & Icons**: React Hot Toast & Lucide React

---

## 📂 Project Architecture

```text
Product-Management-system/
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # DB & Redis connection helpers
│   │   ├── controllers/      # Register, Login, Products CRUD, Analytics
│   │   ├── models/           # User & Product Schema definitions
│   │   ├── middleware/       # Auth validators, RBAC guards, global error handler
│   │   ├── routes/           # Routing structures
│   │   ├── validators/       # Request body sanitizers (express-validator)
│   │   ├── utils/            # Winston logger config
│   │   └── docs/             # Swagger OpenAPI definition
│   ├── server.js             # API entrypoint
│   └── Dockerfile
│
├── frontend/                 # Next.js 15 App Router
│   ├── src/
│   │   ├── app/              # App router layouts and pages
│   │   ├── components/       # Navbars, Sidebars, ThemeToggles
│   │   ├── context/          # Auth Context provider & sessions
│   │   ├── services/         # Axios interceptor configs
│   │   └── hooks/            # Hooks placeholders
│   ├── public/               # Static assets
│   └── Dockerfile
│
├── docker-compose.yml        # Multi-container orchestrator
└── Product-Management-System.postman_collection.json # API Postman collection
```

---

## ⚡ Installation & Getting Started

AeroInventory can be launched either in containerized Docker environments or directly on your local system.

### Option A: Quick Docker Compose Run (Recommended)
This spins up MongoDB, Redis, the Node Backend, and the Next.js Frontend in a unified network.

1. Ensure Docker Desktop is installed and running on your system.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Once completed:
   * **Next.js Frontend**: [http://localhost:3000](http://localhost:3000)
   * **Express Backend**: [http://localhost:5000](http://localhost:5000)
   * **Swagger API Docs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

### Option B: Local Development Run (Manual)

#### 1. Backend Setup
1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Verify your `.env` settings (default configuration connects to a local MongoDB at `mongodb://127.0.0.1:27017/product-management`).
4. Boot the server in development hot-reload mode:
   ```bash
   npm run dev
   ```

#### 2. Frontend Setup
1. Open a separate terminal and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the portal at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Authentication & RBAC

The system enforces two roles:
1. **Admin**: Can create products, read products, edit specs, delete items, upload custom product images, and review dashboard analytics.
2. **User**: Can view the dashboard analytics cards, read products in the inventory catalog, and inspect details. User roles are blocked from performing create, update, delete, or image upload commands.

### Admin Account Seeding (Bootstrap)
* To make testing seamless, the system automatically checks if the database is empty when registering a user.
* **The very first user registered in the system is automatically assigned the `admin` role.**
* Subsequent user registrations default to the `user` role.

---

## 🛠️ API Routes Listing

### Authentication
* `POST /api/v1/auth/register` - Create account (Email uniqueness checked).
* `POST /api/v1/auth/login` - Authenticate credentials, returns access & refresh tokens.
* `POST /api/v1/auth/refresh` - Rotates refresh tokens and issues fresh access tokens.
* `GET /api/v1/auth/profile` - Retrieves user profile (Private: JWT header required).

### Products
* `GET /api/v1/products` - Public catalog search, sorting, filtering, and pagination.
* `GET /api/v1/products/:id` - Fetch item specs (cached in Redis).
* `GET /api/v1/products/dashboard/analytics` - Computes total items, valuations, and category count (Private).
* `POST /api/v1/products` - Register a new product (Admin Only).
* `PUT /api/v1/products/:id` - Modify specs (Admin Only, invalidates caches).
* `DELETE /api/v1/products/:id` - Remove item (Admin Only, invalidates caches).
* `POST /api/v1/products/upload` - Upload image file using Multer (Admin Only).

---

## 🔍 API Testing Guidelines

### Swagger Documentation
Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser. You can click the **Authorize** button, paste your JWT `accessToken` in the format: `Bearer <token>`, and run test queries directly inside the browser.

### Postman Collection
Import `Product-Management-System.postman_collection.json` into Postman.
1. Run **Register User** to set up your account.
2. Run **Login User**. Postman will automatically capture your `accessToken` and `refreshToken` and save them into collection variables.
3. Subsequent requests (like **Create Product (Admin)** or **Get User Profile**) will automatically attach the correct authorization headers.
