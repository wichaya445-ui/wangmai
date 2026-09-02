
import React, { useMemo } from 'react';
import { Room, RoomType, Booking } from '../types';
import { Users, Tv, Armchair, Clock, CheckCircle } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  bookings: Booking[];
  onBook: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, bookings, onBook }) => {
  const now = new Date();

  // Check current status
  const currentBooking = useMemo(() => {
    return bookings.find(
      (b) => 
        b.roomId === room.id &&
        b.status === 'Active' &&
        now >= b.startTime &&
        now < b.endTime
    );
  }, [bookings, room.id, now]);

  const nextBooking = useMemo(() => {
    // Find the next booking that hasn't started yet
    const upcoming = bookings
      .filter((b) => b.roomId === room.id && b.status === 'Active' && b.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [bookings, room.id, now]);

  const statusColor = currentBooking ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  const statusText = currentBooking ? 'ไม่ว่าง' : 'ว่าง';

  const getTypeLabel = (type: RoomType) => {
    switch(type) {
      case RoomType.THEATER: return 'ห้องเธียร์เตอร์ (6+ คน)';
      case RoomType.SOFA: return 'ห้องกลุ่ม (3-5 คน)';
      case RoomType.MEETING: return 'ห้องประชุม (4-8 คน)';
      case RoomType.INDIVIDUAL: return 'ที่นั่งเดี่ยว';
      default: return 'ทั่วไป';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-slate-100 flex flex-col h-full">
      <div className="relative h-40 bg-gray-200">
        <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${statusColor}`}>
            {currentBooking ? <Clock size={12} /> : <CheckCircle size={12} />}
            {statusText}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
           <span className="text-white text-xs font-medium bg-blue-600/90 px-2 py-0.5 rounded">
             {getTypeLabel(room.type)}
           </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{room.name}</h3>
        
        <div className="flex items-center text-slate-500 text-sm mb-3">
          <Users size={16} className="mr-1.5" />
          <span>รองรับ {room.capacity} คน</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {room.facilities.slice(0, 3).map((fac, idx) => (
            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
              {fac}
            </span>
          ))}
          {room.facilities.length > 3 && (
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
              +{room.facilities.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100">
            {currentBooking ? (
                <div className="mb-3 text-xs text-red-600 font-medium flex items-center">
                    <Clock size={14} className="mr-1" />
                    ว่างเวลา: {currentBooking.endTime.toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                </div>
            ) : nextBooking ? (
                 <div className="mb-3 text-xs text-orange-600 font-medium flex items-center">
                    <Clock size={14} className="mr-1" />
                    จองถัดไป: {nextBooking.startTime.toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                </div>
            ) : (
                <div className="mb-3 text-xs text-green-600 font-medium flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    ว่างตลอดช่วงนี้
                </div>
            )}

            <button 
                onClick={() => onBook(room)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
                จองห้องนี้
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
