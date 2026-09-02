
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import RoomList from './components/RoomList';
import StreamingList from './components/StreamingList';
import BookingSeat from './components/BookingSeat';
import BookingTime from './components/BookingTime';
import BookingDetails from './components/BookingDetails';
import QRCodeScreen from './components/QRCodeScreen';
import SuccessScreen from './components/SuccessScreen';
import Profile from './components/Profile';
import SideMenu from './components/SideMenu';
import Login from './components/Login';
import Signup from './components/Signup';
import { Page, Room } from './types';
import { supabase } from './lib/supabase';
import { MOCK_ROOMS } from './constants';
import { ChevronLeft, ShieldCheck, QrCode, Star, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingDetails, setBookingDetails] = useState<{
    seats?: string[];
    studentIds?: string[];
    time?: string;
    duration?: number;
    endTime?: string;
  }>({});

  const fetchData = async () => {
    try {
        const { data: roomsData } = await supabase.from('rooms').select('*').order('name');
        if (roomsData) {
          const mappedRooms = roomsData.map((dbData: any): Room => ({
            id: dbData.id,
            name: dbData.name,
            type: dbData.type,
            capacity: dbData.capacity,
            totalSeats: dbData.total_seats,
            availableSeats: dbData.available_seats,
            imageUrl: dbData.image_url,
            tags: Array.isArray(dbData.tags) ? dbData.tags : [],
            facilities: Array.isArray(dbData.facilities) ? dbData.facilities : []
          }));
          setRooms(mappedRooms);
        }

        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        if (bookingsData) setBookings(bookingsData);
    } catch (err) {
        console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
        if (currentPage === 'LOGIN' || currentPage === 'SIGNUP') {
          setCurrentPage('HOME');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [currentPage]);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;
  if (showLanding) return <LandingPage onEnter={() => { setShowLanding(false); if (!user) setCurrentPage('LOGIN'); }} />;

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (!user && currentPage !== 'LOGIN' && currentPage !== 'SIGNUP') {
      return <Login onNavigate={navigateTo} />;
    }

    switch (currentPage) {
      case 'LOGIN': return <Login onNavigate={navigateTo} />;
      case 'SIGNUP': return <Signup onNavigate={navigateTo} />;
      case 'HOME': return <Home onNavigate={navigateTo} />;
      case 'ROOM_LIST': return <RoomList rooms={rooms} bookings={bookings} onSelectRoom={(room) => { setSelectedRoom(room); navigateTo('BOOKING_TIME'); }} />;
      case 'MOVIES': return <StreamingList />;
      case 'BOOKING_TIME': return <BookingTime onBack={() => navigateTo('ROOM_LIST')} onNext={(time, duration, endTime) => { setBookingDetails({ ...bookingDetails, time, duration, endTime }); navigateTo('BOOKING_SEAT'); }} />;
      case 'BOOKING_SEAT': return selectedRoom ? <BookingSeat room={selectedRoom} rooms={rooms} bookings={bookings} selectedTimeSlot={`${bookingDetails.time} - ${bookingDetails.endTime}`} onBack={() => navigateTo('BOOKING_TIME')} onNext={(seats) => { setBookingDetails({ ...bookingDetails, seats }); navigateTo('BOOKING_DETAILS'); }} /> : <RoomList rooms={rooms} bookings={bookings} onSelectRoom={(room) => { setSelectedRoom(room); navigateTo('BOOKING_TIME'); }} />;
      case 'BOOKING_DETAILS': return <BookingDetails seats={bookingDetails.seats || []} onBack={() => navigateTo('BOOKING_SEAT')} onConfirm={async (studentIds) => {
          if (!selectedRoom || !user) return;
          const { error } = await supabase.from('bookings').insert([{
            room_id: selectedRoom.id,
            user_id: user.id,
            student_id: studentIds.join(', '),
            selected_seats: bookingDetails.seats,
            time_slot: `${bookingDetails.time} - ${bookingDetails.endTime}`,
            status: 'Active'
          }]);
          if (error) { alert(error.message); return; }
          await fetchData();
          setBookingDetails({ ...bookingDetails, studentIds });
          navigateTo('QR_CODE');
        }} />;
      case 'QR_CODE': return <QRCodeScreen onNext={() => navigateTo('SUCCESS')} />;
      case 'SUCCESS': return <SuccessScreen onHome={() => navigateTo('HOME')} bookingTime={bookingDetails.endTime || "15:30 น."} />;
      case 'PROFILE': return <Profile rooms={rooms} bookings={bookings} user={user} onNavigate={navigateTo} />;
      
      // New Hamburger Menu Pages
      case 'ACCOUNT_SETTINGS': return (
        <div className="px-6 py-6 animate-in fade-in slide-in-from-right-4">
           <button onClick={() => navigateTo('HOME')} className="mb-6 flex items-center gap-2 text-pink-500 font-black"><ChevronLeft size={24}/> ย้อนกลับ</button>
           <div className="bg-white rounded-[40px] p-8 shadow-sm border border-pink-100 text-center space-y-6">
              <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto flex items-center justify-center text-pink-500">
                 <ShieldCheck size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800">{user?.user_metadata?.full_name || 'ชื่อ-นามสกุล'}</h3>
                <p className="text-pink-500 font-bold">รหัสนักศึกษา: {user?.user_metadata?.student_id || '66123456789'}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">คะแนนสะสมความประพฤติ</p>
                <div className="text-4xl font-black text-purple-600">1,250 <span className="text-sm">แต้ม</span></div>
              </div>
           </div>
        </div>
      );
      case 'PERSONAL_QR': return (
        <div className="px-6 py-6 text-center space-y-8 animate-in zoom-in-95">
           <button onClick={() => navigateTo('HOME')} className="flex items-center gap-2 text-pink-500 font-black"><ChevronLeft size={24}/> ย้อนกลับ</button>
           <h3 className="text-xl font-black text-purple-600">QR CODE สำหรับตรวจสอบ</h3>
           <div className="bg-white p-8 rounded-[50px] shadow-xl border-4 border-purple-200 inline-block">
              <div className="w-64 h-64 bg-gray-50 flex items-center justify-center rounded-3xl relative overflow-hidden">
                <QrCode size={200} className="text-purple-600 opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src="https://i.postimg.cc/jdQKYMRY/Logo-wangwai-removebg-preview.png" className="w-20 opacity-80" />
                </div>
              </div>
           </div>
           <p className="text-sm text-gray-500 font-bold px-8">ใช้สำหรับให้เจ้าหน้าที่สแกนตรวจสอบข้อมูล หากทำผิดกฎอาจถูกหักคะแนนสะสม</p>
        </div>
      );
      case 'POINTS_HISTORY': return (
        <div className="px-6 py-6 animate-in slide-in-from-bottom-4">
           <button onClick={() => navigateTo('HOME')} className="mb-6 flex items-center gap-2 text-pink-500 font-black"><ChevronLeft size={24}/> ย้อนกลับ</button>
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-purple-600">คะแนนสะสม</h3>
              <div className="bg-purple-100 px-4 py-2 rounded-2xl text-purple-600 font-black">1,250 pts</div>
           </div>
           <div className="space-y-4">
              {[
                { label: 'เข้าใช้งานตรงเวลา', points: '+50', date: 'วันนี้', color: 'text-green-500' },
                { label: 'รีวิวภาพยนตร์', points: '+20', date: 'เมื่อวาน', color: 'text-green-500' },
                { label: 'คืนอุปกรณ์ครบถ้วน', points: '+100', date: '2 วันที่แล้ว', color: 'text-green-500' },
                { label: 'ไม่คืนตามกำหนด', points: '-200', date: 'สัปดาห์ที่แล้ว', color: 'text-red-500' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 flex justify-between items-center">
                   <div>
                      <p className="font-black text-gray-700">{item.label}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{item.date}</p>
                   </div>
                   <span className={`text-lg font-black ${item.color}`}>{item.points}</span>
                </div>
              ))}
           </div>
           <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[35px] text-white">
              <p className="text-xs font-bold opacity-80 mb-2">แลกรับของรางวัล</p>
              <h4 className="text-xl font-black mb-4">สะสมครบ 2,000 แต้ม แลกรับป๊อปคอร์นฟรี!</h4>
              <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-2xl font-black text-sm hover:bg-white/30 transition-all">ดูของสะสมทั้งหมด</button>
           </div>
        </div>
      );
      case 'FAQ': return (
        <div className="px-6 py-6 animate-in fade-in">
           <button onClick={() => navigateTo('HOME')} className="mb-6 flex items-center gap-2 text-pink-500 font-black"><ChevronLeft size={24}/> ย้อนกลับ</button>
           <h3 className="text-2xl font-black text-pink-500 mb-6">คำถามที่พบบ่อย</h3>
           <div className="space-y-4">
              {[
                'จองห้องได้สูงสุดกี่ชั่วโมง?',
                'สามารถยกเลิกการจองได้ไหม?',
                'มีค่าบริการเพิ่มเติมหรือไม่?',
                'หากทำทรัพย์สินเสียหายต้องทำอย่างไร?'
              ].map((q, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border-2 border-pink-50 flex justify-between items-center group cursor-pointer hover:border-pink-200">
                  <span className="font-black text-gray-700">{q}</span>
                  <HelpCircle size={20} className="text-pink-300 group-hover:text-pink-500" />
                </div>
              ))}
           </div>
        </div>
      )
      default: return <Home onNavigate={navigateTo} />;
    }
  };

  const hideNav = ['LOGIN', 'SIGNUP', 'BOOKING_TIME', 'BOOKING_SEAT', 'BOOKING_DETAILS', 'QR_CODE', 'SUCCESS', 'ACCOUNT_SETTINGS', 'PERSONAL_QR', 'POINTS_HISTORY', 'FAQ'].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#F9F3FF] font-sans pb-safe relative">
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        user={user} 
        onNavigate={navigateTo} 
      />
      
      {!['LOGIN', 'SIGNUP'].includes(currentPage) && (
        <TopBar 
          onLogoClick={() => navigateTo('HOME')} 
          onOpenMenu={() => setIsMenuOpen(true)}
        />
      )}
      
      <main className={`w-full max-w-md mx-auto relative ${['LOGIN', 'SIGNUP'].includes(currentPage) ? 'pt-0' : 'pt-20'}`}>
        {renderContent()}
      </main>
      
      {!hideNav && <BottomNav activePage={currentPage} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
