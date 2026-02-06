import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// الربط المباشر والصحيح
const supabase = createClient(
  'https://pzyvclmscvunmshvshue.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXZjbG1zY3Z1bm1zaHZzaHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTcwNzksImV4cCI6MjA0ODc5MzA3OX0.yI5L6S0G_uXv3N_0D_p_5_v_u_v_u_v_u_v_u_v_u'
);

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [memberAds, setMemberAds] = useState([]);
  const [formData, setFormData] = useState({ name: "", title: "", url: "" });

  const myAds = [
    { id: "1", title: "متجر أنفال - عروض حصرية", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "2", title: "ديماس شوبينغ - Dymas", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "3", title: "منتج الشيب - DZ-New", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "4", title: "لوكس فون - LuxePhone", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "5", title: "آلة البطاطس - TeymShop", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  useEffect(() => {
    async function getAds() {
      const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
      if (data) setMemberAds(data);
    }
    getAds();
  }, []);

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
    const { error } = await supabase.from('ads').insert([{ name: formData.name, title: formData.title, url: formData.url }]);
    if (error) {
      alert("خطأ: تأكد من إعدادات قاعدة البيانات");
    } else {
      alert("تم النشر بنجاح!");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b p-4 sticky top-0 z-50 shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-600">TRAFFIC-DZ</h1>
        <button onClick={() => setIsRegistered(!isRegistered)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold transition-transform active:scale-95">
          {isRegistered ? "الرجوع للرئيسية" : "إضافة إعلانك +"}
        </button>
      </nav>

      <main className="max-w-2xl mx-auto p-4 py-8">
        {!isRegistered ? (
          /* واجهة العرض الرئيسية */
          <div className="space-y-8">
            <header className="text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-3xl font-black text-slate-800 mb-2">أهلاً بك في منصة التبادل</h2>
              <p className="text-slate-500 font-medium italic underline decoration-blue-200">زد زيارات موقعك مجاناً وبسهولة</p>
            </header>

            <section className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
              <h3 className="font-black text-blue-600 mb-4 border-r-4 border-blue-600 pr-3">إعلانات الإدارة (رسمية)</h3>
              <div className="grid gap-3">
                {myAds.map(ad => (
                  <a key={ad.id} href={ad.url} target="_blank" className="flex justify-between items-center p-5 bg-blue-50/50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition-all font-bold">
                    <span className="text-slate-700">{ad.title}</span>
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs">زيارة الموقع</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
              <h3 className="font-black text-slate-400 mb-4 border-r-4 border-slate-300 pr-3">إعلانات الأعضاء الجدد</h3>
              <div className="grid gap-3">
                {memberAds.length > 0 ? memberAds.map((ad, i) => (
                  <a key={i} href={ad.url} target="_blank" className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col hover:shadow-lg transition-all">
                    <span className="font-black text-blue-500 text-lg">{ad.title}</span>
                    <span className="text-xs text-slate-400 font-bold">المعلن: {ad.name}</span>
                  </a>
                )) : <p className="text-center py-10 text-slate-300 font-bold italic">لا توجد إعلانات أعضاء حالياً.</p>}
              </div>
            </section>
          </div>
        ) : (
          /* واجهة التسجيل (بدون أخطاء تداخل) */
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-black text-center mb-6">نشر إعلان جديد</h2>
            
            <div className="space-y-3 mb-8">
              <p className="text-sm font-black text-blue-600 text-center mb-4">أكمل 5 زيارات لتفعيل زر النشر ({visitedCount}/5)</p>
              {myAds.map(ad => (
                <button key={ad.id} onClick={() => handleVisit(ad.id, ad.url)} className={`w-full p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${clickedLinks.has(ad.id) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                  <span className="font-black">{ad.title}</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${clickedLinks.has(ad.id) ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {clickedLinks.has(ad.id) ? 'تمت الزيارة ✓' : 'زيارة'}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={handlePublish} className={`space-y-4 ${visitedCount < 5 ? 'opacity-20 pointer-events-none' : ''}`}>
              <input type="text" placeholder="اسمك" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="عنوان الإعلان" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={e => setFormData({...formData, title: e.target.value})} />
              <input type="url" placeholder="رابط موقعك (https://...)" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={e => setFormData({...formData, url: e.target.value})} />
              <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-200">نشر إعلاني الآن</button>
            </form>
          </div>
        )}
      </main>
      <footer className="py-8 text-center text-slate-300 font-bold text-xs uppercase">
        MisterAI &copy; {new Date().getFullYear()} - Blida 09
      </footer>
    </div>
  );
}
