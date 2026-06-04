```
███████╗███╗   ███╗██╗██╗  ██╗   ██╗
██╔════╝████╗ ████║██║██║  ╚██╗ ██╔╝
█████╗  ██╔████╔██║██║██║   ╚████╔╝ 
██╔══╝  ██║╚██╔╝██║██║██║    ╚██╔╝  
███████╗██║ ╚═╝ ██║██║███████╗██║   
╚══════╝╚═╝     ╚═╝╚═╝╚══════╝╚═╝   
```

Exploring [Express](https://expressjs.com) by building a dummy REST API with [Bun](https://bun.sh), TypeScript, and MongoDB — with the help of [Claude](https://claude.ai). 🚀

> 💡 Inspired by [Code with Antonio](https://www.youtube.com/watch?v=b8ZUb_Okxro).

## ✅ Prerequisites

- [Bun](https://bun.sh) installed
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account with a cluster and connection string

## 🛠️ Setup

```bash
bun install
cp env.template .env  # then fill in your values
```

## 💻 Development

```bash
bun run dev       # watch mode
bun run start     # production
bun run typecheck # type-check without emitting files
```

## 🌍 Environment Variables

| Variable    | Description                                |
|-------------|--------------------------------------------|
| `PORT`      | Port the server listens on (default: 4000) |
| `MONGO_URL` | MongoDB connection string                  |
| `SECRET`    | Secret used for HMAC password hashing      |

## 📋 TODO

- [ ] Tests
- [ ] Docker / docker-compose setup
- [ ] Input validation (e.g. email format, password strength)
- [ ] Rate limiting
- [ ] Pagination for `GET /users`

## 📡 API

### Health

| Method | Path      | Auth | Description         |
|--------|-----------|------|---------------------|
| GET    | `/health` | —    | Check server status |

### Authentication

| Method | Path             | Auth | Description       |
|--------|------------------|------|-------------------|
| POST   | `/auth/register` | —    | Register new user |
| POST   | `/auth/login`    | —    | Login             |

### Users

| Method | Path          | Auth           | Description        |
|--------|---------------|----------------|--------------------|
| GET    | `/users`      | Required       | List all users     |
| PATCH  | `/users/:id`  | Required+Owner | Update username    |
| DELETE | `/users/:id`  | Required+Owner | Delete user        |
