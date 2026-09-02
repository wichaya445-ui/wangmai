import React, { useState } from 'react';
import { AlertCircle, UserCircle } from 'lucide-react';

interface BookingDetailsProps {
  seats: string[];
  onBack: () => void;
  onConfirm: (studentIds: string[]) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ seats, onBack, onConfirm }) => {
  const [studentIds, setStudentIds] = useState<string[]>(new Array(seats.length).fill(''));

  const handleSubmit = () => {
    if (isAllComplete) {
        onConfirm(studentIds);
    }
  };

  const handleIdChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, ''); 
    if (numericValue.length <= 11) {
      const newIds = [...studentIds];
      newIds[index] = numericValue;
      setStudentIds(newIds);
    }
  };

  const isAllComplete = studentIds.every(id => id.length === 11);

  return (
    <div className="px-6 py-6 flex flex-col h-full min-h-[85vh]">
      <h2 className="text-pink-600 font-black text-xl mb-8 text-center uppercase tracking-tight">ข้อมูลผู้เข้าชม</h2>

      <div className="flex-1 space-y-6">
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <UserCircle className="text-pink-500" size={20} />
                <h4 className="text-pink-600 font-black text-sm uppercase">กรุณากรอกรหัสนักศึกษา (11 หลัก)</h4>
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-6 scrollbar-hide">
                {studentIds.map((id, index) => (
                    <div key={index} className="relative">
                        <div className="flex justify-between items-center mb-1.5 px-1">
                            <label className="text-gray-500 font-bold text-xs">นักศึกษาคนที่ {index + 1} ({seats[index]})</label>
                            <span className={`text-[10px] font-black ${id.length === 11 ? 'text-green-500' : 'text-gray-400'}`}>
                                {id.length}/11
                            </span>
                        </div>
                        <input 
                            type="text" 
                            inputMode="numeric"
                            value={id}
                            onChange={(e) => handleIdChange(index, e.target.value)}
                            maxLength={11}
                            placeholder="กรอกรหัส 11 หลัก"
                            className={`w-full border-2 rounded-2xl p-4 text-gray-700 font-bold focus:outline-none transition-all bg-white shadow-sm ${id.length === 11 ? 'border-green-400 bg-green-50/10' : 'border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100'}`}
                        />
                        {id.length > 0 && id.length < 11 && (
                            <div className="absolute -bottom-5 left-1 flex items-center gap-1 text-pink-400">
                                <AlertCircle size={10} />
                                <span className="text-[9px] font-bold">ต้องกรอกให้ครบ 11 หลัก</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="w-full mt-auto space-y-3 pt-8 pb-20">
            <button 
                onClick={handleSubmit}
                disabled={!isAllComplete}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 text-lg ${isAllComplete ? 'bg-gradient-to-r from-pink-400 to-purple-500 hover:brightness-105 shadow-pink-100' : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
            >
                {isAllComplete ? 'ยืนยันการจอง' : `กรุณากรอกรหัสให้ครบ ${seats.length} คน`}
            </button>
            <button 
                onClick={onBack}
                className="w-full py-4 rounded-2xl font-black text-purple-400 bg-white border-2 border-purple-100 hover:bg-purple-50 shadow-sm transition-all active:scale-95 text-lg"
            >
                ย้อนกลับ
            </button>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
    </div>
  );
};

export default BookingDetails;
