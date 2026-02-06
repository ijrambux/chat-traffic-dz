import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TrafficSystem() {
  const [step, setStep] = useState('landing'); 
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [ads, setAds] = useState([]);
  const [supabase, setSupabase] = useState(null);

  // تحميل مكتبة Supabase بدون أوامر npm
  useEffect(() => {
    const loadSupabase = async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(
        'https://rhhdvcatxfebxugcdlua.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjg1NDksImV4cCI6MjA1NTc0NDU0OX0.X-m-Y2m6m8m-Y2m6m8m-Y2m6m8m-Y2m6m8m-Y2m6m8m'
      );
      setSupabase(client);
    };
    loadSupabase();
  }, []);

  // جلب الإعلانات
  const fetchAds = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (data) setAds(data);
  };

  useEffect(() => { if (supabase) fetchAds(); }, [supabase]);

  const startTask = () => {
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

  const handlePost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAd = {
      user_name: formData.get('user'),
      ad_title: formData.get('title'),
      ad_link: formData.get('link')
    };

    const { error } = await supabase.from('ads').insert([newAd]);
    if (!error) {
      fetchAds();
      setStep('wall');
    } else {
      alert("تأكد من إعداد الجدول في Supabase");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col items-center">
      <Head>
        <title>Chat Traffic DZ</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <main className="flex-1 w-full max-w-2xl px-6 py-12 text-right">
        {step === 'landing' && (
          <div className="text-center animate-in fade-in">
            <h1 className="text-5xl font-black mb-10 tracking-tight uppercase">CHAT <span className="text-blue-500">TRAFFIC</span> DZ</h1>
            <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 mb-10">
              <h2 className="text-xl font-bold text-blue-400 mb-4 font-bold">شرح بسيط 💡</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 font-medium">1. شاهد إعلان الممول لمدة 10 ثوانٍ.</p>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">2. ضع رابطك ليراه الجميع مجاناً.</p>
            </div>
            <button onClick={startTask} className="w-full bg-blue-600 py-6 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl">
              {isAdActive ? `يرجى الانتظار (${timer}ث)` : "ابدأ الآن 🚀"}
            </button>
          </div>
        )}

        {step === 'register' && (
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border-t-4 border-blue-600 animate-in slide-in-from-bottom shadow-2xl">
            <h2 className="text-2xl font-black mb-8 text-center font-bold">سجل إعلانك</h2>
            <form onSubmit={handlePost} className="space-y-6 font-bold">
              <input name="user" required placeholder="اسمك المستعار" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500" />
              <input name="title" required placeholder="نوع الإعلان" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500" />
              <input name="link" type="url" required placeholder="رابط الإعلان" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-left text-blue-400 outline-none" />
              <button className="w-full bg-green-600 py-5 rounded-2xl font-black text-xl hover:bg-green-500 transition-all">نشر الإعلان للجميع ✅</button>
            </form>
          </div>
        )}

        {step === 'wall' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-center mb-10 font-bold">جدار الإعلانات 📢</h2>
            {ads.map((ad, i) => (
              <div key={i} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex justify-between items-center group">
                <button onClick={() => window.open(ad.ad_link, '_blank')} className="bg-blue-600 px-6 py-2 rounded-xl text-xs font-black">زيارة 🔗</button>
                <div className="text-right">
                  <h3 className="font-bold text-lg text-white font-bold">{ad.ad_title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">بواسطة: {ad.user_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full py-10 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">جميع الحقوق محفوظة &copy; 2026 CHAT TRAFFIC DZ</p>
        <p className="text-[9px] text-slate-700 mt-2 font-bold italic uppercase tracking-widest leading-relaxed">Developed by MisterAI</p>
      </footer>
    </div>
  );
}
