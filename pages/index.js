import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDg4OTQsImV4cCI6MjA4NTkyNDg5NH0.12qmM8PcddSAxH7TQXj44Ez1F5WATQ6ve8Q_vvmJzqg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [step, setStep] = useState(1); // 1: القائمة، 2: النشر، 3: المعاينة
  const [allAds, setAllAds] = useState([]);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [formData, setFormData] = useState({ name: "", title: "", url: "" });
  const [loading, setLoading] = useState(false);
  const [canPublish, setCanPublish] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  
  // حالات العداد والإطار
  const [activeAd, setActiveAd] = useState(null);
  const [timer, setTimer] = useState(30);
  const [isBlockedSite, setIsBlockedSite] = useState(false);

  useEffect(() => {
    fetchAds();
    checkLimit();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // إدارة العداد التنازلي
  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && activeAd) {
      handleVisitSuccess(activeAd);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const fetchAds = async () => {
    const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (!error) setAllAds(data || []);
  };

  const checkLimit = () => {
    const last = localStorage.getItem("last_pub");
    if (last) {
      const diff = (Date.now() - parseInt(last)) / (1000 * 60 * 60);
      if (diff < 24) { setCanPublish(false); setTimeLeft(Math.ceil(24 - diff) + " ساعة"); }
    }
  };

  const startAdPreview = (ad) => {
    setActiveAd(ad);
    setTimer(30);
    const blocked = ['facebook.com', 't.me', 'twitter.com', 'instagram.com', 'youtube.com'].some(s => ad.url.toLowerCase().includes(s));
    setIsBlockedSite(blocked);
    
    if (blocked) {
      window.open(ad.url, "_blank"); // فتح الروابط المحمية في نافذة جديدة
    }
    setStep(3);
  };

  const handleVisitSuccess = async (ad) => {
    if (ad.id) {
      await supabase.from('ads').update({ clicks: (ad.clicks || 0) + 1 }).eq('id', ad.id);
    }
    setClickedLinks(prev => new Set(prev).add(ad.id || ad.url));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    // التأكد من إرسال الحقول name و title كما طلبت قاعدة البيانات
    const { error } = await supabase.from('ads').insert([{ 
      name: formData.name, 
      title: formData.title, 
      url: formData.url, 
      clicks: 0 
    }]);

    if (!error) {
      localStorage.setItem("last_pub", Date.now().toString());
      window.location.reload();
    } else {
      alert("خطأ: " + error.message);
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col font-sans" dir="rtl">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center shadow-xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">نظام التحقق الذكي</span>
            <span className="font-bold truncate max-w-[150px]">{activeAd?.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl font-black text-sm border-2 ${timer > 0 ? 'border-yellow-500 text-yellow-500' : 'border-green-500 text-green-500 animate-bounce'}`}>
              {timer > 0 ? `انتظر ${timer} ثا` : "تم التحقق ✓"}
            </div>
            <button onClick={() => setStep(1)} className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-sm">إغلاق</button>
          </div>
        </div>
        <div className="h-1.5 bg-slate-800 w-full">
           <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(30 - timer) / 30 * 100}%` }}></div>
        </div>
        {!isBlockedSite ? (
          <iframe src={activeAd?.url} className="flex-grow w-full border-none" title="Ad View" />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-10 text-center bg-slate-50">
            <div className="text-6xl mb-6 shadow-xl rounded-full p-4 bg-white animate-bounce">🚀</div>
            <h3 className="text-2xl font-black text-slate-800 mb-4">تم فتح الرابط في نافذة جديدة</h3>
            <p className="text-slate-500 font-bold max-w-sm">يرجى مشاهدة الإعلان في النافذة الأخرى والانتظار هنا حتى ينتهي العداد لفتح قفل النشر.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" dir="rtl">
      <nav className="p-4 bg-white border-b border-slate-200 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-blue-600 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse">TRAFFIC-DZ</h1>
        <button onClick={() => setStep(step === 1 ? 2 : 1)} className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-lg transition-all active:scale-95">
          {step === 1 ? "➕ أنشر إعلانك" : "🏠 الرئيسية"}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-4 flex-grow w-full">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <h2 className="text-xl font-black text-slate-800">إعلانات الأعضاء</h2>
              <div className="h-1.5 w-12 bg-blue-600 mx-auto mt-2 rounded-full"></div>
            </div>
            {allAds.map((ad, i) => (
              <div key={ad.id || i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-500 transition-all cursor-pointer group" onClick={() => startAdPreview(ad)}>
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-blue-600">{ad.title}</h3>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-full border border-blue-100">{ad.clicks || 0} زيارة 👁️</span>
                </div>
                <div className="mt-4 text-[12px] text-slate-500 font-black tracking-tight">بواسطة: {ad.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 mt-4">
             <h2 className="text-2xl font-black text-center text-slate-800 mb-8">نشر إعلان جديد</h2>
             {allAds.length > 0 && (
               <div className="space-y-3 mb-8">
                <p className="text-xs text-center text-slate-500 mb-4 font-black">تحقق من 5 إعلانات (30ث لكل منها): ({clickedLinks.size}/{Math.min(allAds.length, 5)})</p>
                {allAds.slice(0, 5).map((ad, i) => (
                  <button key={i} onClick={() => startAdPreview(ad)} className={`w-full p-5 rounded-2xl border-2 text-right flex justify-between items-center transition-all ${clickedLinks.has(ad.id || ad.url) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-100 hover:border-blue-400 text-slate-700'}`}>
                    <span className="font-black text-sm">{ad.title}</span>
                    {clickedLinks.has(ad.id || ad.url) ? <span className="text-xs font-black">تم ✓</span> : <span className="text-xs font-black text-blue-600 underline">بدء المشاهدة</span>}
                  </button>
                ))}
              </div>
             )}
            <form onSubmit={handlePublish} className={`space-y-4 ${(clickedLinks.size < Math.min(allAds.length, 5) || !canPublish) ? 'opacity-20 pointer-events-none' : ''}`}>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">اسمك</label>
                <input type="text" placeholder="مثلاً: محمد الجزائري" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">عنوان الإعلان</label>
                <input type="text" placeholder="عنوان جذاب لموقعك" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">الرابط</label>
                <input type="url" placeholder="https://..." required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black shadow-inner focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, url: e.target.value})} />
              </div>
              <button disabled={loading || !canPublish} className={`w-full py-6 rounded-2xl font-black text-xl shadow-xl transition-all mt-4 ${!canPublish ? 'bg-slate-300 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}>
                {!canPublish ? `انتظر ${timeLeft}` : loading ? "جاري النشر..." : "تأكيد ونشر الإعلان الآن"}
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 p-8 text-center mt-10">
        <p className="text-slate-800 font-black text-sm uppercase tracking-tighter">&copy; 2026 جميع الحقوق محفوظة لـ <span className="text-blue-600">TRAFFIC-DZ</span></p>
      </footer>
    </div>
  );
}
