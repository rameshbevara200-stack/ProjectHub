import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, warningNote, onConfirm, onCancel, confirmText = 'Execute Delete', loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#141719] max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-[#697077] hover:text-[#141719] p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#C85A32]/10 border border-[#C85A32] flex items-center justify-center text-[#C85A32] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#C85A32] font-bold block">
              Permanent Deletion Protocol
            </span>
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#141719]">{title}</h3>
          </div>
        </div>

        <p className="text-xs text-[#484F56] leading-relaxed mb-4">{message}</p>

        {warningNote && (
          <div className="p-3.5 bg-[#F8F7F4] border-l-2 border-[#C85A32] font-mono text-[11px] text-[#697077] mb-6 leading-relaxed">
            <strong className="text-[#141719] block mb-0.5">CASCADING DELETION IMPACT:</strong>
            {warningNote}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="finisterre-btn-outline text-xs py-2 px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="finisterre-btn-rust text-xs py-2 px-4"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            <span>{loading ? 'Executing...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
