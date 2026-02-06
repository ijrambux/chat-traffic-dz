import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TrafficSystem() {
  const [step, setStep] = useState('landing'); 
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // إعلانات الأعضاء المسجلين (مثال)
  const [ads] = useState([
    { id: 1, user: "MisterAI", title: "Mouzaia Delivery", url: "https://t.me/MouzaiaDelivery" },
    { id: 2, user: "أحمد", title: "بيع بطاقات جوجل", url: "https://google.com" },
  ]);

  const startMandatoryAd = () => {
    window.open("https://t.me/MouzaiaDelivery", '_blank');
    setIsAdActive(true);
    setTimer(10); 
  };

  useEffect(() => {
    let interval;
    if (isAdActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (isAdActive && timer === 0) {
      setIsAdActive(false);
      setIsVerified(true);
      setStep('register'); // الانتقال التلقائي للتسجيل بعد الزيارة
    }
    return () => clearInterval(interval);
  }, [isAdActive, timer]);

  const handleFinalRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('has_posted', 'true');
    setStep('wall');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 flex justify-center">
      <Head>
        <title>Chat Traffic DZ</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="w-full max-w-2xl">
        
        {/* 1. الصفحة الرئيسية (شرح وشروط) */}
        {step === 'landing' && (
          <div className="animate-in fade-in duration-700 text-center py-10">
            <h1 className="text-5xl font-black text-blue-500 mb-6 italic">TRAFFIC DZ</h1>
            
            <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700 text-right space-y-6 mb-8">
              <h2 className="text-xl font-bold border-b border-slate-700 pb-2 text-blue-400">كيف تعمل المنصة؟</h2>
              <p className="text-slate-400 text-sm leading-relaxed">قم بزيارة إعلان الممول لمدة 10 ثوانٍ، ثم سجل بيانات إعلانك لتظهر للآلاف من زوارنا مجاناً.</p>
              
              <h2 className="text-xl font-bold border-b border-slate-700 pb-2 text-blue-400">شروط الخدمة</h2>
              <ul className="text-slate-400 text-sm space-y-2 pr-4 list-disc list-inside">
                <li>يمنع نشر روابط مخلة أو احتيالية.</li>
                <li>إعلان واحد فقط لكل جهاز كل 24 ساعة.</li>
                <li>يجب احترام أعضاء المجتمع.</li>
              </ul>
            </div>

            <button 
              onClick={() => setStep('mandatory')}
              className="bg-blue-600 px-16 py-5 rounded-2xl font-black text-2xl shadow-xl hover:bg-blue-500 transition-all"
            >
              موافق، ابدأ الآن 🚀
            </button>
          </div>
        )}

        {/* 2. الإعلان الإجباري */}
        {step === 'mandatory' && (
          <div className="flex items-center justify-center min-h-[60vh] animate-in zoom-in text-center">
            <div className="bg-[#1e293b] p-10 rounded-[3rem] border-4 border-blue-600/20 w-full shadow-2xl">
              <h2 className="text-2xl font-black mb-4">خطوة التحقق الإلزامية</h2>
              <p className="text-slate-400 mb-8 font-medium">شاهد إعلان القناة الرسمية لتفتح لك خانات التسجيل</p>
              
              <button 
                disabled={isAdActive}
                onClick={startMandatoryAd}
                className="bg-blue-600 px-10 py-5 rounded-2xl font-black text-xl disabled:bg-slate-700 transition-all shadow-lg"
              >
                {isAdActive ? `انتظر ${timer} ثوانٍ...` : "زيارة إعلان القناة 🔗"}
              </button>
            </div>
          </div>
        )}

        {/* 3. واجهة التسجيل (3 خانات) */}
        {step === 'register' && (
          <div className="animate-in slide-in-from-bottom p-4">
            <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-blue-500/30">
              <h2 className="text-2xl font-black mb-6 text-center text-blue-400">تسجيل إعلانك الجديد</h2>
              <form onSubmit={handleFinalRegister} className="space-y-5 text-right font-bold">
                <div>
                  <label className="text-xs text-slate-500 mr-2 mb-2 block">اسمك المستعار</label>
                  <input required placeholder="مثلاً: MisterAI" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mr-2 mb-2 block">نوع الإعلان (العنوان)</label>
                  <input required placeholder="ماذا تقدم في إعلانك؟" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mr-2 mb-2 block">رابط الإعلان (URL)</label>
                  <input required type="url" placeholder="https://t.me/..." className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-left text-blue-400 outline-none focus:border-blue-500" />
                </div>
                <button className="w-full bg-green-600 py-5 rounded-2xl font-black text-xl hover:bg-green-500 shadow-xl mt-4">نشر الإعلان ودخول الجدار 🚀</button>
              </form>
            </div>
          </div>
        )}

        {/* 4. جدار الإعلانات (الزيارة حرة) */}
        {step === 'wall' && (
          <div className="animate-in fade-in space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-blue-400">جدار إعلانات الأعضاء</h2>
              <p className="text-slate-500 text-xs mt-1 font-bold italic">الزيارات في هذا القسم اختيارية</p>
            </div>

            <div className="grid gap-4">
              {ads.map(ad => (
                <div key={ad.id} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex justify-between items-center hover:border-blue-500/50 transition-all">
                  <button onClick={() => window.open(ad.url, '_blank')} className="bg-blue-600 px-6 py-2 rounded-xl text-xs font-black shadow-lg">زيارة 🔗</button>
                  <div className="text-right">
                    <h3 className="font-bold text-sm">{ad.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">بواسطة: {ad.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
