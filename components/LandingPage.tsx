import React from 'react';
import { ChevronRight, Popcorn, Clapperboard, User, Star, Sparkles, UserRound } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 via-pink-100 to-pink-50 relative overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Top Center Sun/Star */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 animate-spin-slow">
           <Star size={40} className="text-yellow-400 fill-yellow-400 opacity-80" />
        </div>

        {/* Top Left Sparkle */}
        <div className="absolute top-[15%] left-[10%] animate-pulse">
           <Sparkles size={32} className="text-teal-300" />
        </div>

        {/* Popcorn Icon */}
        <div className="absolute top-[18%] left-[20%] md:left-[30%] animate-bounce duration-[3000ms]">
          <div className="bg-white p-4 rounded-full shadow-xl transform -rotate-12">
            <Popcorn size={48} className="text-red-500" />
          </div>
        </div>
        
        {/* Male Avatar */}
        <div className="absolute top-[22%] right-[20%] md:right-[30%] animate-bounce duration-[4000ms] delay-700">
          <div className="bg-white p-4 rounded-full shadow-xl transform rotate-6">
             <User size={48} className="text-yellow-600" />
          </div>
        </div>

        {/* Female Avatar */}
        <div className="absolute top-[35%] left-[15%] md:left-[25%] animate-bounce duration-[3500ms] delay-300">
          <div className="bg-white p-4 rounded-full shadow-xl transform -rotate-6">
             <UserRound size={48} className="text-gray-700" />
          </div>
        </div>
        
        {/* Clapperboard */}
        <div className="absolute top-[40%] right-[15%] md:right-[25%] animate-bounce duration-[3200ms] delay-500">
          <div className="bg-white p-4 rounded-full shadow-xl transform rotate-12">
             <Clapperboard size={48} className="text-blue-500" />
          </div>
        </div>

        {/* Random Shapes */}
        <div className="absolute top-[28%] left-1/2 w-8 h-8 border-4 border-lime-300 transform rotate-45 rounded-sm opacity-60"></div>
        <div className="absolute top-[45%] right-[10%] opacity-60">
             <Star size={24} className="text-purple-400 fill-purple-400" />
        </div>
         <svg className="absolute top-[25%] left-[10%] w-6 h-6 text-red-400 opacity-60" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="15">
            <path d="M0 10 Q25 20 50 10 T100 10" />
        </svg>
        <svg className="absolute bottom-[40%] right-[20%] w-8 h-8 text-blue-400 opacity-60" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="15">
            <path d="M0 10 Q25 0 50 10 T100 10" />
        </svg>

      </div>

      {/* Content Container */}
      <div className="z-10 w-full max-w-md px-6 flex flex-col items-center mt-48 sm:mt-64">
        
        {/* White Text Box */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-8 shadow-xl mb-10 w-full text-center border border-white/50">
          <h2 className="text-xl md:text-2xl text-pink-500 font-bold mb-2">
             เปลี่ยนการดูหนังในสวนสุนันทาให้ง่ายกว่าเดิมกับ
          </h2>
          <h1 className="text-3xl md:text-4xl text-red-500 font-extrabold mb-3 drop-shadow-sm">
            'ว่างมั้ย'
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed">
            เช็คสถานะห้องว่างแบบเรียลไทม์ <br/>
            จองเวลาที่ใช่ เลือกแอปสตรีมมิ่งที่ชอบ
          </p>
        </div>

        {/* Bottom Tagline */}
        <div className="text-center mb-16 space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold text-pink-600">
            ครบจบในที่เดียว
          </h3>
          <p className="text-pink-500 text-lg md:text-xl font-semibold">
            รู้ก่อนขึ้น จองก่อนดู ไม่ต้องลุ้นหน้างาน
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onEnter}
          className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white p-5 rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-110 transition-all duration-300"
          aria-label="Enter App"
        >
          <ChevronRight size={36} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </button>

      </div>
    </div>
  );
};

export default LandingPage;