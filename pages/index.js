import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// إعدادات الاتصال بـ Supabase
const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDg4OTQsImV4cCI6MjA4NTkyNDg5NH0.12qmM8PcddSAxH7TQXj44Ez1F5WATQ6ve8Q_vvmJzqg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [step, setStep] = useState(1);
  const [visitedCount, setVisitedCount] = useState(0);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [memberAds, setMemberAds] = useState([]);
  const [formData, setFormData] = useState({ name: "", title: "", url: "" });
  const [loading, setLoading] = useState(false);
  const [canPublish, setCanPublish] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  const myAds = [
    { id: "1", title: "متجر أنفال - Anfel Store", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "2", title: "ديماس شوبينغ - Dymas", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "3", title: "منتج الشيب - DZ-New", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "4", title: "لوكس فون - LuxePhone", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "5", title: "آلة البطاطس - TeymShop", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  useEffect(() => {
    getAds();
    checkPublishLimit();
  }, []);

  // جلب الإعلانات مرتبة حسب الأحدث (العضو رقم 6 يظهر فوق رقم 5)
  async function getAds() {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false }); // الترتيب من الأحدث للأقدم
    
    if (!error) setMemberAds(data || []);
  }

  // التحقق من شرط الـ 24 ساعة
  const checkPublishLimit = () => {
    const lastPublish = localStorage.getItem("last_publish_time");
    if (lastPublish) {
      const hoursDiff = (Date.now() - parseInt(lastPublish)) / (1000 * 60 * 60);
      if (hoursDiff < 24) {
        setCanPublish(false);
        setTimeLeft(Math.ceil(24 - hoursDiff) + " ساعة");
      } else {
        setCanPublish(true);
      }
    }
  };

  const handleVisit = (id, url) => {
    window.open(url, "_blank");
    if (!clickedLinks.has(id)) {
      const newSet = new Set(clickedLinks).add(id);
      setClickedLinks(newSet);
      setVisitedCount(newSet.size);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (visitedCount < 5) return alert("يرجى زيارة 5 مواقع أولاً!");
    if (!canPublish) return alert(`يمكنك النشر مرة واحدة كل 24 ساعة. متبقي: ${timeLeft}`);

    setLoading(true);
    const { error } = await supabase.from('ads').insert([
      { name: formData.name, title: formData.title, url: formData.url }
    ]);

    if (error) {
      alert("فشل النشر: " + error.message);
      setLoading(false);
    } else {
      localStorage.setItem("last_publish_time", Date.now().toString());
      alert("مبروك! تم نشر إعلانك بنجاح.");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      <nav className="p-4 bg-blue-700 text-white shadow-md flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter">TRAFFIC-DZ</h1>
        <button 
          onClick={() => setStep(step === 1 ? 2 : 1)} 
          className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full font-bold hover:bg-yellow-300 transition shadow-sm"
        >
          {step === 1 ? "➕ أنشر إعلانك" : "🏠 الرئيسية"}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-4 py-6">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-800 text-sm font-bold border border-blue-200">
              💡 ملاحظة: تظهر الإعلانات الجديدة في الأعلى. يمكنك تحديث إعلانك كل 24 ساعة.
            </div>

            <div className="grid gap-3">
              <p className="text-xs font-bold text-slate-500 mr-2">⭐ إعلانات مميزة (الإدارة):</p>
              {myAds.map(ad => (
                <button key={ad.id} onClick={() => window.open(ad.url, "_blank")} className="p-4 border border-blue-200 rounded-2xl flex justify-between items-center bg-white hover:border-blue-500 transition shadow-sm group">
                  <span className="font-bold text-sm">{ad.title}</span>
                  <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full group-hover:bg-blue-700">زيارة</span>
                </button>
              ))}
              
              <p className="text-xs font-bold text-slate-500 mt-4 mr-2">🕒 إعلانات الأعضاء الجدد:</p>
              {memberAds.length > 0 ? memberAds.map((ad, i) => (
                <a key={i} href={ad.url} target="_blank" rel="noopener noreferrer" className="p-4 border border-slate-200 rounded-2xl flex flex-col bg-white shadow-sm hover:border-blue-400 transition animate-in fade-in slide-in-from-bottom-2">
                  <span className="font-bold text-blue-600">{ad.title}</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-slate-400">بواسطة: {ad.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">منذ قليل</span>
                  </div>
                </a>
              )) : (
                <div className="text-center py-10 border-2 border-dashed rounded-3xl bg-white">
                  <p className="text-slate-400 italic">لا توجد إعلانات حالياً. كن أول من يضع بصمته!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl">
            <h2 className="text-xl font-black text-center mb-6 text-blue-700">تجهيز إعلانك</h2>
            
            <div className="space-y-2 mb-6">
              <p className="text-[12px] text-center mb-4 text-slate-500 font-medium">يجب دعم زملائك بزيارة 5 مواقع لتفعيل إعلانك ({visitedCount}/5)</p>
              {myAds.map(ad => (
                <button 
                  key={ad.id} 
                  onClick={() => handleVisit(ad.id, ad.url)} 
                  className={`w-full p-3 rounded-xl border text-right text-sm flex justify-between items-center transition-all ${clickedLinks.has(ad.id) ? 'bg-green-50 border-green-300 text-green-700' : 'bg-slate-50 hover:border-blue-400'}`}
                >
                  <span className="font-bold">{ad.title}</span>
                  {clickedLinks.has(ad.id) ? <span className="text-xs">✅ تم</span> : <span className="text-xs bg-white px-2 py-1 rounded border shadow-sm">زيارة</span>}
                </button>
              ))}
            </div>

            <form onSubmit={handlePublish} className={`space-y-3 transition-all ${visitedCount < 5 || !canPublish ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <input type="text" placeholder="اسمك" required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="عنوان الإعلان" required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" onChange={e => setFormData({...formData, title: e.target.value})} />
              <input type="url" placeholder="رابط موقعك https://..." required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" onChange={e => setFormData({...formData, url: e.target.value})} />
              
              <button 
                disabled={loading || !canPublish}
                className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transform transition active:scale-95 ${!canPublish ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {!canPublish ? `مسموح لك بالنشر بعد ${timeLeft}` : loading ? "جاري المعالجة..." : "تأكيد ونشر الإعلان"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
