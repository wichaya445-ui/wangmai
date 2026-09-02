
import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface TopBarProps {
  onLogoClick?: () => void;
  onOpenMenu?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogoClick, onOpenMenu }) => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-[#F9F3FF] z-50 h-20 shadow-sm sm:max-w-md sm:mx-auto">
      {/* Menu Button */}
      <button 
        onClick={onOpenMenu}
        className="w-10 h-10 flex items-center justify-center bg-[#FDE8F3] rounded-full shadow-sm text-[#E91E63] flex-shrink-0 active:scale-90 transition-transform"
      >
        <Menu size={24} strokeWidth={2.5} />
      </button>
      
      {/* Central Logo Image Area */}
      <div 
        className="flex-1 flex items-center justify-center px-2 cursor-pointer transition-transform active:scale-95"
        onClick={onLogoClick}
      >
        <div className="h-14 flex items-center justify-center">
          <img 
            src="https://i.postimg.cc/jdQKYMRY/Logo-wangwai-removebg-preview.png" 
            alt="Wang Mai Logo" 
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Notification Button */}
      <button className="w-10 h-10 flex items-center justify-center bg-[#FDE8F3] rounded-full shadow-sm text-[#E91E63] relative flex-shrink-0">
        <Bell size={24} fill="currentColor" />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </div>
  );
};

export default TopBar;
