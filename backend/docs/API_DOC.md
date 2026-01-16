# CodeClip API Documentation

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
All endpoints (except `/signup` and `/login`) require an authenticated session. Authentication is handled via session cookies.

## Response Format
All responses follow this format:

**Success Response:**
```json
{
  "ok": true,
  "data": [...],
  "error": ""
}
```

**Error Response:**
```json
{
  "ok": false,
  "data": [],
  "error": "error message"
}
```

---

## Endpoints

### Authentication

#### 1. Sign Up
Create a new user account.

**Endpoint:** `POST /signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `400` - Email already exists
- `400` - Missing email or password

---

#### 2. Login
Authenticate user and create a session.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `400` - User does not exist
- `400` - Incorrect password
- `400` - Missing email or password

---

#### 3. Logout
Clear the user session.

**Endpoint:** `GET /logout`

**Response (200):**
```json
{
  "ok": true
}
```

---

#### 4. Get Current User
Retrieve information about the authenticated user.

**Endpoint:** `GET /me`

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `401` - Unauthorized (not authenticated)

---

### Snippets

#### 5. Get All Clips
Retrieve all code snippets for the authenticated user.

**Endpoint:** `GET /get/clips`

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "React Hook Example",
      "language": "JavaScript",
      "source": "https://example.com",
      "text": "const [count, setCount] = useState(0);",
      "created_at": "2024-01-16T10:30:00"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `401` - Unauthorized (not authenticated)

---

#### 6. Query Clips (Semantic Search)
Search for snippets using natural language. Results are ranked by semantic similarity.

**Endpoint:** `POST /clip/query`

**Request Body:**
```json
{
  "query": "react hooks state management"
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "React Hook Example",
      "language": "JavaScript",
      "source": "https://example.com",
      "text": "const [count, setCount] = useState(0);",
      "created_at": "2024-01-16T10:30:00"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `400` - Invalid request body
- `401` - Unauthorized

---

#### 7. Create Snippet
Save a new code snippet.

**Endpoint:** `POST /post/clip`

**Request Body:**
```json
{
  "text": "const [count, setCount] = useState(0);",
  "title": "React Hook Example",
  "language": "JavaScript",
  "source": "https://example.com"
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "React Hook Example",
      "language": "JavaScript",
      "source": "https://example.com",
      "text": "const [count, setCount] = useState(0);",
      "created_at": "2024-01-16T10:30:00"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `400` - Missing required fields (text, title, language, source)
- `400` - Invalid request body
- `401` - Unauthorized

---

#### 8. Get Snippet
Retrieve a specific snippet by ID.

**Endpoint:** `GET /get/clip/<clip_id>`

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "React Hook Example",
      "language": "JavaScript",
      "source": "https://example.com",
      "text": "const [count, setCount] = useState(0);",
      "created_at": "2024-01-16T10:30:00"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `401` - Unauthorized
- `404` - Clip not found

---

#### 9. Update Snippet
Edit an existing code snippet.

**Endpoint:** `POST /clip/edit/<clip_id>`

**Request Body:**
```json
{
  "code": "const [count, setCount] = useState(0);",
  "title": "Updated React Hook Example",
  "language": "JavaScript",
  "source": "https://example.com"
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "Updated React Hook Example",
      "language": "JavaScript",
      "source": "https://example.com",
      "text": "const [count, setCount] = useState(0);",
      "created_at": "2024-01-16T10:30:00",
      "updated_at": "2024-01-16T11:00:00"
    }
  ],
  "error": ""
}
```

**Error Cases:**
- `400` - Missing required fields
- `401` - Unauthorized
- `404` - Clip not found

---

#### 10. Delete Snippet
Remove a code snippet.

**Endpoint:** `DELETE /delete/clip/<clip_id>`

**Response (200):**
```json
{
  "ok": true,
  "data": [],
  "error": ""
}
```

**Error Cases:**
- `401` - Unauthorized
- `404` - Clip not found

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 404 | Not Found |

---

## Notes

- All requests should include `Content-Type: application/json` header
- Session cookies are automatically managed for authentication
- Snippets are stored with semantic embeddings for intelligent search
- Timestamps are in ISO 8601 format
