import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [step, setStep] = useState('landing'); 
  const [visitedCount, setVisitedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [nickname, setNickname] = useState('');

  // الرابط الخاص بك (Mouzaia Delivery)
  const myAdUrl = "https://t.me/MouzaiaDelivery";

  const startTask = () => {
    window.open(myAdUrl, '_blank');
    setIsAdActive(true);
    setTimer(10); // 10 ثواني انتظار
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500">
      <Head>
        <title>Chat Traffic DZ | تبادل الزيارات في الجزائر</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* 1. الواجهة الاحترافية (Landing Page) */}
      {step === 'landing' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">مباشر من موزاية إلى كل الجزائر</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            CHAT <span className="text-blue-600">TRAFFIC</span> DZ
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
            المنصة الأولى لتبادل الزيارات الحقيقية والدردشة بين المستثمرين وأصحاب المشاريع. 
            <span className="text-white font-bold"> ابدأ الآن واصنع جمهورك مجاناً.</span>
          </p>

          <button 
            onClick={() => setStep('task')}
            className="group relative px-12 py-5 bg-blue-600 rounded-2xl font-black text-2xl hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] overflow-hidden"
          >
            <span className="relative z-10">دخول المنصة 🚀</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
        </div>
      )}

      {/* 2. نظام التحقق (الـ 4 زيارات لرابط موزاية ديليفري) */}
      {step === 'task' && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-700 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-center text-blue-400">دعم قنوات المجتمع</h2>
            <p className="text-slate-400 text-center mb-8 text-sm">يجب زيارة الرابط 4 مرات لتفعيل حسابك</p>

            <div className="space-y-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className={`relative p-4 rounded-2xl border transition-all ${visitedCount >= num ? 'bg-green-500/10 border-green-500/50' : 'bg-slate-900 border-slate-700'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${visitedCount >= num ? 'text-green-500' : 'text-slate-500'}`}>
                      {visitedCount >= num ? '✅ تمت الزيارة' : `المهمة رقم ${num}`}
                    </span>
                    {visitedCount === num - 1 && (
                      <button 
                        disabled={isAdActive}
                        onClick={startTask}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-black transition-all disabled:opacity-50"
                      >
                        {isAdActive ? `انتظر ${timer}ث` : 'زيارة الآن'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visitedCount >= 4 && (
              <div className="mt-8 space-y-4 animate-bounce-in">
                <input 
                  type="text" 
                  placeholder="اختر اسمك المستعار..."
                  className="w-full p-4 rounded-xl bg-[#0f172a] border border-blue-500/50 outline-none focus:ring-2 ring-blue-500 text-center font-bold"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <button className="w-full bg-green-600 py-4 rounded-xl font-black text-xl hover:bg-green-500 shadow-lg transition-all">
                  دخول الدردشة 💬
                </button>
              </div>
            )}
            
            <button onClick={() => setStep('landing')} className="w-full mt-6 text-slate-600 text-[10px] hover:text-slate-400 transition-colors uppercase tracking-widest">
              العودة للرئيسية
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
