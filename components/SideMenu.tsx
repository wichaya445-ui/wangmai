
import React from 'react';
import { X, User, QrCode, Star, HelpCircle, LogOut } from 'lucide-react';
import { Page } from '../types';
import { supabase } from '../lib/supabase';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onNavigate: (page: Page) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user, onNavigate }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('LOGIN');
    onClose();
  };

  const menuItems = [
    { id: 'ACCOUNT_SETTINGS', label: 'จัดการบัญชี', icon: <User size={24} className="text-white" />, page: 'ACCOUNT_SETTINGS' as Page },
    { id: 'PERSONAL_QR', label: 'QR code การจอง', icon: <QrCode size={24} className="text-gray-400" />, page: 'PERSONAL_QR' as Page, isPlaceholder: true },
    { id: 'POINTS_HISTORY', label: 'คะแนนสะสม ความประพฤติ', icon: <Star size={24} className="text-gray-400" />, page: 'POINTS_HISTORY' as Page, isPlaceholder: true },
    { id: 'FAQ', label: 'คำถามที่พบบ่อย', icon: <HelpCircle size={24} className="text-purple-500" />, page: 'FAQ' as Page },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Menu Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#F9F9F9] z-[70] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        
        {/* Close Button */}
        <div className="p-6">
          <button onClick={onClose} className="text-[#E91E63] hover:scale-110 transition-transform">
            <X size={48} strokeWidth={3} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-8 mb-10 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-pink-500 to-pink-400">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <User size={40} className="text-purple-500" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase">USERNAME</h2>
            <p className="text-[11px] text-gray-500 font-bold">{user?.email || 'student@ssru.ac.th'}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-6 space-y-4">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => { onNavigate(item.page); onClose(); }}
              className="w-full flex items-center gap-4 p-2 group active:scale-95 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${item.id === 'ACCOUNT_SETTINGS' ? 'bg-purple-500' : 'bg-gray-200'}`}>
                {item.icon}
              </div>
              <span className="text-lg font-black text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-8">
          <button 
            onClick={handleLogout}
            className="w-full bg-white py-4 rounded-3xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all border border-gray-100"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <LogOut size={20} className="rotate-180" />
            </div>
            <span className="text-lg font-black text-gray-700">ออกจากระบบ</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default SideMenu;
