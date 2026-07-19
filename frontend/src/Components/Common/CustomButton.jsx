import React from 'react';

// variant: 'default' | 'primary' | 'ghost' | 'danger'
export default function CustomButton({
  children,
  variant = 'default',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  active = false,
  className = '',
  ...rest
}) {
  const variantClass = variant === 'primary' ? 'btn-primary'
    : variant === 'ghost' ? 'btn-ghost'
    : variant === 'danger' ? 'btn-danger'
    : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${active ? 'active' : ''} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'working…' : children}
    </button>
  );
}
