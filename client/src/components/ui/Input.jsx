import React from 'react';
import { AlertCircle } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  id,
  error,
  className = '',
  type = 'text',
  required = false,
  hint,
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span style={{ color: 'var(--color-error)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {hint && !error && (
        <span className="text-xs text-muted">{hint}</span>
      )}
      {error && (
        <span className="form-error">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
