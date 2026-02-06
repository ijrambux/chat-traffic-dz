import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TrafficSystem() {
  const [step, setStep] = useState('wall'); 
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  const [ads] = useState([
    { id: 1, title: "Mouzaia Delivery", url: "https://t.me/MouzaiaDelivery", time: "نشط" },
    { id: 2, title: "خدمات شحن الألعاب", url: "https://t.me/example", time: "نشط" }
  ]);

  // التحقق من قيود الجهاز عند محاولة النشر
  const checkDeviceLimit = () => {
    const lastPost = localStorage.getItem('last_post_time');
    if (lastPost) {
      const now = new Date().getTime();
      const diff = now - parseInt(lastPost);
      const dayInMs = 24 * 60 * 60 * 1000;

      if (diff < dayInMs) {
        const remaining = dayInMs - diff;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours} ساعة و ${minutes} دقيقة`);
        return false;
      }
    }
    return true;
  };

  const handleStartPost = () => {
    if (checkDeviceLimit()) {
      setStep('task');
    } else {
      setStep('locked');
    }
  };

  const startTask = (url) => {
    window.open(url, '_blank');
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

  const handlePostAd = (e) => {
    e.preventDefault();
    const postTime = new Date().getTime();
    localStorage.setItem('last_post_time', postTime.toString());
    alert("✅ تم نشر إعلانك! جهازك الآن مقفل لمدة 24 ساعة.");
    setStep('wall');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 flex flex-col items-center">
      <Head>
        <title>Traffic Wall DZ</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-500 italic uppercase">TRAFFIC DZ</h1>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] mt-2 italic">نظام التبادل العادل</p>
        </div>

        {/* 1. جدار الإعلانات */}
        {step === 'wall' && (
          <div className="space-y-4 animate-in fade-in">
            <button 
              onClick={handleStartPost}
              className="w-full bg-blue-600 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all border-b-4 border-blue-800"
            >
              ➕ أنشر إعلانك الآن
            </button>
            <div className="grid gap-3 mt-8 text-right">
              {ads.map(ad => (
                <div key={ad.id} className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700 flex justify-between items-center group">
                   <button onClick={() => window.open(ad.url, '_blank')} className="bg-blue-500/10 text-blue-400 p-3 rounded-xl hover:bg-blue-500 hover:text-white transition-all">🔗</button>
                   <div>
                    <h3 className="font-bold text-sm">{ad.title}</h3>
                    <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mt-1">نشط حالياً</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. حالة القفل (إذا سجل مسبقاً) */}
        {step === 'locked' && (
          <div className="bg-slate-900 border-2 border-red-500/30 p-8 rounded-[2.5rem] text-center animate-in zoom-in">
            <div className="text-5xl mb-4">🚫</div>
            <h2 className="text-xl font-black text-red-400 mb-2">عذراً! جهازك مقيد</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              لقد قمت بنشر إعلانك بالفعل. يسمح بنشر إعلان واحد فقط كل 24 ساعة لكل جهاز.
            </p>
            <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 mb-6">
              <span className="text-xs font-bold">بقي لك: {timeLeft}</span>
            </div>
            <button onClick={() => setStep('wall')} className="text-slate-500 text-xs font-bold underline">العودة للجدار</button>
          </div>
        )}

        {/* 3. شرط الزيارة (المهمة) */}
        {step === 'task' && (
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-blue-500/30 text-center animate-in zoom-in">
            <h2 className="text-2xl font-black mb-6">خطوة التحقق</h2>
            <div className="p-4 bg-[#0f172a] rounded-2xl border border-slate-700 flex justify-between items-center mb-8">
               <button 
                disabled={isAdActive || visitedCount > 0}
                onClick={() => startTask(ads[0].url)}
                className="bg-blue-600 px-5 py-2 rounded-xl text-xs font-black disabled:bg-green-600 transition-all"
              >
                {isAdActive ? `${timer}ث` : visitedCount > 0 ? "✅ تمت" : "زيارة"}
              </button>
              <span className="font-bold text-xs text-slate-300">دعم رابط العضو السابق</span>
            </div>
            {visitedCount > 0 && (
              <button onClick={() => setStep('postForm')} className="w-full bg-green-600 py-4 rounded-xl font-bold animate-bounce shadow-lg shadow-green-600/20">متابعة النشر ➡️</button>
            )}
          </div>
        )}

        {/* 4. نموذج الإعلان */}
        {step === 'postForm' && (
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-blue-500/30 animate-in slide-in-from-bottom">
            <h2 className="text-2xl font-black mb-6 text-center text-blue-400 font-bold">بيانات إعلانك</h2>
            <form onSubmit={handlePostAd} className="space-y-5 text-right">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">نوع الإعلان</label>
                <input name="adTitle" required placeholder="توصيل، بيع، قناة..." className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right font-bold text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">الرابط الخاص بك</label>
                <input name="adLink" type="url" required placeholder="https://t.me/your_link" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-left font-bold text-sm text-blue-400 outline-none focus:border-blue-500" />
              </div>
              <button className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 shadow-xl mt-4">تأكيد ونشر 🚀</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
