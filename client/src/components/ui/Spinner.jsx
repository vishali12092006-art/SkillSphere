import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => (
  <div className={`spinner spinner-${size} ${className}`} role="status" aria-label="Loading" />
);

export const PageSpinner = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1rem',
  }}>
    <div className="spinner spinner-lg" />
    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Loading...</span>
  </div>
);

export default Spinner;
