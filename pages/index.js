import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [step, setStep] = useState('landing'); 
  const [visitedCount, setVisitedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [nickname, setNickname] = useState('');

  // رابط قناتك الأساسي
  const myAdUrl = "https://t.me/MouzaiaDelivery";

  const startTask = () => {
    window.open(myAdUrl, '_blank');
    setIsAdActive(true);
    setTimer(10); // عداد 10 ثواني
  };

  useEffect(() => {
    let interval;
    if (isAdActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (isAdActive && timer === 0) {
      setIsAdActive(false);
      setVisitedCount(prev => prev + 1);
    }
    return () => clearInterval(interval);
  }, [isAdActive, timer]);

  const handleFinalEntry = () => {
    if (nickname.trim().length < 3) {
      alert("يرجى إدخال اسم مستعار صحيح (3 أحرف على الأقل)");
      return;
    }
    localStorage.setItem('chat_nick', nickname);
    // التوجيه لصفحة الدردشة
    window.location.href = "/chat";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500 selection:text-white">
      <Head>
        <title>Chat Traffic DZ | منصة تبادل الزيارات</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* --- 1. الواجهة الرئيسية --- */}
      {step === 'landing' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-700">
          <div className="mb-6 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">MisterAI Project - Mouzaia</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            CHAT <span className="text-blue-600">TRAFFIC</span> DZ
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
            نظام تبادل الزيارات الأول في الجزائر. دردش مع المحترفين، روّج لروابطك، واصنع جمهورك الآن.
          </p>

          <button 
            onClick={() => setStep('task')}
            className="group relative px-16 py-6 bg-blue-600 rounded-2xl font-black text-2xl hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0"
          >
            دخول المنصة 🚀
          </button>
        </div>
      )}

      {/* --- 2. نظام المهام --- */}
      {step === 'task' && (
        <div className="flex items-center justify-center min-h-screen p-4 animate-in zoom-in duration-500">
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-700">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${(visitedCount / 4) * 100}%` }}
              ></div>
            </div>

            <h2 className="text-3xl font-black mb-2 text-center text-white">تحقق الأمان</h2>
            <p className="text-slate-400 text-center mb-8 text-sm font-medium">زر الرابط 4 مرات لفتح نظام الدردشة</p>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className={`p-4 rounded-2xl border transition-all duration-300 ${visitedCount >= num ? 'bg-green-500/10 border-green-500/40' : 'bg-[#0f172a] border-slate-700'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${visitedCount >= num ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        {num}
                      </span>
                      <span className={`font-bold text-sm ${visitedCount >= num ? 'text-green-400' : 'text-slate-400'}`}>
                        {visitedCount >= num ? 'اكتملت المهمة' : 'رابط Mouzaia Delivery'}
                      </span>
                    </div>
                    {visitedCount === num - 1 && (
                      <button 
                        disabled={isAdActive}
                        onClick={startTask}
                        className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl text-xs font-black shadow-lg disabled:opacity-50 transition-all active:scale-95"
                      >
                        {isAdActive ? `${timer}ث` : 'زيارة'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visitedCount >= 4 && (
              <div className="mt-8 space-y-4 animate-in slide-in-from-bottom duration-500">
                <input 
                  type="text" 
                  placeholder="اسمك في الدردشة..."
                  className="w-full p-5 rounded-2xl bg-[#0f172a] border-2 border-blue-500/30 outline-none focus:border-blue-500 text-center font-bold text-lg transition-all"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <button 
                  onClick={handleFinalEntry}
                  className="w-full bg-green-600 py-5 rounded-2xl font-black text-xl hover:bg-green-500 shadow-[0_10px_30px_rgba(22,163,74,0.3)] transition-all active:scale-95"
                >
                  فتح الدردشة الآن 💬
                </button>
              </div>
            )}
            
            <button onClick={() => setStep('landing')} className="w-full mt-6 text-slate-600 text-[10px] font-bold hover:text-slate-400 transition-colors uppercase tracking-[0.3em]">
              ← العودة للخلف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
