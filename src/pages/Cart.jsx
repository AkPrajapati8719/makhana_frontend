import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import PaymentModal from '../components/PaymentModal';

function Cart({ cart, setCart, user, setUser }) {
  const navigate = useNavigate();
  const theme = {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    cardBg: '#111827',
    forestGreen: '#14532D',
    accentGold: '#C6A75E',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    danger: '#EF4444'
  };
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const updateQuantity = (id, amount) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const handleCheckout = () => {
    setPaymentOpen(true);
  };
  const handleCOD = () => {
    if (!user) {
      alert('Please login to place an order!');
      setPaymentOpen(false);
      navigate('/login');
      return;
    }
    setPlacingOrder(true);
    const itemsSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const newOrder = {
      totalAmount: totalAmount,
      orderDetails: itemsSummary,
      user: { id: user.id }
    };
    axios.post('http://localhost:8082/api/orders/create', newOrder)
      .then(res => {
        alert('Order placed successfully! 🎉');
        setCart([]);
        setPaymentOpen(false);
        setPlacingOrder(false);
        navigate('/profile');
      })
      .catch(err => {
        alert('Checkout failed: ' + err.message);
        setPlacingOrder(false);
      });
  };
  const handleOnline = () => {
    alert('Online payment not available. Please use Cash on Delivery.');
  };

  if (cart.length === 0) {
    return (
      <div style={{
        padding: '80px 5vw',
        textAlign: 'center',
        minHeight: '70vh',
        background: theme.bgPrimary,
        color: theme.textPrimary
      }}>
        <h2 style={{ fontSize: '34px', marginBottom: '15px' }}>Your Cart is Empty 🛒</h2>
        <p style={{ color: theme.textSecondary, marginBottom: '30px' }}>
          Looks like you haven't added any premium makhana yet.
        </p>
        <Link to="/">
          <button style={{
            padding: '14px 35px',
            fontSize: '16px',
            background: theme.forestGreen,
            color: '#fff',
            border: `1px solid ${theme.accentGold}`,
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{
        padding: '60px 6vw',
        background: theme.bgPrimary,
        minHeight: '80vh',
        color: theme.textPrimary
      }}>
        <h2 style={{
          marginBottom: '40px',
          fontSize: '28px',
          fontWeight: '700',
          borderBottom: `2px solid ${theme.accentGold}`,
          display: 'inline-block',
          paddingBottom: '10px'
        }}>
          Shopping Cart
        </h2>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* CART ITEMS */}
          <div style={{ flex: '2', minWidth: '350px' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: theme.cardBg,
                padding: '25px',
                borderRadius: '14px',
                marginBottom: '20px',
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }}
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <p style={{ color: theme.accentGold, fontWeight: '600', margin: '5px 0 0 0' }}>
                      ₹{item.price}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '30px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={qtyBtn(theme)}
                    >−</button>
                    <span style={{ padding: '0 20px' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={qtyBtn(theme)}
                    >+</button>
                  </div>
                  <div style={{ fontWeight: '600', width: '90px', textAlign: 'right' }}>
                    ₹{item.price * item.quantity}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.danger,
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* ORDER SUMMARY */}
          <div style={{
            flex: '1',
            minWidth: '320px',
            background: theme.cardBg,
            padding: '35px',
            borderRadius: '14px',
            border: `1px solid ${theme.border}`,
            position: 'sticky',
            top: '120px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '25px' }}>Order Summary</h3>
            <div style={summaryRow(theme)}>
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{totalAmount}</span>
            </div>
            <div style={summaryRow(theme)}>
              <span>Delivery</span>
              <span style={{ color: theme.forestGreen }}>FREE</span>
            </div>
            <hr style={{
              border: 'none',
              borderTop: `1px dashed ${theme.border}`,
              margin: '25px 0'
            }} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '30px'
            }}>
              <span>Total</span>
              <span style={{ color: theme.accentGold }}>₹{totalAmount}</span>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '16px',
                background: theme.forestGreen,
                border: `1px solid ${theme.accentGold}`,
                borderRadius: '10px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              disabled={placingOrder}
            >
              {placingOrder ? 'Placing Order...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        totalAmount={totalAmount}
        onCOD={handleCOD}
        onOnline={handleOnline}
      />
    </>
  );
}

function qtyBtn(theme) {
  return {
    padding: '8px 18px',
    background: theme.bgSecondary,
    border: 'none',
    color: theme.textPrimary,
    cursor: 'pointer'
  };
}

function summaryRow(theme) {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    color: theme.textSecondary
  };
}

export default Cart;