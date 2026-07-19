import React from 'react';

export default function TextInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  hint,
  error,
  name,
  ...rest
}) {
  return (
    <div className="field">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...rest}
      />
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
