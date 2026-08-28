import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 inset-x-0 z-50 px-4 py-2 text-xs font-bold text-center text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 ${
        !isOnline ? 'bg-amber-600' : 'bg-[#53B175]'
      }`}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>You are currently offline. Cart and search updates will sync when reconnected.</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span>Internet connection restored! Synchronization active.</span>
        </>
      )}
    </div>
  );
};
