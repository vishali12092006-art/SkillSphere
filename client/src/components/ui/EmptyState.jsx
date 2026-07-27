import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="empty-state">
    {Icon && (
      <div className="empty-state-icon">
        <Icon size={24} />
      </div>
    )}
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--color-text)' }}>{title}</h4>
      {description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: 320, margin: '0 auto' }}>
          {description}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default EmptyState;
