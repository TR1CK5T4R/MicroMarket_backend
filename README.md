# MicroMarket Backend

> REST API powering the MicroMarket micro-marketplace platform — built with Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB via Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs for password hashing |
| **Image Storage** | Multer (local disk) → Cloudinary CDN |
| **Validation** | express-validator |
| **Security** | Helmet, express-rate-limit, CORS |
| **Logging** | Morgan (dev mode) |
| **Dev tooling** | Nodemon, dotenv |

---

## Project Structure

```
micro-marketplace-backend/
├── server.js                   # Entry point — connects DB, starts HTTP server
├── src/
│   ├── app.js                  # Express app setup (middleware, routes, error handling)
│   ├── config/
│   │   ├── db.js               # Mongoose connection
│   │   └── cloudinary.js       # Cloudinary SDK config + upload/delete helpers
│   ├── controllers/
│   │   ├── auth.controller.js  # Register, login, get profile
│   │   └── product.controller.js # CRUD, favorites
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT protect + authorizeRoles
│   │   ├── upload.middleware.js# Multer disk storage + deleteLocalFile util
│   │   ├── validate.middleware.js # express-validator error formatter
│   │   └── error.middleware.js # Global error handler + 404
│   ├── models/
│   │   ├── user.model.js       # User schema (name, email, password, role, favorites)
│   │   └── product.model.js    # Product schema (title, price, description, image, category…)
│   ├── routes/
│   │   ├── auth.routes.js      # /api/auth/*
│   │   ├── product.routes.js   # /api/products/*
│   │   └── upload.routes.js    # /api/upload
│   ├── scripts/
│   │   └── createAdmin.js      # One-time admin seeder script
│   └── seeds/
│       └── seed.js             # Sample product data seeder
```

---

## Core Logic

### Authentication Flow

```
POST /api/auth/register
  → Validate input
  → Hash password (bcrypt, 10 salt rounds)
  → Save user (role defaults to "user")
  → Return JWT + user object

POST /api/auth/login
  → Find user by email
  → Compare password with bcrypt
  → Return JWT + user object (includes role)

Protected routes
  → Client sends:  Authorization: Bearer <token>
  → protect middleware verifies JWT, attaches req.user
  → authorizeRoles('admin') restricts to admin role only
```

### Image Upload Pipeline

```
Admin picks a file on the frontend
       ↓
POST /api/upload  (multipart/form-data, field: "image")
       ↓
auth middleware  →  authorizeRoles('admin')
       ↓
Multer saves file to  uploads/temp/{timestamp}.ext
       ↓
uploadToCloudinary()  →  folder: micro-marketplace/products
                         quality: auto, max 800×1000px
       ↓
deleteLocalFile()  — local temp copy deleted immediately
  (runs on both success AND error — no orphaned files)
       ↓
Returns { url, publicId }  →  frontend stores URL with product
```

### Product CRUD

All product write operations are admin-only (`protect` + `authorizeRoles('admin')`).

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Paginated list with search |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/favorite` | User | Add to favorites |
| DELETE | `/api/products/:id/favorite` | User | Remove from favorites |

### Role-Based Access Control

```
user.role  ∈  { "user", "admin" }  (enforced by Mongoose enum)

Regular user  → can browse, view, add to favorites
Admin         → all of the above + create/edit/delete products + upload images
```

### Error Handling

All errors flow through the global `errorHandler` middleware in `error.middleware.js`. Controllers never send error responses directly — they call `next(error)`. HTTP status codes are set on `res.status()` before throwing, so the handler picks them up cleanly.

---

## API Routes Summary

```
/api/auth
  POST  /register       Register new user
  POST  /login          Login
  GET   /profile        Get current user (protected)

/api/products
  GET   /               List products (paginated, searchable)
  POST  /               Create product (admin)
  GET   /:id            Get single product
  PUT   /:id            Update product (admin)
  DELETE /:id           Delete product (admin)
  POST  /:id/favorite   Add to favorites (user)
  DELETE /:id/favorite  Remove from favorites (user)

/api/upload
  POST  /               Upload image → Cloudinary (admin)
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
JWT_EXPIRES_IN=30d

# Cloudinary — get from cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Seed sample products (optional)
node seed.js

# Create the first admin account
node src/scripts/createAdmin.js

# Start development server
npm run dev
```

> **Admin credentials (seeder defaults)**
> Email: `admin@micromarket.com` · Password: `Admin@12345`
> Change via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars before running the seeder.

---

## Security Notes

- Passwords are **never** stored in plain text — bcrypt with 10 salt rounds
- JWT tokens are signed with `JWT_SECRET` and expire after `JWT_EXPIRES_IN`
- Role (`admin`/`user`) is **never** accepted from request body — only set server-side
- Rate limiting: 100 requests per IP per 10 minutes
- Helmet sets secure HTTP headers on every response
- Multer rejects non-image MIME types and files > 5 MB before they hit the controller
- Local temp files are always deleted after upload — no lingering files on disk
