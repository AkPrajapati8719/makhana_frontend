import { useState, useEffect } from 'react';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home({ searchQuery, addToCart, user }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const navigate = useNavigate();

  // 🌑 DARK LUXURY THEME
  const theme = {
    bgPrimary: '#0F172A',
    bgCard: '#1E293B',
    forestGreen: '#14532D',
    accentGold: '#C6A75E',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155'
  };

  useEffect(() => {
    axios.get('https://makhana-backend.onrender.com/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Buy Now
  const handleBuyNow = (product) => {
    setBuyNowProduct(product);
    setPaymentOpen(true);
  };

  // PaymentModal handlers
  const handleCOD = () => {
    if (!user) {
      alert('Please login to place an order!');
      setPaymentOpen(false);
      navigate('/login');
      return;
    }
    const newOrder = {
      totalAmount: buyNowProduct.price,
      orderDetails: `1x ${buyNowProduct.name}`,
      user: { id: user.id }
    };
    // Place order via API
    fetch('https://makhana-backend.onrender.com/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
      .then(res => {
        if (!res.ok) throw new Error('Order failed');
        alert('Order placed successfully!');
        setPaymentOpen(false);
        navigate('/profile');
      })
      .catch(() => alert('Order failed. Please try again.'));
  };
  const handleOnline = () => {
    alert('Online payment not available. Please use Cash on Delivery.');
  };

  return (
    <div style={{
      padding: '40px 6vw',
      background: `radial-gradient(circle at top right, #14532D20, transparent 40%), ${theme.bgPrimary}`,
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* ================= HERO SECTION ================= */}
      <div style={{
        background: theme.bgCard,
        borderRadius: '24px',
        marginBottom: '60px',
        display: 'flex',
        flexWrap: 'wrap-reverse',
        overflow: 'hidden',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
      }}>

        {/* TEXT */}
        <div style={{
          flex: '1 1 45%',
          padding: '60px 5vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: '800',
            color: theme.textPrimary,
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Premium Roasted <span style={{ color: theme.accentGold }}>Makhana</span>
          </h1>

          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            marginBottom: '30px',
            maxWidth: '450px',
            lineHeight: '1.6'
          }}>
            Savor the perfect crunch made with pure ingredients and exceptional quality.
          </p>

          <button
            style={{
              padding: '12px 36px',
              background: theme.forestGreen,
              border: `1px solid ${theme.accentGold}`,
              color: '#fff',
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
            onMouseOver={e => e.target.style.background = theme.accentGold}
            onMouseOut={e => e.target.style.background = theme.forestGreen}
          >
            Shop Now
          </button>
        </div>

        {/* IMAGE */}
        <div style={{ flex: '1.2 1 50%', minHeight: '300px' }}>
          <img
            src="/images/Logo (2).png"
            alt="Makhana"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.9)'
            }}
          />
        </div>
      </div>

      {/* ================= CATEGORY FILTER ================= */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '50px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {['All', 'Flavored', 'Roasted', 'Organic'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '10px 28px',
              borderRadius: '30px',
              border: `1px solid ${theme.border}`,
              background: category === cat ? theme.forestGreen : theme.bgCard,
              color: category === cat ? '#fff' : theme.textSecondary,
              fontWeight: '500',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '35px'
      }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            style={{
              background: theme.bgCard,
              borderRadius: '20px',
              border: `1px solid ${theme.border}`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: '0.3s',
              cursor: 'pointer'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={(e) => {
              if (e.target.tagName !== 'BUTTON')
                navigate(`/product/${product.id}`);
            }}
          >
            <img
               src={product.imageUrl ? product.imageUrl.replace('http://localhost:8082', 'https://makhana-backend.onrender.com') : ''}
               alt={product.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <div style={{
              padding: '25px',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}>
              <h3 style={{
                marginBottom: '10px',
                color: theme.textPrimary,
                fontSize: '18px'
              }}>
                {product.name}
              </h3>
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: theme.accentGold,
                marginBottom: '25px'
              }}>
                ₹{product.price}
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleBuyNow(product);
                }}
                style={{
                  marginBottom: 10,
                  padding: '12px',
                  borderRadius: '30px',
                  background: theme.accentGold,
                  color: '#000',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: 15,
                  transition: '0.3s'
                }}
                onMouseOver={e => {
                  e.target.style.background = theme.forestGreen;
                  e.target.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.target.style.background = theme.accentGold;
                  e.target.style.color = '#000';
                }}
              >
                Buy Now
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (addToCart) addToCart(product);
                }}
                style={{
                  marginTop: 'auto',
                  padding: '12px',
                  borderRadius: '30px',
                  background: 'transparent',
                  border: `1px solid ${theme.forestGreen}`,
                  color: theme.forestGreen,
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseOver={e => {
                  e.target.style.background = theme.forestGreen;
                  e.target.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = theme.forestGreen;
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          color: theme.textSecondary
        }}>
          <h3>No products found for "{searchQuery}"</h3>
        </div>
      )}

    <PaymentModal
      open={paymentOpen}
      onClose={() => setPaymentOpen(false)}
      totalAmount={buyNowProduct?.price || 0}
      onCOD={handleCOD}
      onOnline={handleOnline}
    />
    </div>
  );
}

export default Home;