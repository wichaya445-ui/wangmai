import React from 'react';
import { ScanLine } from 'lucide-react';

interface QRCodeScreenProps {
  onNext: () => void;
}

const QRCodeScreen: React.FC<QRCodeScreenProps> = ({ onNext }) => {
  // Simulate auto-redirect after scan (or click for demo)
  return (
    <div className="px-6 py-8 flex flex-col items-center h-full text-center pb-24">
       
       <div className="mt-8 space-y-2">
           <h3 className="text-pink-500 font-bold">กรุณานำ QR Code สแกน</h3>
           <p className="text-pink-500 text-xs px-4">
               ที่เคาน์เตอร์บริการเพื่อยืนยันสิทธิ์ <span className="font-bold">ภายใน 10 นาที</span> <br/>
               หลังจากสแกนแล้ว เจ้าหน้าที่จะทำการอนุมัติ
           </p>
       </div>

       <div className="mt-8 bg-white p-4 rounded-3xl shadow-lg border-4 border-pink-200" onClick={onNext}>
            {/* Simulated QR Code */}
            <div className="w-64 h-64 bg-white relative flex flex-wrap content-center justify-center p-2">
                 <div className="absolute inset-0 border-8 border-pink-500 rounded-3xl"></div>
                 {/* Inner squares */}
                 <div className="absolute top-4 left-4 w-16 h-16 border-4 border-pink-500 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-pink-500 rounded-md"></div>
                 </div>
                 <div className="absolute top-4 right-4 w-16 h-16 border-4 border-pink-500 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-pink-500 rounded-md"></div>
                 </div>
                 <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-purple-500 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-md"></div>
                 </div>
                 
                 {/* Center Logo */}
                 <div className="z-10 bg-white px-2 py-1 rounded-full border border-pink-100">
                    <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ fontFamily: 'cursive' }}>
                        WANG
                    </span>
                 </div>
                 
                 {/* Random data blocks */}
                 <div className="absolute bottom-4 right-4 w-16 h-16 flex flex-wrap gap-1 content-center justify-center">
                     <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                     <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                     <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                     <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                 </div>
            </div>
       </div>

       <div className="mt-12">
            <p className="text-pink-300 text-xs mb-4">รองรับการจองดูภาพยนตร์ผ่านแอป</p>
            <div className="w-20 h-32 bg-gradient-to-b from-pink-500 to-pink-300 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-pink-200">
                 <ScanLine size={40} className="text-white animate-pulse" />
            </div>
       </div>
    </div>
  );
};

export default QRCodeScreen;