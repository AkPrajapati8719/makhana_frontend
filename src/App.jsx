import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 🌟 1. Toaster aur toast ko import karein
import { Toaster, toast } from 'react-hot-toast'; 

import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart'; 
import Footer from './components/Footer';
import Login from './pages/Login'; 
import AdminDashboard from './pages/AdminDashboard'; 
import UserProfile from './pages/UserProfile'; 

function App() {
  // 🔍 NAYA: Global Search State
  const [searchQuery, setSearchQuery] = useState('');

  // LocalStorage se cart fetch karna
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cart persistence
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 🌟 SMART CART LOGIC (With Toast) 🌟
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // 🍞 NAYA: Alert ki jagah Premium Toast Notification
    toast.success(`${product.name} added to cart!`, {
      style: {
        border: '1px solid #7b8c5a', // Olive Green Border
        padding: '16px',
        color: '#3e362e', // Text Brown
        backgroundColor: '#fcfaf5', // Cream Background
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#7b8c5a', // Olive Green Tick
        secondary: '#fcfaf5',
      },
    });
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar 
          cartCount={cart.length} 
          user={user} 
          setUser={setUser} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} user={user} searchQuery={searchQuery} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} user={user} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route 
  path="/admin" 
  element={
    user?.role === "ROLE_ADMIN" 
      ? <AdminDashboard user={user} setUser={setUser} />
      : <Login setUser={setUser} />
  } 
/>

<Route 
  path="/profile" 
  element={
    user && user?.role !== "ROLE_ADMIN"
      ? <UserProfile user={user} setUser={setUser} />
      : <Login setUser={setUser} />
  } 
/>

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;