# API Examples

Sample requests and responses for every endpoint. Examples use `http://localhost:4000` as the base URL.

---

## Health

### GET /health

**curl**
```bash
curl http://localhost:4000/health
```

**httpie**
```bash
http GET http://localhost:4000/health
```

**Response `200`**
```json
{ "status": "ok" }
```

**Response `503`** _(database unavailable)_
```json
{ "status": "error", "message": "Database unavailable" }
```

---

## Authentication

### POST /auth/register

**curl**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "email": "alice@example.com", "password": "s3cr3t"}'
```

**httpie**
```bash
http POST http://localhost:4000/auth/register \
  username=alice email=alice@example.com password=s3cr3t
```

**Response `201`**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "username": "alice",
  "email": "alice@example.com"
}
```

**Response `400`** _(user already exists)_
```json
{ "error": "User already exists" }
```

---

### POST /auth/login

Sets a `SESSION_TOKEN` cookie on success.

**curl**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "alice@example.com", "password": "s3cr3t"}'
```

**httpie**
```bash
http POST http://localhost:4000/auth/login \
  email=alice@example.com password=s3cr3t
```

**Response `200`**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "username": "alice",
  "email": "alice@example.com"
}
```

**Response `401`**
```json
{ "error": "Invalid credentials" }
```

---

## Users

> Authenticated endpoints require the `SESSION_TOKEN` cookie set during login.
> `curl` examples use `-b cookies.txt` (saved by `-c cookies.txt` at login).

### GET /users

**curl**
```bash
curl http://localhost:4000/users \
  -b cookies.txt
```

**httpie**
```bash
http GET http://localhost:4000/users \
  Cookie:"SESSION_TOKEN=<your-session-token>"
```

**Response `200`**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "username": "alice",
    "email": "alice@example.com"
  }
]
```

**Response `403`**
```json
{ "error": "Unauthorized" }
```

---

### PATCH /users/:id

**curl**
```bash
curl -X PATCH http://localhost:4000/users/64f1a2b3c4d5e6f7a8b9c0d1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"username": "alice_updated"}'
```

**httpie**
```bash
http PATCH http://localhost:4000/users/64f1a2b3c4d5e6f7a8b9c0d1 \
  Cookie:"SESSION_TOKEN=<your-session-token>" \
  username=alice_updated
```

**Response `200`**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "username": "alice_updated",
  "email": "alice@example.com"
}
```

**Response `400`**
```json
{ "error": "Username is required" }
```

---

### DELETE /users/:id

**curl**
```bash
curl -X DELETE http://localhost:4000/users/64f1a2b3c4d5e6f7a8b9c0d1 \
  -b cookies.txt
```

**httpie**
```bash
http DELETE http://localhost:4000/users/64f1a2b3c4d5e6f7a8b9c0d1 \
  Cookie:"SESSION_TOKEN=<your-session-token>"
```

**Response `200`**
```json
{ "message": "User 64f1a2b3c4d5e6f7a8b9c0d1 deleted successfully" }
```

**Response `400`** _(malformed id)_
```json
{ "error": "Invalid user id" }
```
