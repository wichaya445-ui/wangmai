import React from 'react';
import { Room, RoomType } from '../types';
import { Plus } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  bookings: any[];
  onSelectRoom: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, bookings, onSelectRoom }) => {
  
  // ฟังก์ชันคำนวณเวลาที่ว่างจริง
  const getAvailableSlots = (room: Room) => {
    if (!room.tags || room.tags.length === 0) {
        return room.type === RoomType.INDIVIDUAL ? ["ทุกเวลา"] : [];
    }
    
    if (room.tags.includes("ทุกเวลา")) return ["ทุกเวลา"];
    
    const roomBookings = bookings.filter(b => b.room_id === room.id && b.status === 'Active');
    
    if (room.type === RoomType.INDIVIDUAL) return room.tags;

    return room.tags.filter(tag => {
      const isTaken = roomBookings.some(b => b.time_slot.includes(tag));
      return !isTaken;
    });
  };

  return (
    <div className="px-6 pb-32 pt-2 space-y-6">
      <h3 className="text-slate-800 font-black text-xl mb-4">ตรวจสอบห้องว่าง</h3>
      
      <div className="space-y-4">
        {rooms.map((room) => {
          const availableSlots = getAvailableSlots(room);
          
          const isRoomFullBySeats = room.availableSeats <= 0;
          const isRoomFullByTime = room.type !== RoomType.INDIVIDUAL && availableSlots.length === 0;
          const isFull = isRoomFullBySeats || isRoomFullByTime;
          
          return (
            <div 
              key={room.id} 
              className="bg-white/95 rounded-[24px] shadow-sm border border-white/50 flex gap-4 p-3 h-36 relative overflow-hidden transition-all hover:shadow-md"
            >
              {/* Left Image */}
              <div className="w-32 h-full rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-inner bg-gray-50 sm:w-36">
                <img 
                  src={room.imageUrl} 
                  alt={room.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Room";
                  }}
                />
              </div>
              
              {/* Right Content */}
              <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                <div className="overflow-hidden">
                    <h4 className="text-lg font-black text-pink-500 leading-tight truncate">{room.name}</h4>
                    <p className="text-[11px] text-gray-500 font-bold mb-1">รับชมได้ {room.capacity}</p>
                    
                    {/* Time Pills */}
                    <div className="flex flex-wrap gap-1 min-h-[20px]">
                        {availableSlots.length > 0 && !isRoomFullBySeats ? (
                          availableSlots.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full border border-pink-100 text-[9px] font-black text-pink-500 bg-white shadow-sm whitespace-nowrap">
                                {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-red-400 font-black italic flex items-center gap-1">
                             เต็มทุกช่วงเวลา
                          </span>
                        )}
                        {availableSlots.length > 2 && !isRoomFullBySeats && (
                           <span className="text-[9px] text-gray-400 font-bold self-center">+{availableSlots.length - 2}</span>
                        )}
                    </div>
                </div>

                {/* Bottom Info & Action - แก้ไขการจัดวางตรงนี้ */}
                <div className="flex justify-end items-center gap-2 mt-auto">
                    <div className="flex flex-col items-end leading-none">
                        <span className={`text-sm font-black transition-colors duration-300 ${isFull ? 'text-red-500' : 'text-purple-600'}`}>
                             {room.availableSeats} ว่าง
                        </span>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">จาก {room.totalSeats}</p>
                    </div>
                    
                    <button 
                        disabled={isFull}
                        onClick={() => onSelectRoom(room)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90 flex-shrink-0 ${isFull ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#E91E63] hover:bg-pink-600 active:shadow-inner'}`}
                    >
                        <Plus size={24} strokeWidth={3} />
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomList;