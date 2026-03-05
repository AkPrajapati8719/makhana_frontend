import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ cartCount, user, searchQuery, setSearchQuery }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    <>
      <style>
        {`
          .my-navbar { 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            padding: 16px 6vw; 
            background: rgba(15,23,42,0.85);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid ${theme.border};
            position: sticky; 
            top: 0; 
            z-index: 100; 
            flex-wrap: wrap; 
          }

          .nav-logo h2 {
            color: ${theme.textPrimary};
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }

          .nav-search {
            flex: 1;
            max-width: 500px;
            margin: 0 2vw;
          }

          .nav-actions {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .mobile-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 2rem;
            color: ${theme.textPrimary};
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .mobile-toggle { display: block; }

            .nav-search,
            .nav-actions {
              display: ${mobileNavOpen ? 'flex' : 'none'};
              flex-direction: column;
              width: 100%;
              margin-top: 15px;
              background: ${theme.bgSecondary};
              padding: 20px;
              border-radius: 12px;
              border: 1px solid ${theme.border};
            }
          }
        `}
      </style>

      <nav className="my-navbar">

        <button
          className="mobile-toggle"
          onClick={() => setMobileNavOpen(v => !v)}
        >
          {mobileNavOpen ? "✕" : "☰"}
        </button>

        {/* LOGO */}
        <div className="nav-logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2>
              <span style={{ color: theme.accentGold }}>E</span>vendri
            </h2>
          </Link>
        </div>

        {/* SEARCH BAR REMOVED */}

        {/* ACTIONS */}
        <div className="nav-actions">

          {user ? (
            <>
              {user.role === 'ROLE_ADMIN' ? (
                <Link
                  to="/admin"
                  style={{
                    color: theme.textPrimary,
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link to="/profile" style={{ color: theme.textPrimary }}>
                  profile 👤
                </Link>
              )}
            </>
          ) : (
            <Link
              to="/login"
              style={{
                color: theme.textPrimary,
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Login
            </Link>
          )}

          {user?.role !== 'ROLE_ADMIN' && (
            <Link to="/cart" style={{ textDecoration: 'none' }}>
              <div style={{
                background: theme.forestGreen,
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '30px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: `1px solid ${theme.accentGold}`,
                transition: '0.3s'
              }}>
                🛒 Cart
                <span style={{
                  background: 'rgba(255,255,255,0.25)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {cartCount}
                </span>
              </div>
            </Link>
          )}

        </div>
      </nav>
    </>
  );
}

export default Navbar;