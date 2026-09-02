import React, { useState, useEffect } from 'react';
import { Room, RoomType } from '../types';
import { ChevronLeft, ChevronRight, Info, Armchair, Users, Monitor, User } from 'lucide-react';

interface BookingSeatProps {
  room: Room;
  rooms: Room[];
  bookings: any[];
  selectedTimeSlot: string; // "10:30 น. - 12:30 น."
  onBack: () => void;
  onNext: (selectedSeats: string[]) => void;
}

const BookingSeat: React.FC<BookingSeatProps> = ({ room: initialRoom, rooms, bookings, selectedTimeSlot, onBack, onNext }) => {
  const [currentRoom, setCurrentRoom] = useState<Room>(initialRoom);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedSofaGroup, setSelectedSofaGroup] = useState<string | null>(null);
  const [activeSubRoom, setActiveSubRoom] = useState(1);

  useEffect(() => {
    setSelectedSeats([]);
    setSelectedSofaGroup(null);
  }, [currentRoom]);

  useEffect(() => {
    const updated = rooms.find(r => r.id === currentRoom.id);
    if (updated) setCurrentRoom(updated);
  }, [rooms]);

  // ฟังก์ชันตรวจสอบว่าที่นั่ง/กลุ่มนี้ ถูกจองไปแล้วหรือยัง
  const isSeatOccupied = (seatId: string) => {
    return bookings.some(b => 
      b.room_id === currentRoom.id && 
      b.status === 'Active' && 
      b.time_slot === selectedTimeSlot &&
      b.selected_seats?.includes(seatId)
    );
  };

  // ตรวจสอบว่ากลุ่มโซฟา (S1-S4) มีการจองที่นั่งใดที่นั่งหนึ่งไปแล้วหรือไม่
  const isSofaGroupOccupied = (groupId: string) => {
    return bookings.some(b => 
      b.room_id === currentRoom.id && 
      b.status === 'Active' && 
      b.time_slot === selectedTimeSlot &&
      b.selected_seats?.some((seat: string) => seat.startsWith(groupId))
    );
  };

  const handlePrevRoom = () => {
    const currentIndex = rooms.findIndex(r => r.id === currentRoom.id);
    const prevIndex = (currentIndex - 1 + rooms.length) % rooms.length;
    setCurrentRoom(rooms[prevIndex]);
  };

  const handleNextRoom = () => {
    const currentIndex = rooms.findIndex(r => r.id === currentRoom.id);
    const nextIndex = (currentIndex + 1) % rooms.length;
    setCurrentRoom(rooms[nextIndex]);
  };

  const toggleSeat = (seatId: string, forceOccupied: boolean = false) => {
    if (forceOccupied || isSeatOccupied(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (currentRoom.type === RoomType.INDIVIDUAL) {
        setSelectedSeats([seatId]);
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getMinSeatsRequired = () => {
    switch (currentRoom.type) {
      case RoomType.SOFA: return 3;
      case RoomType.THEATER: return 6;
      case RoomType.MEETING: return 4;
      default: return 1;
    }
  };

  const minRequired = getMinSeatsRequired();
  const canGoNext = selectedSeats.length >= minRequired;

  const RequirementWarning = () => {
    if (selectedSeats.length > 0 && selectedSeats.length < minRequired) {
      return (
        <p className="text-center text-sm text-pink-500 font-bold bg-pink-50 py-2 rounded-xl border border-pink-100 animate-pulse mt-4">
          * กรุณาเลือกที่นั่งอย่างน้อย {minRequired} ที่นั่ง
        </p>
      );
    }
    return null;
  };

  const renderIndividualLayout = () => (
    <div className="grid grid-cols-6 gap-x-2 gap-y-4 px-2">
      {Array.from({ length: 26 }).map((_, i) => {
        const id = `Seat-${i + 1}`;
        const isSelected = selectedSeats.includes(id);
        const isOccupied = isSeatOccupied(id);
        
        return (
          <button 
            key={id}
            disabled={isOccupied}
            onClick={() => toggleSeat(id)}
            className={`flex flex-col items-center transition-all ${isSelected ? 'scale-110' : ''} ${isOccupied ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`w-10 h-8 border-2 rounded-md flex items-center justify-center relative ${
                isOccupied ? 'bg-purple-500 border-purple-600 shadow-inner' :
                isSelected ? 'bg-pink-100 border-pink-500 shadow-sm' : 
                'bg-white border-black'
            }`}>
                {isOccupied ? (
                    <User size={16} className="text-white" />
                ) : (
                    <span className={`text-[11px] font-black ${isSelected ? 'text-pink-600' : 'text-black'}`}>{i + 1}</span>
                )}
            </div>
            <div className={`w-4 h-[3px] mt-[1px] rounded-sm ${isOccupied ? 'bg-purple-600' : isSelected ? 'bg-pink-500' : 'bg-black'}`}></div>
            <div className={`w-7 h-[3px] mt-[1px] rounded-full ${isOccupied ? 'bg-purple-600' : isSelected ? 'bg-pink-500' : 'bg-black'}`}></div>
          </button>
        );
      })}
    </div>
  );

  const renderSofaLayout = () => {
    const sofaGroups = [
      { id: 'S1', label: '1' },
      { id: 'S2', label: '2' },
      { id: 'S3', label: '3' },
      { id: 'S4', label: '4' },
    ];

    const SeatIcon: React.FC<{ num: number, isSelected: boolean, isOccupied: boolean, onClick: () => void }> = ({ num, isSelected, isOccupied, onClick }) => (
      <button 
        disabled={isOccupied}
        onClick={onClick}
        className={`relative flex flex-col items-center transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'} ${isOccupied ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="relative">
          <Armchair 
            size={42} 
            strokeWidth={2}
            className={isOccupied ? 'text-purple-600' : isSelected ? 'text-pink-500' : 'text-black'} 
            fill={isOccupied ? '#C084FC' : isSelected ? 'currentColor' : 'none'}
          />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
            <span className={`text-[10px] font-black ${isOccupied ? 'text-purple-600' : isSelected ? 'text-pink-600' : 'text-black'}`}>
              {num}
            </span>
          </div>
          {isOccupied && (
             <div className="absolute inset-0 flex items-center justify-center pt-1">
                 <User size={18} className="text-white" />
             </div>
          )}
        </div>
      </button>
    );

    return (
      <div className="w-full space-y-8">
        <div className="flex justify-between gap-3 px-1">
          {sofaGroups.map((group) => {
            const isSelected = selectedSofaGroup === group.id;
            const isOccupied = isSofaGroupOccupied(group.id);
            
            return (
              <div key={group.id} className="flex-1 flex flex-col items-center gap-2">
                <button 
                  disabled={isOccupied}
                  onClick={() => {
                    setSelectedSofaGroup(group.id);
                    setSelectedSeats([]);
                  }}
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all shadow-md relative ${
                    isOccupied 
                      ? 'bg-gradient-to-br from-[#D9A7FF] to-[#C084FC] text-white cursor-not-allowed ring-2 ring-purple-300' 
                      : isSelected 
                        ? 'bg-[#E9D5FF] border-2 border-pink-500 text-pink-500 shadow-pink-100' 
                        : 'bg-[#F3E8FF] text-black hover:bg-white hover:border-pink-200 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    {isOccupied ? (
                      <div className="flex flex-col items-center justify-center">
                         <div className="relative">
                            <Armchair size={32} fill="white" className="opacity-40" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <User size={20} fill="white" />
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Armchair size={32} strokeWidth={2.5} />
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                           <span className="text-[10px] font-black text-black">{group.label}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                {isSelected && <div className="w-10 h-1.5 bg-pink-500 rounded-full"></div>}
              </div>
            );
          })}
        </div>

        <div className={`bg-[#F9F5FF] rounded-[40px] p-8 min-h-[220px] shadow-inner relative transition-opacity duration-300 ${!selectedSofaGroup ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative w-full h-48">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-24 h-16 bg-black rounded-xl border-4 border-gray-700 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-transparent opacity-50"></div>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png" 
                        alt="Netflix" 
                        className="h-10 w-auto object-contain z-10"
                    />
                </div>
                <div className="w-10 h-1.5 bg-gray-800 mt-[1px]"></div>
                <div className="w-14 h-1.5 bg-gray-800 mt-[1px] rounded-full"></div>
             </div>

             <div className="absolute right-0 top-0 flex flex-col gap-6">
                {[5, 4].map(num => {
                  const seatId = `${selectedSofaGroup}-seat-${num}`;
                  return (
                    <SeatIcon 
                      key={num} 
                      num={num} 
                      isOccupied={isSeatOccupied(seatId)}
                      isSelected={selectedSeats.includes(seatId)} 
                      onClick={() => toggleSeat(seatId)} 
                    />
                  )
                })}
             </div>

             <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-8">
                {[1, 2, 3].map(num => {
                  const seatId = `${selectedSofaGroup}-seat-${num}`;
                  return (
                    <SeatIcon 
                      key={num} 
                      num={num} 
                      isOccupied={isSeatOccupied(seatId)}
                      isSelected={selectedSeats.includes(seatId)} 
                      onClick={() => toggleSeat(seatId)} 
                    />
                  )
                })}
             </div>
          </div>
        </div>
        <RequirementWarning />
      </div>
    );
  };

  const renderTheaterLayout = () => (
    <div className="w-full space-y-6">
      <div className="flex justify-center gap-4">
        {[1, 2].map(num => (
          <button 
            key={num}
            onClick={() => setActiveSubRoom(num)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[80px] transition-all border-b-4 ${
              activeSubRoom === num ? 'bg-pink-100 border-pink-500 shadow-sm' : 'bg-white border-transparent shadow-sm'
            }`}
          >
            <span className={`text-[10px] font-bold ${activeSubRoom === num ? 'text-pink-500' : 'text-gray-400'}`}>ห้อง {num}</span>
            <div className={`p-2 rounded-lg ${activeSubRoom === num ? 'bg-pink-500 text-white' : 'bg-black text-white'}`}>
              <Monitor size={20} />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-purple-100/30 rounded-2xl p-6 space-y-4 border border-purple-100/50">
        <div className="grid grid-cols-3 gap-y-4 gap-x-8 justify-items-center">
          {Array.from({ length: 12 }).map((_, i) => {
            const id = `T${activeSubRoom}-${i + 1}`;
            const isSelected = selectedSeats.includes(id);
            const isOccupied = isSeatOccupied(id);
            return (
              <button 
                key={id}
                disabled={isOccupied}
                onClick={() => toggleSeat(id)}
                className={`relative flex flex-col items-center transition-all ${isSelected ? 'scale-110' : ''} ${isOccupied ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Armchair 
                  size={28} 
                  className={isOccupied ? 'text-purple-600' : isSelected ? 'text-pink-500' : 'text-black'} 
                  strokeWidth={2.5}
                  fill={isOccupied ? '#C084FC' : isSelected ? 'currentColor' : 'none'} 
                />
                <span className="absolute -top-2 bg-white text-[9px] font-black px-1 rounded shadow-sm border border-gray-100">{i + 1}</span>
                {isOccupied && <User size={12} className="absolute inset-0 m-auto text-white mt-1" />}
              </button>
            );
          })}
        </div>
      </div>
      <RequirementWarning />
    </div>
  );

  const renderMeetingLayout = () => (
    <div className="w-full space-y-6">
      <div className="flex justify-center gap-4">
        {[1, 2].map(num => (
          <button 
            key={num}
            onClick={() => setActiveSubRoom(num)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[80px] transition-all border-b-4 ${
              activeSubRoom === num ? 'bg-pink-100 border-pink-500 shadow-sm' : 'bg-white border-transparent shadow-sm'
            }`}
          >
            <span className={`text-[10px] font-bold ${activeSubRoom === num ? 'text-pink-500' : 'text-gray-400'}`}>ห้อง {num}</span>
            <div className={`p-2 rounded-lg ${activeSubRoom === num ? 'bg-pink-500 text-white' : 'bg-black text-white'}`}>
              <Users size={20} />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-purple-100/30 rounded-3xl p-8 flex justify-center items-center gap-4 border border-purple-100/50">
         <div className="flex flex-col gap-4">
            {[1, 3, 5, 7].map(n => {
              const id = `M${activeSubRoom}-${n}`;
              const isSelected = selectedSeats.includes(id);
              const isOccupied = isSeatOccupied(id);
              return (
                <button key={n} disabled={isOccupied} onClick={() => toggleSeat(id)} className={`relative ${isOccupied ? 'opacity-40 cursor-not-allowed' : ''}`}>
                  <Armchair size={28} className={isOccupied ? 'text-purple-600' : isSelected ? 'text-pink-500' : 'text-black'} strokeWidth={2.5} fill={isOccupied ? '#C084FC' : isSelected ? 'currentColor' : 'none'} />
                  <span className="absolute -top-2 left-0 bg-white text-[9px] font-black px-1 rounded border border-gray-100">{n}</span>
                  {isOccupied && <User size={12} className="absolute inset-0 m-auto text-white mt-1" />}
                </button>
              );
            })}
         </div>

         <div className="w-16 h-48 bg-black rounded-full shadow-lg"></div>

         <div className="flex flex-col gap-4">
            {[2, 4, 6, 8].map(n => {
              const id = `M${activeSubRoom}-${n}`;
              const isSelected = selectedSeats.includes(id);
              const isOccupied = isSeatOccupied(id);
              return (
                <button key={n} disabled={isOccupied} onClick={() => toggleSeat(id)} className={`relative ${isOccupied ? 'opacity-40 cursor-not-allowed' : ''}`}>
                  <Armchair size={28} className={isOccupied ? 'text-purple-600' : isSelected ? 'text-pink-500' : 'text-black'} strokeWidth={2.5} fill={isOccupied ? '#C084FC' : isSelected ? 'currentColor' : 'none'} />
                  <span className="absolute -top-2 right-0 bg-white text-[9px] font-black px-1 rounded border border-gray-100">{n}</span>
                  {isOccupied && <User size={12} className="absolute inset-0 m-auto text-white mt-1" />}
                </button>
              );
            })}
         </div>
      </div>
      <RequirementWarning />
    </div>
  );

  const getTitle = () => {
    switch(currentRoom.type) {
        case RoomType.INDIVIDUAL: return 'รับชมแบบเดี่ยว';
        case RoomType.SOFA: return 'รับชมแบบกลุ่มโซฟา';
        case RoomType.THEATER: return 'ห้องเธียร์เตอร์';
        case RoomType.MEETING: return 'ห้องประชุม';
        default: return currentRoom.name;
    }
  };

  const renderContent = () => {
    switch(currentRoom.type) {
      case RoomType.INDIVIDUAL: return renderIndividualLayout();
      case RoomType.SOFA: return renderSofaLayout();
      case RoomType.THEATER: return renderTheaterLayout();
      case RoomType.MEETING: return renderMeetingLayout();
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[90vh] pb-24">
      <div className="px-4 pt-4 relative">
        <h2 className="text-center text-xl font-black text-[#E91E63] mb-4">{getTitle()}</h2>
        <div className="relative rounded-[40px] overflow-hidden border-[3px] border-pink-400 shadow-xl group">
           <img src={currentRoom.imageUrl} className="w-full h-56 object-cover" alt="Room View" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
           <button 
             onClick={handlePrevRoom}
             className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#E91E63] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
           >
             <ChevronLeft size={22} strokeWidth={3} />
           </button>
           <button 
             onClick={handleNextRoom}
             className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#E91E63] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
           >
             <ChevronRight size={22} strokeWidth={3} />
           </button>
           <button className="absolute top-4 right-4 bg-white/95 rounded-full w-8 h-8 flex items-center justify-center text-[#E91E63] shadow-md border border-pink-100">
             <div className="relative flex items-center justify-center">
                <Info size={22} strokeWidth={3} />
             </div>
           </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        <h3 className="text-[#E91E63] font-black text-xl mb-6">จองที่นั่ง</h3>
        <div className="w-full max-w-sm">
          {renderContent()}
        </div>

        <div className="w-full mt-auto space-y-3 pt-8">
          <button 
            onClick={() => canGoNext && onNext(selectedSeats)}
            disabled={!canGoNext}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 text-lg ${
              canGoNext ? 'bg-gradient-to-r from-[#D9A7FF] to-[#C084FC] hover:brightness-105' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            ถัดไป
          </button>
          <button 
            onClick={onBack}
            className="w-full py-4 rounded-2xl font-black text-[#C084FC] bg-white border-2 border-purple-100 hover:bg-purple-50 shadow-sm transition-all text-lg"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSeat;