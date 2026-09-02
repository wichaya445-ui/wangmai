
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import { Mail, Lock, User, IdCard, UserPlus, ArrowLeft, Info } from 'lucide-react';

interface SignupProps {
  onNavigate: (page: Page) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบรหัสนักศึกษา
    if (studentId.length !== 11) {
      setError("รหัสนักศึกษาต้องมี 11 หลัก");
      return;
    }
    
    // ตรวจสอบว่าเป็นอีเมล SSRU หรือไม่
    if (!email.toLowerCase().endsWith('@ssru.ac.th')) {
      setError("กรุณาใช้อีเมลมหาวิทยาลัย (@ssru.ac.th) เท่านั้น");
      return;
    }
    
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_id: studentId
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      alert("สมัครสมาชิกสำเร็จ! 🎉\n\nสำคัญมาก: ระบบได้ส่งลิงก์ยืนยันตัวตนไปที่อีเมลของคุณแล้ว กรุณากดตรวจสอบและยืนยันในอีเมล (หากไม่พบโปรดเช็คใน 'อีเมลขยะ' หรือ Junk Mail) ก่อนทำการเข้าสู่ระบบครั้งแรก");
      onNavigate('LOGIN');
    }
    setLoading(false);
  };

  const handleStudentIdChange = (val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 11);
    setStudentId(numeric);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#F9F3FF] to-white py-12">
      <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <button onClick={() => onNavigate('LOGIN')} className="flex items-center gap-2 text-pink-500 font-bold mb-4">
          <ArrowLeft size={20} /> กลับไปหน้าล็อกอิน
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-pink-500">สมัครสมาชิก</h2>
          <p className="text-gray-500 font-medium">ร่วมเป็นส่วนหนึ่งของ Wangmai</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input 
              type="text"
              placeholder="ชื่อ-นามสกุล"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
              required
            />
          </div>

          <div className="relative">
            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input 
              type="text"
              placeholder="รหัสนักศึกษา 11 หลัก"
              value={studentId}
              onChange={(e) => handleStudentIdChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input 
              type="email"
              placeholder="อีเมล (ต้องเป็น @ssru.ac.th เท่านั้น)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input 
              type="password"
              placeholder="รหัสผ่าน (6 ตัวขึ้นไป)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "กำลังลงทะเบียน..." : "สมัครสมาชิก"}
              <UserPlus size={20} />
            </button>
            
            {/* คำแนะนำเรื่องอีเมล */}
            <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 items-start">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                <span className="text-blue-800">คำแนะนำ:</span> หลังกดสมัครสมาชิก กรุณาตรวจสอบอีเมล @ssru.ac.th ของคุณเพื่อกดลิงก์ยืนยันตัวตน หากไม่ยืนยันจะไม่สามารถเข้าสู่ระบบได้
              </p>
            </div>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-gray-400 font-bold text-xs">
            เป็นสมาชิกอยู่แล้ว? 
            <button 
              onClick={() => onNavigate('LOGIN')}
              className="ml-2 text-pink-400 hover:underline"
            >
              เข้าสู่ระบบที่นี่
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
