import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function UserProfile({ user, setUser }) {
  const [myOrders, setMyOrders] = useState([]);
  const navigate = useNavigate();

  // 🌑 PREMIUM DARK THEME
  const theme = {
    bgPrimary: '#0F172A',
    bgCard: '#111827',
    bgSoft: '#1E293B',
    accent: '#C6A75E',
    success: '#16A34A',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    danger: '#EF4444'
  };

  useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }

  // Prevent admin from opening user profile
  if (user?.role === "ROLE_ADMIN") {
    navigate('/admin');
    return;
  }

  axios.get('https://makhana-backend.onrender.com/api/orders/all')
  
      .then(res => {
        const userSpecificOrders = res.data.filter(order => order.user?.id === user.id);
        setMyOrders(userSpecificOrders);
      })
      .catch(err => console.error("Orders fetch error:", err));
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully. See you soon!");
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={{
      padding: '60px 6vw',
      background: theme.bgPrimary,
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: theme.textPrimary
    }}>

      {/* HEADER */}
      <h2 style={{
        margin: '0 0 40px 0',
        fontSize: '30px',
        fontWeight: '700'
      }}>
        My Profile
      </h2>

      <div className="profile-responsive-container" style={{
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>

        {/* LEFT PROFILE CARD */}
        <div className="profile-card" style={{
          flex: '1 1 320px',
          minWidth: '220px',
          maxWidth: '370px',
          width: '100%',
          background: theme.bgCard,
          padding: '32px 20px',
          borderRadius: '20px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: theme.bgSoft,
              color: theme.accent,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '34px',
              fontWeight: '700',
              margin: '0 auto 15px auto'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            <h3 style={{ margin: 0 }}>{user.name}</h3>
            <span style={{
              fontSize: '12px',
              color: theme.accent
            }}>
              Premium Member
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            color: theme.textSecondary,
            fontSize: '14px'
          }}>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Phone:</strong> {user.phone || 'Not Provided'}</div>
            <div><strong>Address:</strong> {user.address || 'Not Provided'}</div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: '35px',
              padding: '14px',
              background: 'transparent',
              color: theme.danger,
              border: `1px solid ${theme.danger}`,
              borderRadius: '30px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '0.3s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = theme.danger;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.danger;
            }}
          >
            Logout
          </button>
        </div>

        {/* RIGHT ORDERS SECTION */}
        <div className="orders-card" style={{
          flex: '2 1 400px',
          minWidth: '220px',
          maxWidth: '700px',
          width: '100%',
          background: theme.bgCard,
          padding: '32px 16px',
          borderRadius: '20px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          margin: '0 auto',
          marginTop: '18px',
          boxSizing: 'border-box'
        }}>

          <h3 style={{ marginTop: 0, marginBottom: '30px' }}>
            My Orders ({myOrders.length})
          </h3>

          {myOrders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              color: theme.textSecondary
            }}>
              <p style={{ marginBottom: '20px' }}>
                You haven't placed any orders yet.
              </p>
              <Link to="/">
                <button style={{
                  padding: '12px 28px',
                  background: theme.accent,
                  border: 'none',
                  borderRadius: '30px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div>
              {/* Responsive: Table on desktop, cards on mobile */}
              <div className="order-table-desktop" style={{ display: 'block' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '600px'
                }}>
                  <thead>
                    <tr style={{
                      background: theme.bgSoft,
                      fontSize: '13px',
                      color: theme.textSecondary
                    }}>
                      <th style={{ padding: '15px' }}>Order ID</th>
                      <th style={{ padding: '15px' }}>Items</th>
                      <th style={{ padding: '15px' }}>Date</th>
                      <th style={{ padding: '15px' }}>Total</th>
                      <th style={{ padding: '15px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map(order => (
                      <tr key={order.id} style={{
                        borderBottom: `1px solid ${theme.border}`
                      }}>
                        <td style={{ padding: '18px' }}>#{order.id}</td>
                        <td style={{ padding: '18px', color: theme.textSecondary }}>
                          {order.orderDetails || "Premium Makhana Box"}
                        </td>
                        <td style={{ padding: '18px', color: theme.textSecondary }}>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '18px', color: theme.accent }}>
                          ₹{order.totalAmount}
                        </td>
                        <td style={{ padding: '18px' }}>
                          <span style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            background:
                              order.orderStatus === 'DELIVERED'
                                ? 'rgba(22,163,74,0.15)'
                                : order.orderStatus === 'PENDING'
                                ? 'rgba(245,158,11,0.15)'
                                : theme.bgSoft,
                            color:
                              order.orderStatus === 'DELIVERED'
                                ? theme.success
                                : order.orderStatus === 'PENDING'
                                ? '#F59E0B'
                                : theme.textSecondary
                          }}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="order-table-mobile" style={{ display: 'none' }}>
                {myOrders.map(order => (
                  <div key={order.id} style={{
                    background: theme.bgSoft,
                    borderRadius: '14px',
                    marginBottom: '18px',
                    padding: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: `1px solid ${theme.border}`
                  }}>
                    <div style={{ fontWeight: 'bold', color: theme.accent, marginBottom: 6 }}>Order #{order.id}</div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: 8 }}>{order.orderDetails || "Premium Makhana Box"}</div>
                    <div style={{ fontSize: '13px', marginBottom: 8 }}>Date: {new Date(order.orderDate).toLocaleDateString()}</div>
                    <div style={{ fontSize: '13px', marginBottom: 8 }}>Total: <span style={{ color: theme.accent }}>₹{order.totalAmount}</span></div>
                    <div style={{ fontSize: '13px' }}>
                      Status: <span style={{
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        background:
                          order.orderStatus === 'DELIVERED'
                            ? 'rgba(22,163,74,0.15)'
                            : order.orderStatus === 'PENDING'
                            ? 'rgba(245,158,11,0.15)'
                            : theme.bgSoft,
                        color:
                          order.orderStatus === 'DELIVERED'
                            ? theme.success
                            : order.orderStatus === 'PENDING'
                            ? '#F59E0B'
                            : theme.textSecondary
                      }}>{order.orderStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
              <style>{`
                html, body, #root {
                  width: 100%;
                  min-width: 0;
                  overflow-x: hidden;
                }
                .profile-responsive-container {
                  flex-direction: row;
                  width: 100%;
                  max-width: 1100px;
                  margin: 0 auto;
                }
                .profile-card, .orders-card {
                  margin-bottom: 0;
                  width: 100%;
                  box-sizing: border-box;
                }
                @media (max-width: 1200px) {
                  .profile-responsive-container {
                    max-width: 98vw;
                    gap: 18px;
                  }
                  .profile-card, .orders-card {
                    max-width: 98vw;
                  }
                }
                @media (max-width: 900px) {
                  .order-table-desktop { display: none !important; }
                  .order-table-mobile { display: block !important; }
                  .profile-responsive-container {
                    flex-direction: column;
                    align-items: center;
                    gap: 18px;
                  }
                  .profile-card, .orders-card {
                    max-width: 98vw;
                    width: 100%;
                    margin: 0 auto 18px auto;
                  }
                }
                @media (min-width: 901px) {
                  .order-table-desktop { display: block !important; }
                  .order-table-mobile { display: none !important; }
                }
                @media (max-width: 600px) {
                  .order-table-mobile > div {
                    padding: 10px !important;
                    font-size: 13px !important;
                  }
                  .profile-card, .orders-card {
                    padding: 14px 4vw !important;
                  }
                }
              `}</style>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default UserProfile;
