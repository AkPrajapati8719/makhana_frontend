import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 

function AdminDashboard({ user, setUser }) {

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null); 
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', imageUrl: '', category: ''
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // 🌑 PREMIUM DARK THEME
  const theme = {
    bgPrimary: '#0F172A',
    bgCard: '#111827',
    bgSoft: '#1E293B',
    accent: '#C6A75E',
    success: '#16A34A',
    danger: '#EF4444',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155'
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = () => {
    axios.get('https://makhana-backend.onrender.com/api/orders/all')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Orders fetch error:", err));
  };

  const fetchProducts = () => {
    axios.get('https://makhana-backend.onrender.com/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Products fetch error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (typeof setUser === 'function') setUser(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios.put(`https://makhana-backend.onrender.com/api/orders/update-status/${orderId}?status=${newStatus}`)
      .then(res => {
        toast.success(`Order #${orderId} status updated to ${newStatus}!`); 
        fetchOrders(); 
      })
      .catch(err => toast.error("Error updating status: " + err.message));
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description || '',
      imageUrl: product.imageUrl,
      category: product.category || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProduct({ name: '', price: '', description: '', imageUrl: '', category: '' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const res = await axios.post('https://makhana-backend.onrender.com/api/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewProduct({ ...newProduct, imageUrl: res.data.imageUrl });
      toast.success("Image uploaded successfully!"); 
    } catch (err) {
      toast.error("Image upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`https://makhana-backend.onrender.com/api/products/update/${editingId}`, newProduct)
        .then(res => {
          toast.success("Product Successfully Updated!"); 
          fetchProducts();
          handleCancelEdit();
        })
        .catch(err => toast.error("Error updating product: " + err.message));
    } else {
      axios.post('https://makhana-backend.onrender.com/api/products/add', newProduct)
        .then(res => {
          toast.success("Product Successfully Added!"); 
          fetchProducts();
          handleCancelEdit(); 
        })
        .catch(err => toast.error("Error adding product: " + err.message));
    }
  };

  const handleDeleteProduct = (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`https://makhana-backend.onrender.com/api/products/delete/${id}`)
        .then(res => { 
          toast.success("Product Deleted!"); 
          fetchProducts(); 
        })
        .catch(err => toast.error("Error deleting product."));
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.orderStatus === 'PENDING').length;

  const inputStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    border: `1px solid ${theme.border}`,
    fontSize: '14px',
    outline: 'none',
    color: theme.textPrimary,
    backgroundColor: theme.bgSoft
  };

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{
      padding: '50px 6vw',
      background: theme.bgPrimary,
      minHeight: '100vh',
      color: theme.textPrimary,
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Control Center</h2>
          <p style={{ color: theme.textSecondary }}>Premium Store Management Panel</p>
        </div>

        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 22px',
            background: 'transparent',
            color: theme.danger,
            border: `1px solid ${theme.danger}`,
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        <button onClick={() => setActiveTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            color: activeTab === 'orders' ? theme.accent : theme.textSecondary,
            borderBottom: activeTab === 'orders' ? `2px solid ${theme.accent}` : 'none',
            paddingBottom: '6px'
          }}>
          Order Management
        </button>

        <button onClick={() => setActiveTab('products')}
          style={{
            background: 'none',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            color: activeTab === 'products' ? theme.accent : theme.textSecondary,
            borderBottom: activeTab === 'products' ? `2px solid ${theme.accent}` : 'none',
            paddingBottom: '6px'
          }}>
          Manage Products
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <StatCard title="Total Orders" value={orders.length} theme={theme}/>
            <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} theme={theme}/>
            <StatCard title="Pending Orders" value={pendingOrders} theme={theme}/>
          </div>
          <div className="admin-orders-table-desktop" style={{
            background: theme.bgCard,
            padding: '30px',
            borderRadius: '16px',
            border: `1px solid ${theme.border}`,
            width: '100%',
            overflowX: 'auto',
            boxSizing: 'border-box',
            margin: '0 auto',
            maxWidth: '1100px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead style={{ color: theme.textSecondary }}>
                <tr>
                  <th style={{ padding: '12px' }}>Order ID</th>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderTop: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '12px' }}>#{order.id}</td>
                    <td style={{ padding: '12px' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', color: theme.accent }}>₹{order.totalAmount}</td>
                    <td style={{ padding: '12px' }}>
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          background: theme.bgSoft,
                          color: theme.textPrimary,
                          border: `1px solid ${theme.border}`,
                          padding: '6px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-orders-table-mobile" style={{ display: 'none', width: '100%', maxWidth: '98vw', margin: '0 auto', boxSizing: 'border-box' }}>
            {orders.map(order => (
              <div key={order.id} style={{
                background: theme.bgSoft,
                borderRadius: '14px',
                marginBottom: '18px',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `1px solid ${theme.border}`,
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ fontWeight: 'bold', color: theme.accent, marginBottom: 6 }}>Order #{order.id}</div>
                <div style={{ fontSize: '13px', marginBottom: 8 }}>Date: {new Date(order.orderDate).toLocaleDateString()}</div>
                <div style={{ fontSize: '13px', marginBottom: 8 }}>Amount: <span style={{ color: theme.accent }}>₹{order.totalAmount}</span></div>
                <div style={{ fontSize: '13px' }}>
                  Status: <select 
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      background: theme.bgSoft,
                      color: theme.textPrimary,
                      border: `1px solid ${theme.border}`,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      marginLeft: 6
                    }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 900px) {
              .admin-orders-table-desktop { display: none !important; }
              .admin-orders-table-mobile { display: block !important; }
            }
            @media (min-width: 901px) {
              .admin-orders-table-desktop { display: block !important; }
              .admin-orders-table-mobile { display: none !important; }
            }
            @media (max-width: 600px) {
              .admin-orders-table-mobile > div {
                padding: 10px !important;
                font-size: 13px !important;
              }
            }
          `}</style>
        </div>
      )}

     {/*  PRODUCTS TAB  */}
{activeTab === 'products' && (
  <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
    
    {/* LEFT FORM */}
    <div className="admin-form-card" style={{ 
      flex: '1 1 320px', 
      minWidth: '220px', 
      maxWidth: '400px', 
      width: '100%',
      backgroundColor: theme.bgCard, 
      padding: '24px 12px', 
      borderRadius: '16px', 
      border: `1px solid ${theme.border}`,
      position: 'sticky', 
      top: '20px', 
      height: 'fit-content',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
        {editingId ? "Edit Product" : "Add New Product"}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <input
          type="text"
          placeholder="Product Name"
          required
          value={newProduct.name}
          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Price (₹)"
          required
          value={newProduct.price}
          onChange={e => setNewProduct({...newProduct, price: e.target.value})}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Category"
          required
          value={newProduct.category}
          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
          style={inputStyle}
        />

        {/* IMAGE UPLOAD */}
        <div style={{
          padding: '15px',
          borderRadius: '10px',
          border: `1px dashed ${theme.border}`,
          backgroundColor: theme.bgSoft
        }}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {isUploading && (
            <p style={{ marginTop: '8px', fontSize: '13px', color: theme.accent }}>
              Uploading image...
            </p>
          )}
        </div>

        <textarea
          placeholder="Product Description..."
          required
          rows="4"
          value={newProduct.description}
          onChange={e => setNewProduct({...newProduct, description: e.target.value})}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={isUploading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: theme.accent,
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {editingId ? 'Update' : 'Save'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'transparent',
                color: theme.textSecondary,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>

    {/* RIGHT PRODUCT TABLE */}
    <div className="admin-products-card" style={{
      flex: '2 1 400px',
      minWidth: '220px',
      maxWidth: '700px',
      width: '100%',
      backgroundColor: theme.bgCard,
      padding: '24px 12px',
      borderRadius: '16px',
      border: `1px solid ${theme.border}`,
      margin: '0 auto',
      marginTop: '18px',
      boxSizing: 'border-box'
    }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h3 style={{ margin: 0 }}>
          Inventory ({filteredProducts.length})
        </h3>

        <input
          type="text"
          placeholder="Search product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ ...inputStyle, width: '220px' }}
        />
      </div>

      {/* CATEGORY FILTER */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {uniqueCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              border: `1px solid ${filterCategory === cat ? theme.accent : theme.border}`,
              backgroundColor: filterCategory === cat ? theme.accent : theme.bgSoft,
              color: filterCategory === cat ? '#000' : theme.textSecondary
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Responsive: Table on desktop, cards on mobile */}
      <div className="product-table-desktop" style={{ display: 'block' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead style={{ color: theme.textSecondary }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Details</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} style={{ borderTop: `1px solid ${theme.border}` }}>
                <td style={{ padding: '12px' }}>
                  <img
                    src={p.imageUrl ? p.imageUrl.replace('http://localhost:8082', 'https://makhana-backend.onrender.com') : ''}
                    alt={p.name}
                    style={{
                      width: '55px',
                      height: '55px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: '600' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                    {p.category}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: theme.textSecondary }}>
                    {p.description}
                  </div>
                </td>
                <td style={{ padding: '12px', color: theme.accent, fontWeight: '600' }}>
                  ₹{p.price}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEditClick(p)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: theme.accent,
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: theme.danger,
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="product-table-mobile" style={{ display: 'none' }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{
            background: theme.bgSoft,
            borderRadius: '14px',
            marginBottom: '18px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <img
                src={p.imageUrl ? p.imageUrl.replace('http://localhost:8082', 'https://makhana-backend.onrender.com') : ''}
                alt={p.name}
                style={{
                  width: '55px',
                  height: '55px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  marginRight: 14
                }}
              />
              <div>
                <div style={{ fontWeight: '600' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>{p.category}</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: 8 }}>{p.description}</div>
            <div style={{ fontSize: '14px', color: theme.accent, fontWeight: '600', marginBottom: 8 }}>₹{p.price}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleEditClick(p)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: theme.accent,
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(p.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: theme.danger,
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Delete
              </button>
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
        .admin-form-card, .admin-products-card {
          margin-bottom: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .product-table-desktop, .product-table-mobile {
          width: 100%;
          min-width: 0;
        }
        @media (max-width: 1200px) {
          .admin-form-card, .admin-products-card {
            max-width: 98vw;
          }
        }
        @media (max-width: 900px) {
          .product-table-desktop { display: none !important; }
          .product-table-mobile { display: block !important; }
          .admin-form-card, .admin-products-card {
            max-width: 98vw;
            width: 100%;
            margin: 0 auto 18px auto;
            padding: 10px 2vw !important;
          }
        }
        @media (min-width: 901px) {
          .product-table-desktop { display: block !important; }
          .product-table-mobile { display: none !important; }
        }
        @media (max-width: 600px) {
          .product-table-mobile > div {
            padding: 10px !important;
            font-size: 13px !important;
          }
          .admin-form-card, .admin-products-card {
            padding: 8px 2vw !important;
          }
        }
      `}</style>

    </div>
  </div>
)}
    </div>
  );
}

function StatCard({ title, value, theme }) {
  return (
    <div style={{
      flex: 1,
      minWidth: '220px',
      background: theme.bgCard,
      padding: '25px',
      borderRadius: '16px',
      border: `1px solid ${theme.border}`
    }}>
      <p style={{ color: theme.textSecondary }}>{title}</p>
      <h2 style={{ color: theme.accent }}>{value}</h2>
    </div>
  );
}

export default AdminDashboard;
