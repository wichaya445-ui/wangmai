import React, { useState, useEffect } from 'react';
import { Room, MediaOption, Booking } from '../types';
import { X, Calendar, Clock, Disc, MonitorPlay, Info } from 'lucide-react';
import { STREAMING_PLATFORMS, CD_LIBRARY } from '../constants';

interface BookingModalProps {
  room: Room;
  onClose: () => void;
  onConfirm: (bookingData: Partial<Booking>) => void;
  existingBookings: Booking[];
}

const BookingModal: React.FC<BookingModalProps> = ({ room, onClose, onConfirm, existingBookings }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(60); // minutes
  const [mediaType, setMediaType] = useState<'Streaming' | 'CD'>('Streaming');
  const [selectedMediaId, setSelectedMediaId] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Generate available time slots (simple implementation)
  // In a real app, this would check against existingBookings for the selected date
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8:00 AM
    const endHour = 20; // 8:00 PM
    
    for (let h = startHour; h < endHour; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Helper to check overlap
  const checkAvailability = (start: Date, end: Date) => {
    const overlap = existingBookings.some(b => {
      if (b.roomId !== room.id || b.status !== 'Active') return false;
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      return (start < bEnd && end > bStart);
    });
    return !overlap;
  };

  const handleSubmit = () => {
    setError('');
    
    if (!startTime || !selectedMediaId) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    if (endDateTime <= startDateTime) {
        setError('เวลาสิ้นสุดไม่ถูกต้อง');
        return;
    }

    // Basic Validation: Check if time is in past
    if (startDateTime < new Date()) {
        setError('ไม่สามารถจองเวลาย้อนหลังได้');
        return;
    }

    // Check Availability
    if (!checkAvailability(startDateTime, endDateTime)) {
        setError('ช่วงเวลานี้มีการจองแล้ว กรุณาเลือกเวลาอื่น');
        return;
    }

    onConfirm({
      roomId: room.id,
      startTime: startDateTime,
      endTime: endDateTime,
      mediaId: selectedMediaId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">จองห้อง {room.name}</h2>
            <p className="text-sm text-gray-500">จำกัดเวลาใช้งานสูงสุด 2 ชม. 30 นาที</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Date & Time Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} /> วันและเวลา
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">วันที่</label>
                <input 
                  type="date" 
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">เวลาเริ่ม</label>
                <select 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">เลือกเวลา</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">ระยะเวลาใช้งาน</label>
              <div className="flex gap-2">
                {[60, 90, 120, 150].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm border font-medium transition-all ${
                      duration === mins 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {Math.floor(mins / 60)} ชม. {mins % 60 > 0 ? `${mins % 60} น.` : ''}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Info size={12} /> สูงสุด 2 ชั่วโมง 30 นาที (150 นาที)
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Media Section */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <MonitorPlay size={16} /> สื่อความบันเทิง
            </h3>

            <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mediaType === 'Streaming' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setMediaType('Streaming'); setSelectedMediaId(''); }}
              >
                Streaming
              </button>
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mediaType === 'CD' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setMediaType('CD'); setSelectedMediaId(''); }}
              >
                CD/DVD
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mediaType === 'Streaming' ? (
                STREAMING_PLATFORMS.map((platform) => (
                  <div 
                    key={platform.id}
                    onClick={() => setSelectedMediaId(platform.id)}
                    className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${
                      selectedMediaId === platform.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        {platform.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                  </div>
                ))
              ) : (
                CD_LIBRARY.map((cd) => (
                  <div 
                    key={cd.id}
                    onClick={() => setSelectedMediaId(cd.id)}
                    className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${
                      selectedMediaId === cd.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                     <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Disc size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 line-clamp-1">{cd.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                <Info size={16} /> {error}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
          >
            ยืนยันการจอง
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingModal;