import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// دالة التحقق من صلاحية الإعلان (24 ساعة)
const isAdValid = (createdAt) => {
  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  const expireTime = new Date(createdAt).getTime() + dayInMilliseconds;
  return Date.now() < expireTime;
};

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [visitedCount, setVisitedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const router = useRouter();

  // قاعدة بيانات تجريبية للإعلانات (يتم جلبها من السيرفر مستقبلاً)
  const allAds = [
    { id: 1, title: "متجر الهواتف الذكية - وهران", url: "https://google.com", created_at: new Date().toISOString() },
    { id: 2, title: "خدمات فليكسي وباريدي موب", url: "https://bing.com", created_at: new Date().toISOString() },
    { id: 3, title: "عقارات الجزائر العاصمة", url: "https://yahoo.com", created_at: new Date().toISOString() },
    { id: 4, title: "تكنولوجيا وإعلام آلي", url: "https://duckduckgo.com", created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() }, // إعلان منتهي (أكثر من 24 ساعة)
  ];

  // تصفية الإعلانات الصالحة فقط
  const activeAds = allAds.filter(ad => isAdValid(ad.created_at));

  const startAdTask = (url) => {
    window.open(url, '_blank');
    setIsAdActive(true);
    setTimer(10); // مؤقت 10 ثواني
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
        <p className="text-slate-400 mb-8 font-medium">دردش، تبادل الزيارات، واستثمر</p>

        {visitedCount < 4 ? (
          <div className="space-y-6">
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/50">
              <p className="text-sm text-blue-200 font-bold">
                ⚠️ مهمة الدخول: زيارة 4 روابط أعضاء ({visitedCount}/4)
              </p>
            </div>
            
            <div className="space-y-3 text-right">
              {activeAds.slice(0, 4).map((ad, index) => (
                <button
                  key={ad.id}
                  disabled={isAdActive || visitedCount !== index}
                  onClick={() => startAdTask(ad.url)}
                  className={`w-full p-4 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${
                    visitedCount > index 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : visitedCount === index 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-lg animate-pulse' 
                    : 'bg-slate-700 text-slate-500 opacity-50'
                  }`}
                >
                  <span>{visitedCount > index ? "✅ تمت الزيارة" : `زيارة: ${ad.title}`}</span>
                  {visitedCount === index && isAdActive && <span className="bg-black/30 px-2 py-1 rounded">{timer}ث</span>}
                </button>
              ))}
            </div>
            
            <p className="text-[10px] text-slate-500 italic">
              * جميع الإعلانات تتجدد كل 24 ساعة لضمان الجودة.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/50 text-green-400 font-bold mb-4">
              ✅ أحسنت! تم إكمال المهام بنجاح
            </div>
            <input
              type="text"
              placeholder="اختر اسماً مستعاراً..."
              className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 focus:border-blue-500 outline-none transition text-center text-lg font-bold"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button 
              onClick={handleEnterChat}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-xl text-lg"
            >
              دخول مجتمع المستثمرين
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
