import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// إعدادات الاتصال بـ Supabase
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

  // جلب البيانات وتسجيل الـ Service Worker للإعلانات
  useEffect(() => {
    fetchAds();
    checkLimit();

    // تسجيل كود الإعلان (Service Worker) الذي أرسلته
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log("Ad Service Registered"))
        .catch(err => console.log("Ad Service Error", err));
    }
  }, []);

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setAllAds(data || []);
  };

  const checkLimit = () => {
    const last = localStorage.getItem("last_pub");
    if (last) {
      const diff = (Date.now() - parseInt(last)) / (1000 * 60 * 60);
      if (diff < 24) {
        setCanPublish(false);
        setTimeLeft(Math.ceil(24 - diff) + " ساعة");
      }
    }
  };

  const handleAdClick = async (ad, index) => {
    window.open(ad.url, "_blank");
    
    // تحديث عداد الزيارات في قاعدة البيانات
    if (ad.id) {
      await supabase.from('ads')
        .update({ clicks: (ad.clicks || 0) + 1 })
        .eq('id', ad.id);
    }

    setClickedLinks((prev) => {
      const newSet = new Set(prev);
      newSet.add(ad.id || `target-${index}`);
      return newSet;
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('ads').insert([
      { name: formData.name, title: formData.title, url: formData.url, clicks: 0 }
    ]);

    if (!error) {
      localStorage.setItem("last_pub", Date.now().toString());
      alert("تم النشر بنجاح يا مصطفى!");
      window.location.reload();
    } else {
      alert("خطأ في النشر: " + error.message);
      setLoading(false);
    }
  };

  const targetAds = allAds.slice(0, 5);
  const requiredCount = Math.min(allAds.length, 5);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" dir="rtl">
      {/* Navbar مع شعار يلمع بالأزرق القوي */}
      <nav className="p-4 bg-white border-b border-slate-200 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-blue-700 tracking-tighter drop-shadow-[0_0_10px_rgba(37,99,235,0.7)] animate-pulse">
          TRAFFIC-DZ
        </h1>
        <button 
          onClick={() => setStep(step === 1 ? 2 : 1)} 
          className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-black text-sm hover:bg-blue-700 transition shadow-lg active:scale-95"
        >
          {step === 1 ? "➕ أنشر إعلانك" : "🏠 الرئيسية"}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-4 flex-grow w-full">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-xl font-black text-slate-800">أحدث الإعلانات</h2>
              <div className="h-1.5 w-16 bg-blue-600 mx-auto mt-2 rounded-full"></div>
            </div>
            
            {allAds.map((ad, i) => (
              <div 
                key={ad.id || i} 
                className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-500 transition-all cursor-pointer group" 
                onClick={() => handleAdClick(ad, i)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {ad.title}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 text-[11px] font-black px-3 py-1.5 rounded-full border border-blue-100">
                    {ad.clicks || 0} زيارة 👁️
                  </span>
                </div>
                <div className="mt-4 flex items-center text-[12px] text-slate-500 font-black">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg">بواسطة: {ad.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
             <h2 className="text-2xl font-black text-center text-slate-800 mb-8">إضافة إعلان جديد</h2>
             
             {requiredCount > 0 && (
               <div className="space-y-3 mb-8">
                <p className="text-sm text-center text-slate-600 mb-4 font-black">
                  دعم الزملاء: ({clickedLinks.size}/{requiredCount})
                </p>
                {targetAds.map((ad, i) => (
                  <button 
                    key={ad.id || i} 
                    onClick={() => handleAdClick(ad, i)} 
                    className={`w-full p-5 rounded-2xl border-2 text-right flex justify-between items-center transition-all ${clickedLinks.has(ad.id || `target-${i}`) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-50 hover:border-blue-400 text-slate-700'}`}
                  >
                    <span className="font-black text-sm">{ad.title}</span>
                    {clickedLinks.has(ad.id || `target-${i}`) ? <span className="text-xs font-black">تم ✓</span> : <span className="text-xs font-black text-blue-600">زيارة</span>}
                  </button>
                ))}
              </div>
             )}

            <form onSubmit={handlePublish} className={`space-y-5 ${(clickedLinks.size < requiredCount || !canPublish) ? 'opacity-20 pointer-events-none' : ''}`}>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2">اسمك الكامل</label>
                <input type="text" placeholder="مثلاً: حميد الجزائري" required className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold shadow-inner" onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2">عنوان إعلانك</label>
                <input type="text" placeholder="ماذا تريد أن تروج؟" required className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold shadow-inner" onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2">رابط الموقع</label>
                <input type="url" placeholder="https://..." required className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold shadow-inner" onChange={e => setFormData({...formData, url: e.target.value})} />
              </div>
              
              <button disabled={loading || !canPublish} className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all mt-4 ${!canPublish ? 'bg-slate-300 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}>
                {!canPublish ? `يرجى الانتظار ${timeLeft}` : loading ? "جاري النشر..." : "تأكيد ونشر الإعلان الآن"}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* حقوق الصفحة (Footer) */}
      <footer className="bg-white border-t border-slate-200 p-8 mt-12">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-slate-800 font-black text-base">
            &copy; 2026 جميع الحقوق محفوظة لموقع <span className="text-blue-600">TRAFFIC-DZ</span>
          </p>
          <p className="text-slate-400 text-[11px] font-black mt-2 uppercase tracking-tighter">
            المنصة الأولى لتبادل الزيارات في الجزائر
          </p>
        </div>
      </footer>
    </div>
  );
}
