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
        'inline-flex items-center gap-1.5 px-3 h-10 rounded-full text-xs font-bold transition-all duration-200 border shadow-2xs cursor-pointer select-none whitespace-nowrap shrink-0',
        isAuditModeEnabled
          ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
          : 'bg-[#EEF8F2] text-[#53B175] border-[#53B175]/30 hover:bg-[#53B175] hover:text-white hover:border-transparent'
      )}
    >
      <TestTube className="w-4 h-4 shrink-0" />
      <span>{isAuditModeEnabled ? 'Evaluator Mode: ON' : 'Evaluator Mode'}</span>
      {isAuditModeEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-white ml-0.5 shrink-0" />}
    </button>
  );
};
