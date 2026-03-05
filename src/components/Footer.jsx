import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();

  const hiddenPages = ['/admin', '/login', '/checkout'];
  
  if (hiddenPages.includes(location.pathname)) {
    return null;
  }

  // 🌑 DARK LUXURY THEME
  const theme = {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    forestGreen: '#14532D',
    accentGold: '#C6A75E',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155'
  };

  return (
    <footer style={{
      background: theme.bgPrimary,
      color: theme.textPrimary,
      padding: '50px 6vw 25px',
      marginTop: 'auto',
      borderTop: `1px solid ${theme.border}`
    }}>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px',
        paddingBottom: '30px',
        borderBottom: `1px solid ${theme.border}`
      }}>

        {/* BRAND SECTION */}
        <div style={{ flex: '1 1 280px' }}>
          <h2 style={{
            margin: '0 0 12px 0',
            fontSize: '22px',
            fontWeight: '800',
            color: theme.accentGold
          }}>
            Evendri
          </h2>

          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: theme.textSecondary,
            maxWidth: '340px'
          }}>
            Premium roasted makhana crafted with purity, crunch, and elegance.
            A superfood experience designed for modern healthy living.
          </p>

          <div style={{
            display: 'flex',
            gap: '15px',
            marginTop: '20px'
          }}>
            {['Instagram', 'Facebook', 'Twitter'].map((item, i) => (
              <a
                key={i}
                href="#"
                style={{
                  color: theme.textSecondary,
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: '0.3s'
                }}
                onMouseOver={e => e.currentTarget.style.color = theme.accentGold}
                onMouseOut={e => e.currentTarget.style.color = theme.textSecondary}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div style={{ flex: '1 1 160px' }}>
          <h4 style={{
            marginBottom: '15px',
            fontSize: '13px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: theme.textPrimary
          }}>
            Quick Links
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/" style={linkStyle(theme)}>Home</Link>
            <Link to="/cart" style={linkStyle(theme)}>Cart</Link>
            <Link to="/login" style={linkStyle(theme)}>Login / Profile</Link>
          </div>
        </div>

        {/* CONTACT */}
        <div style={{ flex: '1 1 220px' }}>
          <h4 style={{
            marginBottom: '15px',
            fontSize: '13px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Contact
          </h4>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '14px',
            color: theme.textSecondary
          }}>
            <span>Bansal One, Bhopal</span>
            <span>+91 98765 43210</span>
            <span>support@evendri.com</span>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div style={{
        textAlign: 'center',
        marginTop: '25px',
        fontSize: '13px',
        color: theme.textSecondary
      }}>
        © {new Date().getFullYear()} Evendri Makhana. All rights reserved.
      </div>
    </footer>
  );
}

function linkStyle(theme) {
  return {
    color: theme.textSecondary,
    textDecoration: 'none',
    fontSize: '14px',
    transition: '0.3s'
  };
}

export default Footer;