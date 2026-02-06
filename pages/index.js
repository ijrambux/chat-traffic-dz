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

  // إعلانات الإدارة
  const myAds = [
    { id: "1", title: "متجر أنفال - Anfel Store", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "2", title: "ديماس شوبينغ - Dymas", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "3", title: "منتج الشيب - DZ-New", url: "https://chrimhanidz.com/creme-handhale-soumia-29-nov/?utm_medium=paid&utm_source=fb&utm_id=120239642085720720&utm_content=120239642116680720&utm_term=120239642116580720&utm_campaign=120239642085720720&fbclid=IwY2xjawPzIqBleHRuA2FlbQEwAGFkaWQBqy1RRSs1wHNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR4xeg5ZMBpEWQ1_itkZQ-_y-jWziAYHKRzad6JTk9wlDtmmSfGFc1HPDrgIWA_aem__dquT722S1jE7nsTxTwSag" },
    { id: "4", title: "لوكس فون - LuxePhone", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "5", title: "آلة البطاطس - TeymShop", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  // جلب إعلانات الأعضاء عند تحميل الصفحة
  useEffect(() => {
    async function getAds() {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setMemberAds(data || []);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error.message);
      }
    }
    getAds();
  }, []);

  // دالة التعامل مع الزيارات
  const handleVisit = (id, url) => {
    window.open(url, "_blank");
    if (!clickedLinks.has(id)) {
      const newSet = new Set(clickedLinks).add(id);
      setClickedLinks(newSet);
      setVisitedCount(newSet.size);
    }
  };

  // دالة نشر الإعلان
  const handlePublish = async (e) => {
    e.preventDefault();
    
    if (visitedCount < 5) {
      alert("⚠️ يرجى زيارة جميع المواقع الخمسة أولاً لتفعيل النشر!");
      return;
    }

    setLoading(true);

    try {
      // إرسال البيانات إلى جدول ads
      // تأكد أن هذه الأعمدة (name, title, url) موجودة في جداولك في Supabase
      const { error } = await supabase.from('ads').insert([
        { 
          name: formData.name, 
          title: formData.title, 
          url: formData.url 
        }
      ]);

      if (error) {
        // إذا استمر الخطأ، سنعرضه هنا بالتفصيل
        throw error;
      }

      alert("🎉 مبروك! تم نشر إعلانك بنجاح.");
      // إعادة تعيين النموذج أو تحديث الصفحة
      window.location.reload();

    } catch (error) {
      alert("❌ فشل النشر: " + error.message);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="p-4 bg-blue-600 text-white shadow-lg flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black">TRAFFIC-DZ</h1>
        <button 
          onClick={() => setStep(step === 1 ? 2 : 1)} 
          className="bg-white text-blue-600 px-4 py-1 rounded-lg font-bold hover:bg-blue-50 transition"
        >
          {step === 1 ? "نشر إعلانك" : "الرئيسية"}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-4 py-6">
        {step === 1 ? (
          /* واجهة عرض الإعلانات */
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-center text-blue-600">إعلانات الأعضاء</h2>
            <div className="grid gap-3">
              <p className="text-xs font-bold text-slate-400">إعلانات الإدارة:</p>
              {myAds.map(ad => (
                <button key={ad.id} onClick={() => window.open(ad.url, "_blank")} className="p-4 border-2 border-blue-100 rounded-xl flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition">
                  <span className="font-bold text-sm text-right">{ad.title}</span>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded">زيارة</span>
                </button>
              ))}
              
              <p className="text-xs font-bold text-slate-400 mt-4">إعلانات الأعضاء الجدد:</p>
              {memberAds.length > 0 ? memberAds.map((ad, i) => (
                <a key={i} href={ad.url} target="_blank" rel="noopener noreferrer" className="p-4 border rounded-xl flex flex-col bg-white shadow-sm hover:border-blue-300 transition">
                  <span className="font-bold text-blue-500">{ad.title}</span>
                  <span className="text-[10px] text-slate-400">بواسطة: {ad.name || 'عضو غير معروف'}</span>
                </a>
              )) : (
                <div className="text-center py-10 border-2 border-dashed rounded-xl">
                  <p className="text-slate-400 italic">لا توجد إعلانات حالياً. كن أول من ينشر!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* واجهة إضافة إعلان جديد */
          <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner">
            <h2 className="text-xl font-black text-center mb-6">أنشر إعلانك الآن</h2>
            
            <div className="space-y-2 mb-6">
              <p className="text-sm text-center mb-4 text-slate-600">يجب زيارة المواقع الخمسة لتفعيل زر النشر ({visitedCount}/5)</p>
              {myAds.map(ad => (
                <button 
                  key={ad.id} 
                  onClick={() => handleVisit(ad.id, ad.url)} 
                  className={`w-full p-3 rounded-xl border text-right text-sm flex justify-between transition ${clickedLinks.has(ad.id) ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white hover:border-blue-400'}`}
                >
                  <span>{ad.title}</span>
                  <span>{clickedLinks.has(ad.id) ? 'تمت الزيارة ✓' : 'زيارة'}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handlePublish} className={`space-y-3 transition-opacity ${visitedCount < 5 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <input 
                type="text" 
                placeholder="اسمك الكريم" 
                required 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="ما هو عنوان إعلانك؟" 
                required 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
              <input 
                type="url" 
                placeholder="رابط الموقع (https://...)" 
                required 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={e => setFormData({...formData, url: e.target.value})} 
              />
              <button 
                type="submit"
                disabled={loading || visitedCount < 5}
                className={`w-full py-4 rounded-xl font-black text-lg transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}
              >
                {loading ? "جاري النشر..." : "تأكيد ونشر الإعلان"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
