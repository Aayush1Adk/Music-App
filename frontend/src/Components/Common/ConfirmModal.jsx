import React from 'react';
import CustomButton from './CustomButton';

export default function ConfirmModal({ title, message, confirmLabel = 'delete', onConfirm, onCancel, loading }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-head">
          <span>{title}</span>
          <span style={{ color: 'var(--text-muted)' }}>rm -rf</span>
        </div>
        <div className="modal-box-body">{message}</div>
        <div className="modal-box-actions">
          <CustomButton variant="ghost" onClick={onCancel}>cancel</CustomButton>
          <CustomButton variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</CustomButton>
        </div>
      </div>
    </div>
  );
}
