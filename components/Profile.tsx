
import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  History, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  LayoutDashboard,
  Users,
  CalendarDays,
  Plus,
  Minus,
  Lock,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { Room, Page } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileProps {
  rooms: Room[];
  bookings: any[];
  user: any;
  onNavigate: (page: Page) => void;
}

const ADMIN_EMAILS = ["admin@wangmai.com", "staff@wangmai.com", "phongsakorn@wangmai.com"];

const Profile: React.FC<ProfileProps> = ({ rooms, bookings = [], user, onNavigate }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTab, setAdminTab] = useState<'bookings' | 'rooms'>('bookings');
  
  // กรองเฉพาะการจองของผู้ใช้ที่ล็อกอินอยู่
  const myBookings = (bookings || []).filter(b => b && b.user_id === user?.id);
  const isAuthorizedAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('LOGIN');
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin1234") {
      setIsAdminMode(true);
      setShowAdminAuth(false);
      setAdminPassword('');
    } else {
      alert("รหัสผ่านไม่ถูกต้อง!");
    }
  };

  const handleUpdateStatus = async (bookingId: string, roomId: string, newStatus: string) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
    if (error) alert(error.message);
  };

  const handleAdjustSeats = async (roomId: string, delta: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    const newCount = Math.max(0, Math.min(room.totalSeats, room.availableSeats + delta));
    const { error } = await supabase.from('rooms').update({ available_seats: newCount }).eq('id', roomId);
    if (error) alert(error.message);
  };

  // ดึงชื่อและรหัสจาก metadata ทันที
  const displayName = user?.user_metadata?.full_name || "ผู้ใช้งาน";
  const displayStudentId = user?.user_metadata?.student_id || "ไม่ได้ระบุ";

  const AdminView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black text-purple-600 flex items-center gap-2">
            <LayoutDashboard size={24} /> แผงควบคุมแอดมิน
        </h3>
        <button onClick={() => setIsAdminMode(false)} className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-500">
          ออกจากแอดมิน
        </button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button 
          onClick={() => setAdminTab('bookings')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${adminTab === 'bookings' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
        >
          จัดการคิวจอง
        </button>
        <button 
          onClick={() => setAdminTab('rooms')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${adminTab === 'rooms' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
        >
          จัดการห้อง
        </button>
      </div>

      <div className="space-y-3">
        {adminTab === 'bookings' ? (
          bookings.map((booking) => {
            const room = rooms.find(r => r.id === booking.room_id);
            return (
              <div key={booking.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-purple-600">{room?.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{booking.student_id}</p>
                </div>
                {booking.status === 'Active' && (
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, booking.room_id, 'Completed')}
                    className="bg-green-500 text-white p-2 rounded-xl"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex justify-between items-center">
              <span className="text-sm font-black text-gray-700">{room.name}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => handleAdjustSeats(room.id, -1)} className="p-1 bg-red-100 text-red-500 rounded"><Minus size={14} /></button>
                <span className="text-xs font-bold w-4 text-center">{room.availableSeats}</span>
                <button onClick={() => handleAdjustSeats(room.id, 1)} className="p-1 bg-green-100 text-green-500 rounded"><Plus size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="px-6 py-4 min-h-[90vh] pb-32">
       {isAdminMode ? (
         <AdminView />
       ) : showAdminAuth ? (
         <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border-2 border-purple-100 text-center w-full max-w-xs">
              <Lock size={40} className="mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-black mb-6">รหัสแอดมิน</h3>
              <form onSubmit={handleAdminAuth} className="space-y-4">
                 <input 
                   type="password" 
                   value={adminPassword}
                   onChange={(e) => setAdminPassword(e.target.value)}
                   className="w-full p-4 bg-gray-50 border-2 border-purple-100 rounded-2xl text-center font-black"
                   autoFocus
                 />
                 <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black">เข้าสู่โหมดแอดมิน</button>
                 <button type="button" onClick={() => setShowAdminAuth(false)} className="text-gray-400 font-bold text-xs">ยกเลิก</button>
              </form>
            </div>
         </div>
       ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100 flex items-center gap-4 relative overflow-hidden">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
               <UserIcon size={32} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-gray-800 truncate">{displayName}</h3>
                {isAuthorizedAdmin && <BadgeCheck size={18} className="text-purple-500" />}
              </div>
              <p className="text-xs text-pink-500 font-black truncate">{user?.email}</p>
              <p className="text-[10px] text-gray-400 font-bold">ID: {displayStudentId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-[32px] text-white shadow-md">
               <p className="text-[10px] font-bold uppercase opacity-80 mb-1">จองค้างไว้</p>
               <p className="text-3xl font-black">{myBookings.filter(b => b.status === 'Active').length}</p>
            </div>
            <div className="bg-white border-2 border-purple-100 p-5 rounded-[32px] text-purple-600 shadow-sm">
               <p className="text-[10px] font-bold uppercase opacity-60 mb-1">ประวัติทั้งหมด</p>
               <p className="text-3xl font-black">{myBookings.length}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-gray-700 font-black flex items-center gap-2 px-2">
                <History size={18} className="text-pink-500" />
                การจองของฉัน
            </h4>
            {myBookings.length > 0 ? (
              myBookings.map((booking) => {
                const room = rooms.find(r => r.id === booking.room_id);
                return (
                  <div key={booking.id} className="bg-white rounded-[28px] p-4 shadow-sm border border-gray-50 flex gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                       <img src={room?.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <h5 className="font-black text-gray-800 text-xs truncate pr-2">{room?.name || 'ห้องชมภาพยนตร์'}</h5>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${booking.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            {booking.status}
                          </span>
                       </div>
                       <p className="text-[11px] text-pink-500 font-black">{booking.time_slot}</p>
                       <p className="text-[9px] text-gray-400 font-bold">ที่นั่ง: {booking.selected_seats?.join(', ')}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
                 <p className="text-gray-400 text-sm font-bold">ยังไม่เคยมีการจองในบัญชีนี้</p>
                 <button onClick={() => onNavigate('ROOM_LIST')} className="mt-2 text-pink-500 text-xs font-black underline">ไปจองห้องแรกกัน!</button>
              </div>
            )}
          </div>

          <div className="pt-4 space-y-3">
            {isAuthorizedAdmin && (
              <button 
                onClick={() => setShowAdminAuth(true)}
                className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-purple-200 text-purple-600 font-black text-sm flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                   <ShieldCheck size={18} /> เข้าสู่โหมดแอดมิน
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <LogOut size={18} /> ออกจากระบบ
            </button>
          </div>
        </div>
       )}
    </div>
  );
};

export default Profile;
