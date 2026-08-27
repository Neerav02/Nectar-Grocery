import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';

export const CartResilienceNotice: React.FC = () => {
  const warnings = useCartStore((state) => state.resilienceWarnings);
  const dismissWarning = useCartStore((state) => state.dismissWarning);
  const clearAllWarnings = useCartStore((state) => state.clearAllWarnings);

  if (warnings.length === 0) return null;

  return (
    <div className="mb-4 bg-amber-50 border border-amber-300 rounded-2xl p-4 animate-fade-in shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Cart Synchronized (Resilience Alert)</span>
        </div>
        <button
          onClick={clearAllWarnings}
          className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
        >
          Dismiss All
        </button>
      </div>

      <ul className="space-y-1.5 text-xs text-amber-800 pl-7 list-disc">
        {warnings.map((msg, idx) => (
          <li key={idx} className="flex items-start justify-between">
            <span className="leading-snug">{msg}</span>
            <button
              onClick={() => dismissWarning(idx)}
              className="ml-2 text-amber-600 hover:text-amber-900 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
