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
        borderRadius: '32px',
        marginBottom: '60px',
        display: 'flex',
        flexWrap: 'wrap-reverse',
        overflow: 'hidden',
        border: `1px solid rgba(255, 255, 255, 0.05)`,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      }}>

        {/* TEXT */}
        <div style={{
          flex: '1 1 45%',
          padding: '60px 5vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          
          {/* New Modern Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '30px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '24px',
            width: 'fit-content'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.accentGold }}></span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#E5F3F9', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Premium D2C Superfood
            </span>
          </div>

          {/* New Bold Heading */}
          <h1 style={{
            fontSize: 'clamp(42px, 5vw, 64px)',
            fontWeight: '900',
            color: theme.textPrimary,
            marginBottom: '20px',
            lineHeight: '1.1'
          }}>
            Snack <br/>
            <span style={{ color: theme.accentGold, dropShadow: '0 0 10px rgba(198, 167, 94, 0.5)' }}>Fearlessly.</span>
          </h1>

          {/* New Subtitle */}
          <p style={{
            fontSize: '18px',
            color: theme.textSecondary,
            marginBottom: '40px',
            maxWidth: '480px',
            lineHeight: '1.7',
            fontWeight: '300'
          }}>
            Experience the ultimate superfood crunch. Elevate your health with our perfectly roasted, organically sourced Fox Nuts. Bold flavors. Zero guilt.
          </p>

          {/* Updated Button matching the theme */}
          <button
            style={{
              padding: '16px 40px',
              background: theme.accentGold,
              color: theme.bgPrimary,
              borderRadius: '30px',
              fontWeight: '800',
              fontSize: '16px',
              cursor: 'pointer',
              transition: '0.3s',
              border: 'none',
              boxShadow: `0 0 20px ${theme.accentGold}40`,
              width: 'fit-content'
            }}
            onMouseOver={e => {
              e.target.style.background = theme.textPrimary;
              e.target.style.boxShadow = `0 0 30px rgba(255,255,255,0.3)`;
            }}
            onMouseOut={e => {
              e.target.style.background = theme.accentGold;
              e.target.style.boxShadow = `0 0 20px ${theme.accentGold}40`;
            }}
            onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop The Drop
          </button>
        </div>

        {/* IMAGE (Replaced Logo with aesthetic glowing image) */}
        <div style={{ 
          flex: '1.2 1 50%', 
          minHeight: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '40px',
          position: 'relative'
        }}>
           {/* Glow Effect behind image */}
           <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background: theme.accentGold,
              filter: 'blur(100px)',
              opacity: '0.2',
              borderRadius: '50%'
           }}></div>

          <img
            src="public/images/Logo (2).png"
            alt="Premium Makhana"
            style={{
              width: '100%',
              maxWidth: '400px',
              aspectRatio: '1/1',
              objectFit: 'cover',
              borderRadius: '50%', /* Makes it a perfect circle */
              border: '4px solid rgba(255, 255, 255, 0.05)',
              position: 'relative',
              zIndex: 2,
              boxShadow: `0 0 40px -10px ${theme.accentGold}60`
            }}
          />
        </div>
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
