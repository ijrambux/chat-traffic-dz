import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

// --- ضع بياناتك هنا ---
const supabaseUrl = 'رابط_مشروعك_هنا';
const supabaseKey = 'مفتاح_API_الخاص_بك_هنا';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TrafficSystem() {
  const [step, setStep] = useState('landing'); 
  const [timer, setTimer] = useState(0);
  const [isAdActive, setIsAdActive] = useState(false);
  const [ads, setAds] = useState([]);

  // جلب الإعلانات من قاعدة البيانات أوتوماتيكياً
  const fetchAds = async () => {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false }); // الأحدث يظهر أولاً
    
    if (data) setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

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

  // دالة إرسال الإعلان لقاعدة البيانات
  const handleFinalRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAd = {
      user_name: formData.get('userName'),
      ad_title: formData.get('adTitle'),
      ad_link: formData.get('adLink'),
    };

    const { error } = await supabase.from('ads').insert([newAd]);

    if (error) {
      alert("حدث خطأ أثناء النشر");
    } else {
      alert("تم نشر إعلانك أوتوماتيكياً للجميع!");
      fetchAds(); // تحديث القائمة فوراً
      setStep('wall');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col items-center">
      <Head><title>Chat Traffic DZ</title><script src="https://cdn.tailwindcss.com"></script></Head>

      <main className="flex-1 w-full max-w-2xl px-6 py-12">
        
        {step === 'landing' && (
          <div className="text-center">
            <h1 className="text-5xl font-black mb-12 uppercase tracking-tight">CHAT <span className="text-blue-500">TRAFFIC</span> DZ</h1>
            <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 text-right mb-10">
              <h2 className="font-bold text-blue-400 mb-2">الشروط</h2>
              <p className="text-slate-400 text-sm">سيظهر إعلانك لكل الزوار فور تسجيلك. يرجى الالتزام بالقوانين.</p>
            </div>
            <button onClick={() => setStep('mandatory')} className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xl shadow-xl transition-all">ابدأ الآن مجاناً 🚀</button>
          </div>
        )}

        {step === 'mandatory' && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-black mb-4">خطوة التحقق</h2>
            <button disabled={isAdActive} onClick={startMandatoryAd} className="bg-blue-600 px-10 py-5 rounded-2xl font-black text-xl disabled:bg-slate-800 transition-all">
               {isAdActive ? `انتظر ${timer}ث` : "زيارة رابط الممول 🔗"}
            </button>
          </div>
        )}

        {step === 'register' && (
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border-t-4 border-blue-600 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 text-center">سجل إعلانك الآن</h2>
            <form onSubmit={handleFinalRegister} className="space-y-6 text-right font-bold">
              <input name="userName" required placeholder="اسمك المستعار" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500" />
              <input name="adTitle" required placeholder="نوع الإعلان" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-right outline-none focus:border-blue-500" />
              <input name="adLink" type="url" required placeholder="رابط الإعلان" className="w-full p-4 rounded-xl bg-[#0f172a] border border-slate-700 text-left text-blue-400 outline-none focus:border-blue-500" />
              <button className="w-full bg-green-600 py-5 rounded-2xl font-black text-xl hover:bg-green-500 transition-all shadow-xl">نشر الإعلان للجميع ✅</button>
            </form>
          </div>
        )}

        {step === 'wall' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-center">جدار الإعلانات</h2>
            <div className="grid gap-4">
              {ads.map((ad, index) => (
                <div key={index} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex justify-between items-center">
                  <button onClick={() => window.open(ad.ad_link, '_blank')} className="bg-blue-600 px-6 py-2 rounded-xl text-xs font-black shadow-lg">زيارة 🔗</button>
                  <div className="text-right">
                    <h3 className="font-bold text-lg">{ad.ad_title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">بواسطة: {ad.user_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer className="w-full py-8 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">جميع الحقوق محفوظة &copy; 2026 <span className="text-blue-500">Chat Traffic DZ</span></p>
      </footer>
    </div>
  );
}
