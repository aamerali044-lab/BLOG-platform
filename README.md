# The Margin — Blog Platform with Comments (React + Node/Express + MongoDB)

A blogging platform: register/login, write/edit/delete posts, and comment
on any post. This project uses a different stack from your other three —
**Node.js/Express** instead of Flask, and **MongoDB** instead of MySQL.

```
blog-platform/
├── backend/    Express API + JWT auth + Mongoose (MongoDB) models
└── frontend/    React (Vite) UI
```

## 1. Set up a free MongoDB database (Atlas — no local install needed)

Unlike MySQL, you don't need to install MongoDB on your computer. MongoDB
Atlas gives you a free cloud database in a few clicks:

1. Go to mongodb.com/cloud/atlas/register and sign up (free).
2. Create a free "M0" cluster (takes a minute or two to provision).
3. Under **Database Access**, create a database user with a username and
   password (write these down).
4. Under **Network Access**, click "Add IP Address" → "Allow access from
   anywhere" (fine for a student project).
5. Click **Connect** on your cluster → "Drivers" → copy the connection
   string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`
6. You'll paste this into `.env` in the next step, replacing `<username>`
   and `<password>` with what you created, and adding a database name
   (e.g. `/blog_platform`) before the `?`.

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and paste in your MongoDB connection string as `MONGO_URI`,
and set `JWT_SECRET` to any long random string.

```bash
npm run dev
```

The API runs at `http://localhost:5000/api`. No table/schema creation
step is needed — MongoDB creates collections automatically the first
time you save something.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## API reference

| Method | Route                        | Auth | Description                     |
|--------|-------------------------------|------|-----------------------------------|
| POST   | /api/auth/register             | —    | Create account                    |
| POST   | /api/auth/login                | —    | Log in                            |
| GET    | /api/auth/me                   | JWT  | Current user                      |
| GET    | /api/posts                     | —    | List all posts                    |
| GET    | /api/posts/:id                  | —    | Get one post                      |
| POST   | /api/posts                     | JWT  | Create a post                     |
| PUT    | /api/posts/:id                  | JWT* | Update a post (*author only)      |
| DELETE | /api/posts/:id                  | JWT* | Delete a post (*author only)      |
| GET    | /api/posts/:id/comments          | —    | List comments on a post           |
| POST   | /api/posts/:id/comments          | JWT  | Add a comment                     |
| DELETE | /api/comments/:id                | JWT* | Delete a comment (*author only)   |

## What this demonstrates

- A second full-stack combination (Node/Express + MongoDB) alongside your
  Flask/MySQL projects — shows range, not just one framework's syntax
- NoSQL document modeling with Mongoose (vs. relational tables)
- JWT auth with ownership checks (only the author can edit/delete their
  own posts and comments)
- A content platform with nested resources (comments belong to posts)
