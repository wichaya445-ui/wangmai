import React from 'react';
import { Film, CalendarClock, UserCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'my-bookings';
  setActiveTab: (tab: 'home' | 'my-bookings') => void;
  userBookingsCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userBookingsCount }) => {
  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <Film className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold leading-none">UniMedia Space</h1>
              <p className="text-xs text-blue-200">ระบบจองห้องชมภาพยนตร์</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'home' 
                  ? 'bg-blue-800 text-white' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <CalendarClock size={18} />
              หน้าหลัก
            </button>
            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'my-bookings' 
                  ? 'bg-blue-800 text-white' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <UserCircle size={18} />
              การจองของฉัน
              {userBookingsCount > 0 && (
                <span className="bg-yellow-500 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {userBookingsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;