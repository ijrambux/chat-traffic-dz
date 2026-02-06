import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [step, setStep] = useState('landing'); 
  const [visitedCount, setVisitedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [nickname, setNickname] = useState('');

  const myAdUrl = "https://t.me/MouzaiaDelivery";

  const startTask = () => {
    window.open(myAdUrl, '_blank');
    setIsAdActive(true);
    setTimer(10);
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
      alert("يرجى إدخال اسم مستعار صحيح");
      return;
    }
    localStorage.setItem('chat_nick', nickname);
    window.location.href = "/chat";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500">
      <Head>
        <title>Chat Traffic DZ | منصة تبادل الزيارات</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* --- 1. الواجهة الرئيسية (مع الشرح الجديد) --- */}
      {step === 'landing' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-in fade-in duration-700">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-center leading-none">
            CHAT <span className="text-blue-600">TRAFFIC</span> DZ
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 text-center font-medium">
            أكبر تجمع جزائري لتبادل الزيارات الحقيقية ونمو القنوات والمواقع.
          </p>

          {/* شرح كيف تعمل المنصة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 text-center">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-bold text-blue-400 mb-2">1. زيارة الروابط</h3>
              <p className="text-slate-400 text-sm">قم بزيارة 4 روابط لأعضاء نشطين لتأكيد حضورك.</p>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold text-blue-400 mb-2">2. دخول الدردشة</h3>
              <p className="text-slate-400 text-sm">تواصل مع أصحاب المشاريع والمستثمرين في الجزائر.</p>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 text-center">
              <div className="text-3xl mb-3">📢</div>
              <h3 className="font-bold text-blue-400 mb-2">3. نشر رابطك</h3>
              <p className="text-slate-400 text-sm">ضع رابط قناتك أو موقعك ليقوم الآخرون بزيارته.</p>
            </div>
          </div>

          <button 
            onClick={() => setStep('task')}
            className="px-16 py-6 bg-blue-600 rounded-2xl font-black text-2xl hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1"
          >
            ابدأ التبادل الآن 🚀
          </button>
        </div>
      )}

      {/* --- 2. نظام المهام --- */}
      {step === 'task' && (
        <div className="flex items-center justify-center min-h-screen p-4 animate-in zoom-in duration-500">
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 w-full max-w-md shadow-2xl relative">
            <h2 className="text-3xl font-black mb-2 text-center">تحقق الزيارات</h2>
            <p className="text-slate-400 text-center mb-8 text-sm">أكمل 4 زيارات لفتح نظام الدردشة</p>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className={`p-4 rounded-2xl border transition-all ${visitedCount >= num ? 'bg-green-500/10 border-green-500/40' : 'bg-[#0f172a] border-slate-700'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-sm ${visitedCount >= num ? 'text-green-400' : 'text-slate-400'}`}>
                      {visitedCount >= num ? '✅ تم التحقق' : `المهمة رقم ${num}`}
                    </span>
                    {visitedCount === num - 1 && (
                      <button 
                        disabled={isAdActive}
                        onClick={startTask}
                        className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl text-xs font-black"
                      >
                        {isAdActive ? `${timer}ث` : 'زيارة الرابط'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visitedCount >= 4 && (
              <div className="mt-8 space-y-4 animate-in slide-in-from-bottom">
                <input 
                  type="text" 
                  placeholder="اختر اسماً مستعاراً..."
                  className="w-full p-5 rounded-2xl bg-[#0f172a] border-2 border-blue-500/30 outline-none text-center font-bold text-lg"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <button 
                  onClick={handleFinalEntry}
                  className="w-full bg-green-600 py-5 rounded-2xl font-black text-xl hover:bg-green-500 shadow-xl"
                >
                  دخول الدردشة 💬
                </button>
              </div>
            )}
            
            <button onClick={() => setStep('landing')} className="w-full mt-6 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              ← العودة للخلف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
