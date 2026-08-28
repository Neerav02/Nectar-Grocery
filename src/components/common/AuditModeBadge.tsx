import React from 'react';
import { TestTube, CheckCircle2 } from 'lucide-react';
import { useAuditStore } from '../../stores/useAuditStore';
import { useToastStore } from '../../stores/useToastStore';
import { clsx } from 'clsx';

export const AuditModeBadge: React.FC = () => {
  const isAuditModeEnabled = useAuditStore((state) => state.isAuditModeEnabled);
  const toggleAuditMode = useAuditStore((state) => state.toggleAuditMode);
  const addToast = useToastStore((state) => state.addToast);

  const handleToggle = () => {
    toggleAuditMode();
    if (!isAuditModeEnabled) {
      addToast('Evaluator Audit Mode Activated! Interactive race condition & resilience debug controls exposed.', 'info');
    } else {
      addToast('Evaluator Audit Mode Deactivated. Returned to pristine consumer view.', 'success');
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title="Toggle Assignment Evaluator Audit Mode"
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border shadow-xs cursor-pointer select-none',
        isAuditModeEnabled
          ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 animate-pulse'
          : 'bg-emerald-50 text-[#53B175] border-emerald-200 hover:bg-emerald-100'
      )}
    >
      <TestTube className="w-3.5 h-3.5" />
      <span>{isAuditModeEnabled ? 'Evaluator Mode: ON' : '🧪 Evaluator Mode'}</span>
      {isAuditModeEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-white ml-0.5" />}
    </button>
  );
};
