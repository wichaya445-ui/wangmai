import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="px-6 pb-24 space-y-6">
      
      {/* Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg shadow-pink-200 mt-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <h2 className="text-3xl font-bold text-white drop-shadow-md z-10">พื้นที่โฆษณา</h2>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      </div>

      {/* Check Availability Section */}
      <div className="space-y-3">
        <h3 className="text-gray-700 font-semibold text-lg">ตรวจสอบห้องว่าง</h3>
        <button 
          onClick={() => onNavigate('ROOM_LIST')}
          className="w-full h-24 bg-gradient-to-r from-pink-200 to-purple-200 rounded-3xl flex items-center justify-center gap-4 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <div className="bg-pink-500 p-3 rounded-2xl text-white shadow-lg shadow-pink-300">
             <CalendarCheck size={32} />
          </div>
          <span className="text-pink-600 font-bold text-xl">ตรวจสอบสถานะห้องว่าง</span>
        </button>
      </div>

      {/* Trending Movies */}
      <div className="space-y-3">
        <h3 className="text-gray-700 font-semibold text-lg">ภาพยนตร์เป็นกระแส</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
           {/* Updated Movie Posters */}
           <div className="min-w-[160px] h-[240px] rounded-2xl overflow-hidden shadow-md relative">
              <img src="https://i.postimg.cc/MKznfPKH/ธี่หยด_3.png" className="w-full h-full object-cover" alt="ธี่หยด 2" />
           </div>
           <div className="min-w-[160px] h-[240px] rounded-2xl overflow-hidden shadow-md relative">
              <img src="https://i.postimg.cc/3rym1bgW/คืนฝันก่อนฉันลืมเธอ.png" className="w-full h-full object-cover" alt="คืนฝันก่อนฉันลืมเธอ" />
           </div>
           <div className="min-w-[160px] h-[240px] rounded-2xl overflow-hidden shadow-md relative">
              <img src="https://i.postimg.cc/5y1ZpF6z/เดี่ยว.png" className="w-full h-full object-cover" alt="เดี่ยว" />
           </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;