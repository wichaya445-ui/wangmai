import React from 'react';
import { Home, Film, CalendarCheck, User } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'HOME', icon: Home, label: 'หน้าหลัก', page: 'HOME' as Page },
    { id: 'MOVIES', icon: Film, label: 'ภาพยนตร์', page: 'MOVIES' as Page },
    { id: 'ROOM_LIST', icon: CalendarCheck, label: 'จองห้อง', page: 'ROOM_LIST' as Page },
    { id: 'PROFILE', icon: User, label: 'บัญชี', page: 'PROFILE' as Page },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] px-6 py-4 flex justify-between items-end z-50">
      {navItems.map((item) => {
        const isActive = activePage === item.page || (activePage === 'BOOKING_SEAT' && item.page === 'ROOM_LIST'); // Keep Booking active for room list flow
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.page)}
            className="flex flex-col items-center gap-1 w-16"
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-purple-100' : 'bg-transparent'}`}>
                <item.icon 
                size={28} 
                className={`transition-colors duration-300 ${isActive ? 'text-purple-600' : 'text-slate-800'}`} 
                strokeWidth={2}
                />
            </div>
            <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : 'text-slate-600'}`}>
              {item.label}
            </span>
            {isActive && <div className="w-8 h-1 bg-purple-600 rounded-full mt-1"></div>}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;