# Micro Marketplace API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

### Headers
Authenticated endpoints require the JWT token in the `Authorization` header:
```http
Authorization: Bearer <your_token_here>
```

### 1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### 2. Login User
**POST** `/auth/login`

**Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### 3. Get User Profile
**GET** `/auth/profile`
**Auth Required**: Yes

**Response (200 OK):**
```json
{
  "id": "60d0fe4f5311236168a109ca",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "favorites": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Wireless Headphones",
      "price": 99.99,
      "image": "..."
    }
  ]
}
```

---

## Products

### 1. Get All Products
**GET** `/products`

**Query Parameters (Optional):**
- `search`: Text search for title/description (e.g., `?search=phone`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 8)

**Response (200 OK):**
```json
{
  "products": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Wireless Headphones",
      "price": 99.99,
      "description": "High quality...",
      "image": "...",
      "category": "Electronics",
      "rating": 4.5,
      "numReviews": 10,
      "countInStock": 5
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalCount": 42
}
```

### 2. Get Single Product
**GET** `/products/:id`

**Response (200 OK):**
```json
{
  "_id": "60d0fe4f5311236168a109cb",
  "title": "Wireless Headphones",
  "price": 99.99,
  "description": "...",
  "createdBy": {
    "_id": "...",
    "name": "Admin User"
  }
}
```

### 3. Create Product
**POST** `/products`
**Auth Required**: Yes

**Body:**
```json
{
  "title": "New Product",
  "price": 29.99,
  "description": "Description here",
  "image": "https://example.com/image.jpg",
  "category": "Electronics",
  "countInStock": 10
}
```

### 4. Update Product
**PUT** `/products/:id`
**Auth Required**: Yes (Must be Creator)

**Body (Fields to update):**
```json
{
  "price": 24.99,
  "countInStock": 8
}
```

### 5. Delete Product
**DELETE** `/products/:id`
**Auth Required**: Yes (Must be Creator)

**Response (200 OK):**
```json
{
  "message": "Product removed"
}
```

---

## Favorites

### 1. Add to Favorites
**POST** `/products/:id/favorite`
**Auth Required**: Yes

**Response (200 OK):**
```json
{
  "message": "Product added to favorites"
}
```

### 2. Remove from Favorites
**DELETE** `/products/:id/favorite`
**Auth Required**: Yes

**Response (200 OK):**
```json
{
  "message": "Product removed from favorites"
}
```

---

## Error Response Format

All errors return a consistent JSON structure:

```json
{
  "success": false,
  "message": "Error description here",
  "stack": "Stack trace (Only in Development mode)"
}
```

**Common Status Codes:**
- `400 Bad Request`: Validation errors or invalid data.
- `401 Unauthorized`: Missing or invalid token.
- `404 Not Found`: Resource not found.
- `500 Server Error`: Internal server error.

---

## Seed Credentials (For Testing)

These users are created when running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| **User 1** | `testuser1@example.com` | `password123` |
| **User 2** | `testuser2@example.com` | `password123` |
