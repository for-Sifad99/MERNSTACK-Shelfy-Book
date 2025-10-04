# 📚 Shelfy – Backend Server
Welcome to the Shelfy Backend — the server-side of a full-stack Library Management System designed to simplify how books are added, updated, borrowed, and returned. Shelfy delivers seamless library operations and a smooth user experience through RESTful APIs.

---

- **Live Site:** [Live Demo!](https://shelfy-book-server.vercel.app/)

---

## 🚀 Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Firebase for Authentication**
- **dotenv for environment variables**
- **CORS Middleware**
- **ImgBB (image uploads)**
- **TanStack Query (used on client for GET operations)**

---

## ✅ Key Features (Server-Side)

- **User Authentication & Authorization** using JWT and Firebase. 
- **JWT Protected Routes** to secure adding, updating, borrowing, and returning books.  
- **Dynamic Book Filtering** by category, availability, and search query.  
- **Borrow/Return Workflow** – track borrowed books and return dates.  
- **Borrow Restriction** – prevent users from borrowing more than allowed.  
- Quantity Control using **MongoDB $inc** operator for increment/decrement.    
- **Pagination** Support for large book collections. 

---

🔄 API Endpoints Overview
Only highlights — for full API details refer to the codebase

## 🔑 Auth & User APIs

| Method | Endpoint            | Auth              | Role  | Description                |
| ------ | ------------------- | ----------------- | ----- | -------------------------- |
| POST   | /users              | ✅ Firebase Token | Any   | Create/update user profile |
| GET    | /users/:email       | ❌                | Any   | Get user by email          |
| GET    | /all-users          | ✅ Firebase Token | Admin | Get all users              |
| PATCH  | /users/:email       | ✅ Firebase Token | Any   | Update user fields         |
| PATCH  | /users/admin/:email | ✅ Firebase Token | Admin | Make a user admin          |
| POST   | /get-role           | ❌                | Any   | Get role by email          |

---

## 📝 Book APIs

| Method | Endpoint          | Auth              | Role          | Description                                          |
| ------ | ----------------- | ----------------- | ------------- | ---------------------------------------------------- |
| POST   | /books            | ✅ Firebase Token | Any (limited) | Add a new book (private route)                       |
| GET    | /books            | ❌                | Any           | Get all available books (search, filter, pagination) |
| GET    | /books/:id        | ❌                | Any           | Get single book details                              |
| PATCH  | /books/:id        | ✅ Firebase Token | Admin / Owner | Update book info                                     |
| DELETE | /books/:id        | ✅ Firebase Token | Admin         | Delete book                                          |
| POST   | /books/:id/borrow | ✅ Firebase Token | Any           | Borrow a book (decrement quantity)                   |
| POST   | /books/:id/return | ✅ Firebase Token | Any           | Return a book (increment quantity)                   |

---

## 📂 Category APIs

| Method | Endpoint    | Auth              | Role  | Description             |
| ------ | ----------- | ----------------- | ----- | ----------------------- |
| GET    | /categories | ❌                | Any   | Get all book categories |
| POST   | /categories | ✅ Firebase Token | Admin | Add new category        |

---

## ⚙️ Environment Variables

You need to setup `.env`  .env file:

```env
# Server Port
PORT=YOUR_PORT

# Database Credentials
DB_USER=YOUR_DB_USER
DB_PASS=YOUR_DB_PASSWORD

# Firebase Service Key (JSON or base64)
FB_SERVICE_KEY=your_firebase_service_key_here
(Replace your_firebase_service_key_here with your actual base64 Firebase service key)
```

---

## 🛠️ Installation Guide

Follow these steps to set up and run the Shelfy backend server locally:

### 📦 Prerequisites

- Node.js
- MongoDB Atlas account (or local MongoDB setup)
- ImgBB or Cloudinary account (for image uploads)

## 🛠 Installation & Setup

1. Clone the server repo
   - git clone https://github.com/for-Sifad99/Shelfy-server.git

2. Navigate to the project directory
   - cd shelfy-server

3. Install dependencies
   - npm install

4. Start the development server
   - npm run dev

---

## 🔮 Future Updates

This backend is just the beginning.  
In the future, the project will be refactored into a full MVC (Model–View–Controller) pattern with all modules properly structured.  
More secure and fully functional APIs will be added to improve performance, reliability, and scalability.

Stay tuned for upcoming updates!
