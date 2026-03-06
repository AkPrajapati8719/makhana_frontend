
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Login({ setUser }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  // 🌑 PREMIUM DARK THEME
  const theme = {
    bgPrimary: '#0F172A',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    accent: '#C6A75E',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    inputBg: '#1E293B'
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginView) {
      axios.post('https://makhana-backend.onrender.com/api/users/login', { email, password })
        .then((response) => {
          toast.success(`Welcome back, ${response.data.name}!`);
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          if (response.data.role === 'ROLE_ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        })
        .catch((error) => {
          toast.error("Login Failed: " + (error.response?.data || "Invalid credentials"));
        });
    } else {
      const newUser = { name, email, password, phone, address };
      axios.post('https://makhana-backend.onrender.com/api/users/register', newUser)
        .then(() => {
          toast.success("Account created successfully! Please login.");
          setIsLoginView(true);
          setPassword('');
        })
        .catch((error) => {
          toast.error("Signup Failed: " + (error.response?.data || "Email might already exist"));
        });
    }
  };

  const inputStyle = {
    padding: '15px 18px',
    borderRadius: '10px',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.inputBg,
    fontSize: '15px',
    color: theme.textPrimary,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: '0.3s'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.bgPrimary,
      padding: '40px 5vw',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* PREMIUM GLASS CARD */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '45px',
        background: theme.cardBg,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: theme.textPrimary
          }}>
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: theme.textSecondary
          }}>
            {isLoginView
              ? 'Login to access your premium account.'
              : 'Join Evendri for luxury organic experience.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {!isLoginView && (
            <>
              <input type="text" placeholder="Full Name" required value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              />

              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={phone}
                maxLength="10"
                pattern="[0-9]{10}"
                inputMode="numeric"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
                  setPhone(value.slice(0, 10)); // limit to 10 digits
                }}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              />

              <input type="text" placeholder="Complete Address" required value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              />
            </>
          )}

          <input type="email" placeholder="Email Address" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = theme.accent}
            onBlur={e => e.target.style.borderColor = theme.border}
          />

          <input type="password" placeholder="Password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = theme.accent}
            onBlur={e => e.target.style.borderColor = theme.border}
          />

          <button
            type="submit"
            style={{
              padding: '15px',
              background: theme.accent,
              color: '#000',
              border: 'none',
              borderRadius: '30px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px',
              transition: '0.3s'
            }}
            onMouseOver={e => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
          >
            {isLoginView ? 'Login Securely' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '25px',
          color: theme.textSecondary,
          fontSize: '14px'
        }}>
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLoginView(!isLoginView);
              setPassword('');
            }}
            style={{
              color: theme.accent,
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {isLoginView ? 'Sign Up' : 'Login'}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;