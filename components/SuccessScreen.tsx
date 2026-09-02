import React from 'react';

interface SuccessScreenProps {
  onHome: () => void;
  bookingTime: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onHome, bookingTime }) => {
  return (
    <div className="px-6 flex flex-col items-center justify-center h-[80vh] text-center">
       
       <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
           ยืนยันสิทธิ์เสร็จสิ้น
       </h2>
       
       <p className="text-pink-500 text-sm leading-relaxed mb-12">
           โปรดมารับชมภาพยนตร์ก่อนสิ้นสุดในเวลา {bookingTime} <br/>
           ขอให้เพลิดเพลินกับการรับชมภาพยนตร์!
       </p>

       <button 
            onClick={onHome}
            className="w-full max-w-xs py-3 rounded-2xl font-bold text-white shadow-md bg-[#D9A7FF] hover:bg-[#C084FC] transition-all"
        >
            เสร็จสิ้น
        </button>

    </div>
  );
};

export default SuccessScreen;