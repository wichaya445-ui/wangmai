
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: Page) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#F9F3FF] to-white">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-2">
          <img 
            src="https://i.postimg.cc/jdQKYMRY/Logo-wangwai-removebg-preview.png" 
            alt="Logo" 
            className="h-24 mx-auto object-contain mb-4"
          />
          <h2 className="text-3xl font-black text-pink-500">เข้าสู่ระบบ</h2>
          <p className="text-gray-500 font-medium">เพื่อเริ่มต้นการจองห้องชมภาพยนตร์</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input 
              type="email"
              placeholder="อีเมลนักศึกษา"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-bold text-gray-700"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input 
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-bold text-gray-700"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            <LogIn size={20} />
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-gray-500 font-bold text-sm">
            ยังไม่มีบัญชี? 
            <button 
              onClick={() => onNavigate('SIGNUP')}
              className="ml-2 text-pink-500 hover:underline"
            >
              สมัครสมาชิกที่นี่
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
