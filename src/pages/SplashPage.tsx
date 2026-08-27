import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashPageProps {
  onFinish: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1600);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#53B175] flex flex-col items-center justify-center text-white p-6 animate-fade-in select-none cursor-pointer" onClick={onFinish}>
      <div className="flex items-center space-x-3 mb-2 animate-bounce">
        <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
          <Sparkles className="w-10 h-10 fill-white stroke-none" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">nectar</h1>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">
        online groceries
      </p>
    </div>
  );
};
