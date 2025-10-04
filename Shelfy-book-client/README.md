# 📚 ShelfyBook — Library Management System  
ShelfyBook is a full-stack Library Management System designed for schools to manage their book collections. It allows adding, updating, borrowing, and returning books with a smooth, user-friendly interface and secure authentication.

---

- **Live Site:** [Live Demo!](https://shelfybook.netlify.app/)  

---

## 🔥 Features  

✅ Fully responsive across **Mobile, Tablet, and Desktop**  
✅ **Firebase Authentication** (Email/Password + Social Login) with protected routes  
✅ **JWT Token** implementation for private routes  
✅ Add, update, borrow, and return books with **real-time quantity tracking**  
✅ Filter books by category, show available books, and toggle between card/table view  
✅ Prevent duplicate borrowing of the same book until returned  
✅ Secure environment variables for **Firebase** and **MongoDB credentials**  
✅ Smooth animations with **Framer Motion**  
✅ **Dynamic titles** using React Helmet Async  
✅ Eye-pleasing design with proper spacing, color contrast, and alignment  

---

## 🚀 Technologies Used  

- **React**  
- **Firebase Authentication**  
- **JWT Authentication**  
- **React Router**  
- **SweetAlert2 / React Toastify**  
- **Axios (API calls)**  
- **MongoDB + Express (Server)**  
- **Tailwind CSS + DaisyUI**  
- **Framer Motion (Animation)**  
- **React Helmet Async (Dynamic Titles)**  
- **@smastrom/react-rating** (Book Ratings)  

---

## 🗂 Page Structure  
### Public Routes  

- `/` - Home page with banner/slider, book categories & extra sections  
- `/login` - Login page with email/password + social login  
- `/register` - Register page with photoURL, password validations  
- `*` - Custom 404 Not Found page  

### Private Routes  

- `/all-books` - View all books with update button, filter & toggle view  
- `/add-books` - Add new books form (Image, Name, Quantity, Author, Category, Rating, Description)  
- `/borrowed-books` - View books borrowed by logged-in user with return button  
- `/book-details/:id` - View single book details + borrow modal (auto-fill user info)  
- `/update-book/:id` - Update book info (image, title, author, category, rating)  

---

## 🔐 Authentication  

- Firebase Email/Password + Google/GitHub Login  
- Password validation: at least 6 chars, one uppercase, one lowercase  
- JWT token stored in client-side, sent with API requests  
- Private routes remain intact even after reload  

---

## ⚙️ Environment Variables

You need to setup `.env`file:

```env
# 🔹 Firebase Config
VITE_apiKey=YOUR_FIREBASE_API_KEY
VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
VITE_projectId=YOUR_FIREBASE_PROJECT_ID
VITE_storageBucket=YOUR_FIREBASE_STORAGE_BUCKET
VITE_messagingSenderId=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_appId=YOUR_FIREBASE_APP_ID
```

---

## 🛠 Installation & Setup

1. Clone the client repo
   - git clone https://github.com/for-Sifad99/Shelfy-client.git

2. Navigate to the project directory
   - cd shelfy-client

3. Install dependencies
   - npm install

4. Start the development server
   - npm run dev

---

## 💡 Unique Features

1. Borrow limit **(max 3 books per user)** with toast notification
2. Filter to show only available books **(quantity > 0)** 
3. **Toggle view**: Card/Table view of books
4. Context-aware **toast & SweetAlert** for all CRUD actions

---

## 🔮 Future Updates

This project is just the beginning. In the future, many exciting features and improvements will be added to make the platform more powerful, user-friendly, and engaging. Stay tuned for upcoming updates!

---

## 🪶 Notes

You can paste this entire block into your `README.md` file in the client repo. 
