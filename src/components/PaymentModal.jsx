import React from 'react';

export default function PaymentModal({ open, onClose, totalAmount, onCOD, onOnline }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#111827',
        borderRadius: 18,
        padding: 36,
        minWidth: 340,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        color: '#F8FAFC',
        textAlign: 'center',
        border: '1px solid #334155',
      }}>
        <h2 style={{ marginBottom: 18 }}>Select Payment Method</h2>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 28, color: '#C6A75E' }}>
          Total: ₹{totalAmount}
        </div>
        <button
          onClick={onCOD}
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 16,
            background: '#14532D',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            transition: '0.2s',
          }}
        >
          Cash on Delivery
        </button>
        <button
          onClick={onOnline}
          style={{
            width: '100%',
            padding: 14,
            background: '#C6A75E',
            color: '#000',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            transition: '0.2s',
          }}
        >
          Online Payment
        </button>
        <button
          onClick={onClose}
          style={{
            marginTop: 18,
            background: 'none',
            color: '#94A3B8',
            border: 'none',
            fontSize: 15,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
