import React from 'react';
import { CheckCircle2, Heart, Info, X } from 'lucide-react';
import { useToastStore } from '../../stores/useToastStore';
import { clsx } from 'clsx';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed z-50 flex flex-col gap-2 pointer-events-none transition-all duration-300
                 bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md w-auto"
    >
      {toasts.map((toast) => {
        const isWishlist = toast.message.toLowerCase().includes('wishlist');
        const isBasket = toast.message.toLowerCase().includes('basket') || toast.message.toLowerCase().includes('cart');

        return (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-up',
              toast.type === 'success'
                ? 'bg-[#181725]/90 text-white border-white/20'
                : toast.type === 'info'
                ? 'bg-emerald-950/90 text-white border-emerald-500/30'
                : 'bg-red-950/90 text-white border-red-500/30'
            )}
          >
            <div className="flex items-center gap-2.5">
              {isWishlist ? (
                <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                </div>
              ) : isBasket ? (
                <div className="w-7 h-7 rounded-full bg-[#53B175]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#53B175]" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-gray-400 hover:text-white transition-colors rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
