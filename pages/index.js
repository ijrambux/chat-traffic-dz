import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TrafficSystem() {
  const [step, setStep] = useState('landing'); 
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);

  // إعلانات تجريبية (ستكون أوتوماتيكية عند ربط القاعدة)
  const [ads] = useState([
    { id: 1, user: "MisterAI", title: "Mouzaia Delivery", url: "https://t.me/MouzaiaDelivery" },
    { id: 2, user: "أدمن", title: "خدمات التصميم الاحترافي", url: "https://t.me/example" },
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
    } else if (isAdActive && timer === 0 && isAdActive) {
      setIsAdActive(false);
      setStep('register');
    }
    return () => clearInterval(interval);
  }, [isAdActive, timer]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col items-center">
      <Head>
        <title>Chat Traffic DZ</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <main className="flex-1 w-full max-w-2xl px-6 py-12">
        
        {/* --- 1. الصفحة الرئيسية (تصميم فخم) --- */}
        {step === 'landing' && (
          <div className="animate-in fade-in duration-1000">
            <header className="text-center mb-12">
              <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                CHAT <span className="text-blue-500">TRAFFIC</span> DZ
              </h1>
              <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
            </header>
            
            <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 shadow-2xl text-right mb-10">
              <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center justify-end gap-2">
                <span>كيفية الاستخدام</span>
                <span className="text-2xl">💡</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                منصتنا تتيح لك نشر إعلانك ليصل إلى آلاف الزوار الحقيقيين. لضمان جودة الزيارات، يجب عليك أولاً دعم الرابط الممول، وبعدها يمكنك وضع بيانات إعلانك الخاص مجاناً.
              </p>
              
              <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center justify-end gap-2">
                <span>شروط الخدمة</span>
                <span className="text-2xl">⚖️</span>
              </h2>
              <ul className="text-slate-400 space-y-3 pr-4 border-r-2 border-blue-500/20">
                <li>• يسمح بنشر إعلان واحد فقط كل 24 ساعة.</li>
                <li>• يمنع بتاتاً الروابط الاحتيالية أو المخالفة للقانون.</li>
                <li>• حقوق الإعلان محفوظة لصاحب الرابط والمنصة غير مسؤولة.</li>
              </ul>
            </div>

            <button 
              onClick={() => setStep('mandatory')}
              className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-900/20 hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
            >
              <span>ابدأ الآن مجاناً</span>
              <span className="text-2xl">🚀</span>
            </button>
          </div>
        )}

        {/* --- 2. الإعلان الإجباري --- */}
        {step === 'mandatory' && (
          <div className="text-center py-20 animate-in zoom-in">
            <div className="bg-[#1e293b] p-10 rounded-[3rem] border border-slate-700 shadow-2xl">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h2 className="text-2xl font-black mb-4">خطوة التحقق</h2>
              <p className="text-slate-400 mb-10">قم بزيارة قناة الممول الرسمية لمدة 10 ثوانٍ لفتح خانات التسجيل</p>
              
              <button 
                disabled={isAdActive}
                onClick={startMandatoryAd}
                className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xl disabled:bg-slate-800 transition-all"
              >
                {isAdActive ? `يرجى الانتظار (${timer}ث)` : "زيارة رابط الممول 🔗"}
              </button>
            </div>
          </div>
        )}

        {/* --- 3. واجهة التسجيل --- */}
        {step === 'register' && (
          <div className="animate-in slide-in-from-bottom">
            <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border-t-4 border-blue-600 shadow-2xl">
              <h2 className="text-2xl font-black mb-8 text-center">سجل إعلانك الآن</h2>
              <form onSubmit={(e) => {e.preventDefault(); setStep('wall');}} className="space-y-6 text-right font-bold">
                <div>
                  <label className="text-xs text-slate-500 mb-2 block mr-2 font-black uppercase tracking-widest">الاسم المستعار</label>
                  <input required placeholder="مثلاً: MisterAI" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-2 block mr-2 font-black uppercase tracking-widest">نوع الإعلان (العنوان)</label>
                  <input required placeholder="ماذا تقدم؟" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-2 block mr-2 font-black uppercase tracking-widest">رابط الإعلان</label>
                  <input required type="url" placeholder="https://t.me/..." className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-left text-blue-400 outline-none focus:border-blue-500 transition-all" />
                </div>
                <button className="w-full bg-green-600 py-5 rounded-2xl font-black text-xl hover:bg-green-500 shadow-xl mt-4 transition-all">نشر الإعلان مجاناً ✅</button>
              </form>
            </div>
          </div>
        )}

        {/* --- 4. جدار إعلانات الأعضاء --- */}
        {step === 'wall' && (
          <div className="animate-in fade-in space-y-8">
            <header className="text-center">
              <h2 className="text-3xl font-black text-white">جدار الإعلانات</h2>
              <div className="h-1 w-10 bg-green-500 mx-auto mt-2 rounded-full"></div>
            </header>

            <div className="grid gap-4">
              {ads.map(ad => (
                <div key={ad.id} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex justify-between items-center hover:border-blue-600/50 transition-all group">
                  <button onClick={() => window.open(ad.url, '_blank')} className="bg-blue-600 px-6 py-3 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-all">زيارة 🔗</button>
                  <div className="text-right">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{ad.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold">بواسطة: {ad.user}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => setStep('landing')} className="w-full py-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] hover:text-slate-400 transition-all">
              العودة للرئيسية
            </button>
          </div>
        )}

      </main>

      {/* --- حقوق النشر (الفوتر) --- */}
      <footer className="w-full py-8 border-t border-slate-900 bg-[#0a101f] text-center">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
          جميع الحقوق محفوظة &copy; 2026 <span className="text-blue-500">Chat Traffic DZ</span>
        </p>
        <p className="text-[9px] text-slate-700 mt-2 font-medium">Developed by MisterAI</p>
      </footer>
    </div>
  );
}
