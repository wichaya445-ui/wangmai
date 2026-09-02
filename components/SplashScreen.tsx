import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F9F3FF] z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>

      <div className={`transition-all duration-1000 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-pink-200 rounded-full blur-2xl opacity-30 animate-ping"></div>
          
          <img 
            src="https://i.postimg.cc/jdQKYMRY/Logo-wangwai-removebg-preview.png" 
            alt="Wang Mai Logo" 
            className="w-56 h-56 object-contain relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;