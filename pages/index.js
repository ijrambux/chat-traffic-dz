import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDg4OTQsImV4cCI6MjA4NTkyNDg5NH0.12qmM8PcddSAxH7TQXj44Ez1F5WATQ6ve8Q_vvmJzqg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [step, setStep] = useState(1); 
  const [allAds, setAllAds] = useState([]);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [formData, setFormData] = useState({ name: "", title: "", url: "" });
  const [loading, setLoading] = useState(false);
  const [canPublish, setCanPublish] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  
  const [activeAd, setActiveAd] = useState(null);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    fetchAds();
    const last = localStorage.getItem("last_pub");
    if (last) {
      const diff = (Date.now() - parseInt(last)) / (1000 * 60 * 60);
      if (diff < 24) {
        setCanPublish(false);
        setTimeLeft(Math.ceil(24 - diff) + " ساعة");
      }
    }
  }, []);

  // منطق العداد التنازلي
  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && activeAd) {
      finishVisit(activeAd);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const fetchAds = async () => {
    const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (!error) setAllAds(data || []);
  };

  const startAdProcess = (ad) => {
    setActiveAd(ad);
    setTimer(30);
    setStep(3); // الانتقال لواجهة العداد فوراً
    window.open(ad.url, "_blank"); // فتح الإعلان في نافذة جديدة دائماً لضمان عمل فيسبوك وتويتر
  };

  const finishVisit = async (ad) => {
    if (ad.id) {
      await supabase.from('ads').update({ clicks: (ad.clicks || 0) + 1 }).eq('id', ad.id);
    }
    setClickedLinks(prev => new Set(prev).add(ad.id || ad.url));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    // إرسال البيانات بالتسميات الصحيحة لجدولك
    const { error } = await supabase.from('ads').insert([
      { name: formData.name, title: formData.title, url: formData.url, clicks: 0 }
    ]);

    if (!error) {
      localStorage.setItem("last_pub", Date.now().toString());
      alert("تم النشر بنجاح!");
      window.location.reload();
    } else {
      alert("خطأ البرمجة: " + error.message);
      setLoading(false);
    }
  };

  // واجهة العداد (تظهر عند الضغط على إعلان)
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-6 text-center font-sans" dir="rtl">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-sm w-full">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (30 - timer)) / 30} className="text-blue-600 transition-all duration-1000" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-slate-800">{timer}</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">جاري التحقق من الزيارة</h3>
          <p className="text-slate-500 font-bold mb-6 text-sm">يرجى البقاء في الموقع المفتوح لمدة 30 ثانية. لا تغلق هذه الصفحة.</p>
          <button 
            disabled={timer > 0} 
            onClick={() => setStep(1)} 
            className={`w-full py-4 rounded-2xl font-black transition-all ${timer > 0 ? 'bg-slate-100 text-slate-400' : 'bg-green-500 text-white shadow-lg animate-bounce'}`}
          >
            {timer > 0 ? "انتظر انتهاء الوقت..." : "تم التحقق! عُد للقائمة ✓"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" dir="rtl">
      {/* Navbar مع الشعار المضيء */}
      <nav className="p-4 bg-white border-b border-slate-200 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)] animate-pulse">TRAFFIC-DZ</h1>
        <button onClick={() => setStep(step === 1 ? 2 : 1)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-sm shadow-md transition-all active:scale-95">
          {step === 1 ? "➕ أنشر إعلانك" : "🏠 الرئيسية"}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-4 flex-grow w-full">
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-center font-black text-slate-700 py-4">الإعلانات المميزة</h2>
            {allAds.map((ad, i) => (
              <div key={ad.id || i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-500 transition-all cursor-pointer group" onClick={() => startAdProcess(ad)}>
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{ad.title}</h3>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full border border-blue-100">{ad.clicks || 0} زيارة</span>
                </div>
                <div className="mt-4 text-[12px] text-slate-400 font-black">المعلن: {ad.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
             <h2 className="text-2xl font-black text-center text-slate-800 mb-8">نشر إعلان جديد</h2>
             {allAds.length > 0 && (
               <div className="space-y-3 mb-8">
                <p className="text-xs text-center text-slate-500 mb-4 font-black">أكمل 5 زيارات (30ث لكل منها): ({clickedLinks.size}/{Math.min(allAds.length, 5)})</p>
                {allAds.slice(0, 5).map((ad, i) => (
                  <button key={i} onClick={() => startAdProcess(ad)} className={`w-full p-4 rounded-2xl border-2 text-right flex justify-between items-center transition-all ${clickedLinks.has(ad.id || ad.url) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-50 hover:border-blue-400 text-slate-700'}`}>
                    <span className="font-black text-sm">{ad.title}</span>
                    {clickedLinks.has(ad.id || ad.url) ? <span className="text-xs font-black text-green-600">تم التحقق ✓</span> : <span className="text-xs font-black text-blue-600 underline tracking-tighter">بدء 30 ثانية</span>}
                  </button>
                ))}
              </div>
             )}
            <form onSubmit={handlePublish} className={`space-y-4 ${(clickedLinks.size < Math.min(allAds.length, 5) || !canPublish) ? 'opacity-20 pointer-events-none' : ''}`}>
              <input type="text" placeholder="اسمك" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="عنوان الإعلان" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
              <input type="url" placeholder="الرابط https://..." required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, url: e.target.value})} />
              <button disabled={loading || !canPublish} className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${!canPublish ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                {!canPublish ? `متاح بعد ${timeLeft}` : "تأكيد ونشر الإعلان 🚀"}
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 p-8 text-center mt-10">
        <p className="text-slate-800 font-black text-sm">&copy; 2026 جميع الحقوق محفوظة لـ <span className="text-blue-600">TRAFFIC-DZ</span></p>
      </footer>
    </div>
  );
}
