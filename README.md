# 🌿 Evendri Frontend (React + Vite)

Welcome to the frontend of **Evendri**, a premium Direct-to-Consumer (D2C) E-commerce platform for organic Makhana. This repository delivers a modern, high-performance user experience, seamlessly integrated with the backend API.

---

## 📦 Architecture Overview

- **SPA (Single Page Application):** Built with React and Vite for fast development and optimal performance.
- **Component-Based:** Modular structure for maintainability and scalability.
- **Routing:** Client-side navigation using React Router DOM.
- **State Management:** Local state and browser storage for cart and user data.
- **API Integration:** Axios for secure, efficient communication with backend.
- **Theming:** Custom dark luxury theme with Olive Green & Gold accents.

---

## 🛠️ Tech Stack

- **Framework:** React.js (with Vite)
- **Routing:** React Router DOM
- **Notifications:** React Hot Toast
- **API Client:** Axios
- **Styling:** CSS Modules & custom themes

---

## ✨ Features

- **Premium UI/UX:** Organic, luxury theme for a unique shopping experience
- **Smart Shopping Cart:** Add, update, and persist products with real-time totals
- **Toast Notifications:** Modern feedback using `react-hot-toast`
- **Admin Dashboard:** Product management, order tracking, and inventory filters
- **Sticky Forms:** Persistent product add/edit forms for admin
- **Custom Scrollbar:** Elegant, theme-matched scrollbars
- **Responsive Design:** Mobile-first, adaptive layouts

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- npm 9+

### 2. Installation

```bash
git clone <repo-url>
cd makhana-frontend
npm install
```

### 3. Running the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

> **Note:** Ensure the backend server (`http://localhost:8082`) is running for full functionality.

---

## 📁 Folder Structure

```
makhana-frontend/
├── public/
│   └── images/           # Product and UI images
├── src/
│   ├── assets/           # Static assets (CSS, fonts, etc.)
│   ├── components/       # Reusable UI components (Navbar, Footer, PaymentModal)
│   ├── pages/            # Main pages (Home, Cart, Login, AdminDashboard, etc.)
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Entry point
│   └── ...
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔗 API Endpoints (Backend)

| Resource | Endpoint                    | Method | Description                 |
| -------- | --------------------------- | ------ | --------------------------- |
| Product  | `/api/products`             | GET    | List all products           |
| Cart     | `/api/cart/sync/{userId}`   | POST   | Sync cart data              |
| User     | `/api/users/register`       | POST   | Register new user           |
| User     | `/api/users/login`          | POST   | User login                  |
| Order    | `/api/orders/create`        | POST   | Create new order            |
| Payment  | `/api/payment/create-order` | POST   | Initiate payment (Razorpay) |

---

## 🧪 Testing & Debugging

- Use browser dev tools and React DevTools for inspection.
- Test API connectivity with Postman or browser console.
- Sample data is auto-loaded from backend for quick testing.

---

## 📝 Contribution Guidelines

1. Fork the repository and create a feature branch.
2. Follow React and JavaScript best practices.
3. Write clear commit messages and document your code.
4. Submit a pull request with a detailed description.

---

## 📚 References & Documentation

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Axios Docs](https://axios-http.com/)

---

## 💡 Notes

- For production, optimize build and update environment variables as needed.
- Backend API must be running for full feature support.

---

## 📄 License

This project is licensed under the MIT License.
