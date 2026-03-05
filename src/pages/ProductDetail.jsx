import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // 🌑 PREMIUM DARK THEME
  const theme = {
    bgPrimary: '#0F172A',
    bgCard: '#111827',
    bgSoft: '#1E293B',
    accent: '#C6A75E',
    success: '#16A34A',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`http://localhost:8082/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error("Error fetching product:", error));
  }, [id]);

  if (!product) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: theme.bgPrimary
    }}>
      <h2 style={{ color: theme.accent, fontWeight: '500' }}>
        Loading premium experience...
      </h2>
    </div>
  );

  return (
    <div style={{
      background: theme.bgPrimary,
      minHeight: '100vh',
      padding: '60px 6vw',
      fontFamily: "'Inter', sans-serif",
      color: theme.textPrimary
    }}>

      {/* BACK BUTTON */}
      <Link to="/"
        style={{
          textDecoration: 'none',
          color: theme.textSecondary,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px',
          transition: '0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.color = theme.accent}
        onMouseOut={e => e.currentTarget.style.color = theme.textSecondary}
      >
        ← Back to Products
      </Link>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '60px',
        background: theme.bgCard,
        padding: '50px',
        borderRadius: '24px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        flexWrap: 'wrap'
      }}>

        {/* IMAGE SECTION */}
        <div style={{
          flex: '1 1 450px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: theme.bgSoft,
          borderRadius: '20px',
          padding: '30px'
        }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              maxHeight: '550px',
              objectFit: 'cover',
              borderRadius: '16px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        {/* DETAILS SECTION */}
        <div style={{
          flex: '1 1 450px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>

          <span style={{
            background: theme.bgSoft,
            color: theme.accent,
            padding: '8px 18px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '1px',
            width: 'max-content',
            marginBottom: '20px'
          }}>
            {product.category}
          </span>

          <h1 style={{
            margin: '0 0 20px 0',
            fontSize: 'clamp(32px, 4vw, 40px)',
            fontWeight: '700'
          }}>
            {product.name}
          </h1>

          <h2 style={{
            margin: '0 0 25px 0',
            fontSize: '34px',
            fontWeight: '600',
            color: theme.accent
          }}>
            ₹{product.price}
          </h2>

          <p style={{
            color: theme.textSecondary,
            fontSize: '16px',
            lineHeight: '1.8',
            marginBottom: '35px',
            paddingBottom: '25px',
            borderBottom: `1px solid ${theme.border}`
          }}>
            {product.description}
          </p>

          {/* NUTRITIONAL SECTION */}
          <div style={{
            background: theme.bgSoft,
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '35px',
            border: `1px solid ${theme.border}`
          }}>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '16px',
              color: theme.accent
            }}>
              Nutritional Benefits
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: theme.textSecondary,
              lineHeight: '1.9',
              fontSize: '14px'
            }}>
              <li><strong>High Protein & Fiber:</strong> Supports digestion & energy.</li>
              <li><strong>Gluten-Free:</strong> Safe for sensitive diets.</li>
              <li><strong>Zero Trans Fat:</strong> Healthy snacking option.</li>
            </ul>
          </div>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={() => addToCart(product)}
            style={{
              background: theme.accent,
              color: '#000',
              border: 'none',
              padding: '18px',
              borderRadius: '40px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '30px',
              transition: '0.3s',
              boxShadow: '0 15px 30px rgba(0,0,0,0.5)'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Add to Cart
          </button>

          {/* TRUST MARKERS */}
          <div style={{
            display: 'flex',
            gap: '25px',
            flexWrap: 'wrap',
            color: theme.textSecondary,
            fontSize: '14px'
          }}>
            <span>🚚 Free Shipping</span>
            <span>🌿 100% Organic</span>
            <span>⭐ Premium Quality</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;