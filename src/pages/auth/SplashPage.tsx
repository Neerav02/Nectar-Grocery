import React, { useEffect } from 'react';

interface SplashPageProps {
  onFinish: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 bg-[#53B175] flex flex-col items-center justify-center text-white p-6 cursor-pointer select-none animate-fade-in"
    >
      <div className="flex items-center space-x-3 mb-2 animate-bounce">
        <img
          src="/images/Icon.png"
          alt="Nectar Logo"
          className="w-14 h-16 object-contain filter brightness-0 invert"
        />
        <h1 className="text-5xl font-extrabold tracking-tight text-white font-sans lowercase">
          nectar
        </h1>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">
        online groceries
      </p>
    </div>
  );
};
