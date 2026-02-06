import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LandingPage() {
  const [nickname, setNickname] = useState('');
  const [visitedCount, setVisitedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const router = useRouter();

  // مصفوفة الإعلانات (يتم جلبها مستقبلاً من السيرفر)
  const ads = [
    { id: 1, title: "متجر الهواتف الذكية", url: "https://google.com" },
    { id: 2, title: "خدمات فليكسي باريدي موب", url: "https://bing.com" },
    { id: 3, title: "عقارات الجزائر العاصمة", url: "https://yahoo.com" },
    { id: 4, title: "تكنولوجيا وإعلام آلي", url: "https://duckduckgo.com" }
  ];

  const startAdTask = (url) => {
    window.open(url, '_blank');
    setIsAdActive(true);
    setTimer(10); // الانتظار 10 ثواني
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

  const handleEnterChat = () => {
    if (nickname.trim()) {
      localStorage.setItem('chat_nick', nickname);
      router.push('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white font-sans">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md text-center">
        <h1 className="text-4xl font-black mb-2 text-blue-500 italic">Chat Traffic DZ</h1>
        <p className="text-slate-400 mb-8">دردش، تبادل الزيارات، واستثمر</p>

        {visitedCount < 4 ? (
          <div className="space-y-6">
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/50">
              <p className="text-sm text-blue-200 font-bold">مهمة الدخول: زيارة 4 روابط ({visitedCount}/4)</p>
            </div>
            <button
              disabled={isAdActive}
              onClick={() => startAdTask(ads[visitedCount].url)}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 py-4 rounded-xl font-bold transition-all shadow-lg"
            >
              {isAdActive ? `يرجى الانتظار: ${timer} ثواني` : `فتح إعلان العضو رقم ${visitedCount + 1}`}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <input
              type="text"
              placeholder="اسمك المستعار (Nickname)"
              className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 focus:border-blue-500 outline-none transition"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button 
              onClick={handleEnterChat}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-xl"
            >
              دخول الغرف العامة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
