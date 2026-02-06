import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

// --- البيانات الخاصة بمشروعك على Supabase ---
const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjg1NDksImV4cCI6MjA1NTc0NDU0OX0.X-m-Y2m6m8m-Y2m6m8m-Y2m6m8m-Y2m6m8m-Y2m6m8m'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TrafficSystem() {
  const [step, setStep] = useState('landing'); 
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [ads, setAds] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  // 1. جلب الإعلانات من القاعدة تلقائياً
  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setAds(data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchAds(); }, []);

  // 2. التحقق من قيد الـ 24 ساعة للجهاز
  const checkLimit = () => {
    const lastPost = localStorage.getItem('last_post_time');
    if (lastPost) {
      const diff = new Date().getTime() - parseInt(lastPost);
      if (diff < 24 * 60 * 60 * 1000) {
        const remaining = (24 * 60 * 60 * 1000) - diff;
        const hours = Math.floor(remaining / 3600000);
        setTimeLeft(`${hours} ساعة`);
        return false;
      }
    }
    return true;
  };

  const startMandatoryTask = () => {
    if (!checkLimit()) {
      setStep('locked');
      return;
    }
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
      setStep('register');
    }
    return () => clearInterval(interval);
  }, [isAdActive, timer]);

  // 3. إرسال الإعلان الجديد للقاعدة
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAd = {
      user_name: formData.get('user'),
      ad_title: formData.get('title'),
      ad_link: formData.get('link')
    };

    const { error } = await supabase.from('ads').insert([newAd]);
    if (!error) {
      localStorage.setItem('last_post_time', new Date().getTime().toString());
      fetchAds();
      setStep('wall');
    } else {
      alert("تأكد من إعداد جدول ads في Supabase بشكل صحيح");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col items-center">
      <Head>
        <title>Chat Traffic DZ | منصة تبادل الزيارات</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <main className="flex-1 w-full max-w-2xl px-6 py-12">
        {/* الصفحة الرئيسية */}
        {step === 'landing' && (
          <div className="text-center animate-in fade-in duration-1000">
            <h1 className="text-5xl font-black mb-4 tracking-tight text-white uppercase">CHAT <span className="text-blue-500">TRAFFIC</span> DZ</h1>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto mb-10 rounded-full"></div>
            
            <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 text-right mb-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
              <h2 className="text-xl font-bold text-blue-400 mb-4 italic">دليل الاستخدام 💡</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">نظام جزائري مبتكر لتبادل الزيارات الحقيقية. قم بزيارة إعلان الممول الرسمي لفتح ميزة النشر المجاني لإعلانك الخاص لمدة 24 ساعة كاملة.</p>
              <h2 className="text-xl font-bold text-blue-400 mb-4 italic">قوانين المنصة ⚖️</h2>
              <ul className="text-slate-400 text-xs space-y-2 pr-4">
                <li>• يسمح بنشر رابط واحد فقط لكل جهاز يومياً.</li>
                <li>• الروابط المخلة تؤدي لحظر الجهاز نهائياً.</li>
              </ul>
            </div>

            <button onClick={startMandatoryTask} className="w-full bg-blue-600 py-6 rounded-2xl font-black text-2xl shadow-xl hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-3">
              {isAdActive ? `يرجى الانتظار (${timer}ث)` : "ابدأ النشر الآن 🚀"}
            </button>
          </div>
        )}

        {/* واجهة التسجيل */}
        {step === 'register' && (
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border-t-8 border-blue-600 shadow-2xl animate-in slide-in-from-bottom">
            <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-widest">بيانات إعلانك</h2>
            <form onSubmit={handleRegister} className="space-y-6 text-right font-bold">
              <div>
                <label className="text-[10px] text-slate-500 mr-2 mb-2 block uppercase">اسمك المستعار</label>
                <input name="user" required placeholder="MisterAI" className="w-full p-5 rounded-2xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500 transition-all font-bold" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mr-2 mb-2 block uppercase">نوع الإعلان</label>
                <input name="title" required placeholder="توصيل، بيع هواتف، قناة.." className="w-full p-5 rounded-2xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500 transition-all font-bold" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mr-2 mb-2 block uppercase text-left">رابط الإعلان (URL)</label>
                <input name="link" type="url" required placeholder="https://t.me/example" className="w-full p-5 rounded-2xl bg-[#0f172a] border border-slate-700 text-left text-blue-400 outline-none focus:border-blue-500 transition-all font-bold" />
              </div>
              <button className="w-full bg-green-600 py-6 rounded-2xl font-black text-xl hover:bg-green-500 shadow-xl transition-all active:scale-95 mt-4">نشر الإعلان للجميع ✅</button>
            </form>
          </div>
        )}

        {/* جدار الإعلانات */}
        {step === 'wall' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-center mb-10 tracking-tighter">الإعلانات النشطة 📢</h2>
            {ads.length === 0 ? (
              <p className="text-center text-slate-500 italic">لا توجد إعلانات حالياً، كن أول من ينشر!</p>
            ) : (
              ads.map((ad, i) => (
                <div key={i} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex justify-between items-center hover:border-blue-600/50 transition-all group">
                  <button onClick={() => window.open(ad.ad_link, '_blank')} className="bg-blue-600 px-8 py-3 rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition-all active:scale-95">زيارة 🔗</button>
                  <div className="text-right">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{ad.ad_title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">بواسطة: {ad.user_name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* واجهة قفل الجهاز */}
        {step === 'locked' && (
          <div className="text-center py-20 animate-in zoom-in">
            <div className="text-7xl mb-6">🚫</div>
            <h2 className="text-3xl font-black text-red-500 mb-4 tracking-tighter">الجهاز مقيد حالياً</h2>
            <p className="text-slate-400 mb-8 font-medium">يسمح بنشر إعلان واحد فقط كل 24 ساعة لضمان الجودة.</p>
            <div className="inline-block bg-red-500/10 text-red-500 px-8 py-3 rounded-full font-black border border-red-500/20 shadow-lg">
              يمكنك النشر بعد: {timeLeft}
            </div>
            <button onClick={() => setStep('wall')} className="block w-full mt-12 text-blue-500 font-black uppercase text-xs tracking-widest hover:text-blue-400">تصفح إعلانات الأعضاء</button>
          </div>
        )}
      </main>

      {/* فوتر الحقوق */}
      <footer className="w-full py-10 border-t border-slate-900 bg-[#0a101f] text-center">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">جميع الحقوق محفوظة &copy; 2026 CHAT TRAFFIC DZ</p>
        <div className="mt-3 flex items-center justify-center gap-2 opacity-50">
          <div className="h-px w-8 bg-slate-700"></div>
          <p className="text-[9px] text-slate-600 font-bold uppercase">Developed by MisterAI</p>
          <div className="h-px w-8 bg-slate-700"></div>
        </div>
      </footer>
    </div>
  );
}
