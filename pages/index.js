import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// --- الربط المباشر (تأكد من دقة هذه البيانات) ---
const supabaseUrl = 'https://pzyvclmscvunmshvshue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXZjbG1zY3Z1bm1zaHZzaHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTcwNzksImV4cCI6MjA0ODc5MzA3OX0.yI5L6S0G_uXv3N_0D_p_5_v_u_v_u_v_u_v_u_v_u';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [step, setStep] = useState(1);
  const [visitedCount, setVisitedCount] = useState(0);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [memberAds, setMemberAds] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({ name: "", title: "", url: "" });

  const myAds = [
    { id: "1", name: "Anfel Store", title: "متجر أنفال", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "2", name: "Dymas", title: "ديماس شوبينغ", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "3", name: "DZ-New", title: "منتج الشيب", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "4", name: "LuxePhone", title: "لوكس فون", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "5", name: "TeymShop", title: "آلة البطاطس", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  useEffect(() => {
    async function getAds() {
      try {
        const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
        if (data) setMemberAds(data);
      } catch (e) { console.error("Fetch failed"); }
    }
    getAds();
  }, []);

  const handleVisit = (id, url) => {
    window.open(url, "_blank");
    if (!clickedLinks.has(id)) {
      const next = new Set(clickedLinks).add(id);
      setClickedLinks(next);
      setVisitedCount(next.size);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('ads').insert([
        { name: formData.name, title: formData.title, url: formData.url }
      ]);
      if (!error) {
        alert("تم النشر بنجاح!");
        window.location.reload();
      } else { alert("خطأ في البيانات: " + error.message); }
    } catch (err) { alert("فشل الاتصال: تأكد من إعدادات الشبكة"); }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} font-sans`} dir="rtl">
      {/* Navbar */}
      <nav className="p-4 bg-white border-b shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black text-blue-600 italic">TRAFFIC-DZ</h1>
        <div className="flex gap-2">
          <button onClick={() => setIsDark(!isDark)} className="p-2 bg-slate-100 rounded-lg text-sm">{isDark ? "☀️" : "🌙"}</button>
          <button onClick={() => setStep(step === 1 ? 2 : 1)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
            {step === 1 ? "نشر إعلان +" : "الرئيسية"}
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 py-8">
        {step === 1 ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black">إعلانات المجتمع</h2>
              <p className="text-slate-500 mt-2">تبادل حقيقي للزيارات - البليدة 09</p>
            </div>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-blue-600 mb-4 border-r-4 border-blue-600 pr-3">إعلانات مثبتة</h3>
              <div className="space-y-3">
                {myAds.map(ad => (
                  <a key={ad.id} href={ad.url} target="_blank" className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-400 transition-all">
                    <span className="font-bold text-sm text-slate-700">{ad.name} - {ad.title}</span>
                    <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full">زيارة</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-400 mb-4 border-r-4 border-slate-300 pr-3">إعلانات الأعضاء</h3>
              <div className="space-y-3">
                {memberAds.map((ad, i) => (
                  <a key={i} href={ad.url} target="_blank" className="flex flex-col p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="font-bold text-sm">{ad.title}</span>
                    <span className="text-[10px] text-slate-400">المعلن: {ad.name}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* واجهة النشر الاحترافية */
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black text-center mb-6 text-slate-800">تفعيل إعلانك</h2>
            
            <div className="space-y-3 mb-8">
              <p className="text-xs font-bold text-blue-600 text-center mb-4">زر 5 مواقع لتفعيل الزر ({visitedCount}/5)</p>
              {myAds.map(ad => (
                <button key={ad.id} onClick={() => handleVisit(ad.id, ad.url)} className={`w-full p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${clickedLinks.has(ad.id) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span className="font-bold text-sm">{ad.name} - {ad.title}</span>
                  <span className="text-[10px] font-black">{clickedLinks.has(ad.id) ? '✓ تم' : 'زيارة'}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handlePublish} className={`space-y-4 ${visitedCount < 5 ? 'opacity-20 pointer-events-none' : ''}`}>
              <input type="text" placeholder="اسمك المستعار" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="عنوان جذاب لإعلانك" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, title: e.target.value})} />
              <input type="url" placeholder="رابط الموقع (https://...)" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, url: e.target.value})} />
              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-blue-200 hover:scale-[1.02] transition-transform">
                نشر الإعلان الآن
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
