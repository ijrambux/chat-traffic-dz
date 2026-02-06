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

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setAllAds(data || []);
  };

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

  // دالة معالجة الزيارة - تم إصلاحها لتعمل بشكل فوري
  const handleAdClick = async (ad, index) => {
    window.open(ad.url, "_blank");
    
    // تحديث عداد الزيارات في قاعدة البيانات للأعضاء فقط
    if (ad.id) {
      await supabase.from('ads').update({ clicks: (ad.clicks || 0) + 1 }).eq('id', ad.id);
    }

    // تحديث الحالة المحلية لحساب عدد الزيارات المطلوبة للنشر
    setClickedLinks((prev) => {
      const newSet = new Set(prev);
      newSet.add(ad.id || `admin-${index}`); // استخدام معرف فريد
      return newSet;
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (clickedLinks.size < Math.min(allAds.length, 5) && allAds.length > 0) {
        return alert("يرجى زيارة المواقع المطلوبة أولاً!");
    }
    
    setLoading(true);
    const { error } = await supabase.from('ads').insert([
      { name: formData.name, title: formData.title, url: formData.url, clicks: 0 }
    ]);

    if (!error) {
      localStorage.setItem("last_pub", Date.now().toString());
      alert("تم النشر بنجاح!");
      window.location.reload();
    } else {
      alert("خطأ: " + error.message);
      setLoading(false);
    }
  };

  // تحديد المواقع المطلوبة للزيارة (أول 5 إعلانات)
  const targetAds = allAds.slice(0, 5);
  const visitedCount = clickedLinks.size;
  const requiredCount = Math.min(allAds.length, 5);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      <nav className="p-4 bg-blue-700 text-white shadow-lg flex justify-between items-center sticky top-0 z-50">
        <span className="font-black text-xl italic">TRAFFIC-DZ</span>
        <button onClick={() => setStep(step === 1 ? 2 : 1)} className="bg-yellow-400 text-blue-900 px-5 py-1.5 rounded-full font-bold text-sm shadow-md">
          {step === 1 ? "➕ أنشر إعلانك" : "🏠 القائمة"}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-4">
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-center font-bold text-slate-500 text-sm py-2">أحدث الإعلانات</h2>
            {allAds.length > 0 ? allAds.map((ad, i) => (
              <div key={ad.id || i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 transition-all cursor-pointer" onClick={() => handleAdClick(ad, i)}>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-blue-700 text-lg leading-tight">{ad.title}</h3>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                    {ad.clicks || 0} زيارة 👁️
                  </span>
                </div>
                <p className="mt-3 text-[11px] text-slate-400 font-medium">بواسطة: {ad.name}</p>
              </div>
            )) : (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                <p className="text-slate-400">لا توجد إعلانات حالياً، كن أول من ينشر!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border">
             <h2 className="text-xl font-black text-center text-blue-700 mb-6">نشر إعلان جديد</h2>
             
             {requiredCount > 0 && (
               <div className="space-y-2 mb-6">
                <p className="text-[11px] text-center text-slate-500 mb-4 font-bold">
                  يجب زيارة المواقع التالية لتفعيل النشر ({visitedCount}/{requiredCount})
                </p>
                {targetAds.map((ad, i) => (
                  <button 
                    key={ad.id || i} 
                    onClick={() => handleAdClick(ad, i)} 
                    className={`w-full p-4 rounded-2xl border text-right flex justify-between items-center transition ${clickedLinks.has(ad.id || `admin-${i}`) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 hover:border-blue-300'}`}
                  >
                    <span className="font-bold text-sm truncate ml-2">{ad.title}</span>
                    {clickedLinks.has(ad.id || `admin-${i}`) ? <span className="text-xs">✅ تمت الزيارة</span> : <span className="text-xs text-blue-600 font-bold">زيارة</span>}
                  </button>
                ))}
              </div>
             )}

            <form onSubmit={handlePublish} className={`space-y-3 ${(visitedCount < requiredCount || !canPublish) ? 'opacity-30 pointer-events-none' : ''}`}>
              <input type="text" placeholder="اسمك" required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="عنوان الإعلان" required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" onChange={e => setFormData({...formData, title: e.target.value})} />
              <input type="url" placeholder="رابط الموقع" required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" onChange={e => setFormData({...formData, url: e.target.value})} />
              <button disabled={loading || !canPublish} className={`w-full py-5 rounded-2xl font-black text-xl shadow-lg transition-all ${!canPublish ? 'bg-slate-400 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                {!canPublish ? `متبقي ${timeLeft}` : loading ? "جاري النشر..." : "أنشر الآن 🚀"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
