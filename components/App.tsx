
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
import Login from './components/Login';
import Signup from './components/Signup';
import { Page, Room } from '../types';
import { supabase } from '../lib/supabase';
import { MOCK_ROOMS } from '../constants';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showLanding, setShowLanding] = useState<boolean>(true);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser && (currentPage === 'LOGIN' || currentPage === 'SIGNUP')) {
        setCurrentPage('HOME');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentPage]);

  const mapRoomData = (dbData: any): Room => ({
    id: dbData.id,
    name: dbData.name,
    type: dbData.type,
    capacity: dbData.capacity,
    totalSeats: dbData.total_seats,
    availableSeats: dbData.available_seats,
    imageUrl: dbData.image_url,
    tags: Array.isArray(dbData.tags) ? dbData.tags : [],
    facilities: Array.isArray(dbData.facilities) ? dbData.facilities : []
  });

  const fetchData = async () => {
    try {
        const { data: roomsData } = await supabase.from('rooms').select('*').order('name');
        if (roomsData) setRooms(roomsData.map(mapRoomData));

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
    fetchData();
    const channel = supabase
      .channel('db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // รีเฟรชข้อมูลเมื่อ user เปลี่ยน

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
            user_id: user.id, // ต้องใส่ user_id เพื่อให้ RLS ทำงานถูกต้อง
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
      default: return <Home onNavigate={navigateTo} />;
    }
  };

  const hideNav = ['LOGIN', 'SIGNUP', 'BOOKING_TIME', 'BOOKING_SEAT', 'BOOKING_DETAILS', 'QR_CODE', 'SUCCESS'].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#F9F3FF] font-sans pb-safe relative">
      {!['LOGIN', 'SIGNUP'].includes(currentPage) && <TopBar onLogoClick={() => navigateTo('HOME')} />}
      <main className={`w-full max-w-md mx-auto relative ${['LOGIN', 'SIGNUP'].includes(currentPage) ? 'pt-0' : 'pt-20'}`}>
        {renderContent()}
      </main>
      {!hideNav && <BottomNav activePage={currentPage} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
