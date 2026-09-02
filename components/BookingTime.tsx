
import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Timer, LogOut, CalendarDays } from 'lucide-react';

interface BookingTimeProps {
  onBack: () => void;
  onNext: (time: string, duration: number, endTime: string) => void;
}

const START_TIMES = [
  "10:30 น.",
  "11:00 น.",
  "11:30 น.",
  "12:00 น.",
  "12:30 น.",
  "13:00 น.",
  "13:30 น.",
  "14:00 น.",
  "14:30 น.",
  "15:00 น.",
  "15:30 น.",
  "16:00 น."
];

const DURATIONS = [60, 90, 120, 150];

const BookingTime: React.FC<BookingTimeProps> = ({ onBack, onNext }) => {
  const [startTime, setStartTime] = useState(START_TIMES[0]);
  const [duration, setDuration] = useState(120);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [endTime, setEndTime] = useState('');

  // ฟอร์แมตวันที่ปัจจุบันเป็นภาษาไทย
  const formattedDate = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // คำนวณเวลาสิ้นสุด
    const [hours, minutes] = startTime.replace(' น.', '').split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + duration);
    
    const endH = date.getHours().toString().padStart(2, '0');
    const endM = date.getMinutes().toString().padStart(2, '0');
    setEndTime(`${endH}:${endM} น.`);
  }, [startTime, duration]);

  return (
    <div className="px-6 py-6 flex flex-col h-full min-h-[85vh]">
      <h2 className="text-pink-600 font-black text-xl mb-2 text-center uppercase tracking-tight">เลือกเวลาเข้าชม</h2>
      
      {/* แสดงวันที่ปัจจุบัน */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-50 rounded-full border border-pink-100 shadow-sm">
          <CalendarDays size={14} className="text-pink-500" />
          <span className="text-pink-600 font-bold text-xs">{formattedDate}</span>
        </div>
      </div>

      <div className="flex-1 space-y-10">
        {/* Start Time Dropdown */}
        <div className="relative">
             <div className="flex items-center gap-2 mb-3">
                <Clock className="text-pink-500" size={18} />
                <span className="text-gray-500 font-bold text-sm uppercase">เวลาที่ต้องการเข้าชม</span>
             </div>
             <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full border-2 border-pink-400 rounded-2xl p-5 flex justify-between items-center bg-white shadow-sm cursor-pointer hover:border-pink-500 transition-colors"
             >
                <span className="text-gray-800 font-black text-lg">{startTime}</span>
                <ChevronDown className={`text-pink-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
             </div>
             
             {isDropdownOpen && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2">
                     <div className="max-h-60 overflow-y-auto">
                        {START_TIMES.map((time) => (
                            <div 
                                key={time}
                                onClick={() => { setStartTime(time); setIsDropdownOpen(false); }}
                                className={`p-4 hover:bg-pink-50 cursor-pointer text-gray-700 font-bold border-b border-pink-50 last:border-0 ${startTime === time ? 'bg-pink-50 text-pink-600' : ''}`}
                            >
                                {time}
                            </div>
                        ))}
                     </div>
                 </div>
             )}
        </div>

        {/* Duration Selection */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
                <Timer className="text-pink-500" size={18} />
                <span className="text-gray-500 font-bold text-sm uppercase">ระยะเวลาที่ชม</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {DURATIONS.map((mins) => (
                    <button
                        key={mins}
                        onClick={() => setDuration(mins)}
                        className={`py-4 rounded-2xl font-black text-sm transition-all border-2 shadow-sm ${
                            duration === mins 
                            ? 'bg-pink-500 border-pink-500 text-white scale-105' 
                            : 'bg-white border-pink-100 text-gray-600 hover:border-pink-300'
                        }`}
                    >
                        {Math.floor(mins / 60)} ชม. {mins % 60 > 0 ? `${mins % 60} น.` : ''}
                    </button>
                ))}
            </div>
        </div>

        {/* End Time Display */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-[30px] border-2 border-dashed border-pink-200">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-pink-500 p-2 rounded-xl text-white">
                        <LogOut size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-pink-400 font-black uppercase tracking-widest">เวลาสิ้นสุด</p>
                        <p className="text-gray-800 font-black text-xl">{endTime}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">สรุป</p>
                    <p className="text-gray-600 font-bold text-xs">{startTime} - {endTime}</p>
                </div>
             </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full mt-auto space-y-3 pt-8 pb-20">
            <button 
                onClick={() => onNext(startTime, duration, endTime)}
                className="w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 text-lg bg-gradient-to-r from-pink-400 to-purple-500 hover:brightness-105 shadow-pink-100"
            >
                ถัดไป: เลือกที่นั่ง
            </button>
            <button 
                onClick={onBack}
                className="w-full py-4 rounded-2xl font-black text-purple-400 bg-white border-2 border-purple-100 hover:bg-purple-50 shadow-sm transition-all active:scale-95 text-lg"
            >
                ย้อนกลับ
            </button>
        </div>
    </div>
  );
};

export default BookingTime;
