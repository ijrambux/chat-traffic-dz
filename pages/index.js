import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// --- الربط المباشر مع قاعدتك (تم التفعيل) ---
const supabaseUrl = 'https://pzyvclmscvunmshvshue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXZjbG1zY3Z1bm1zaHZzaHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTcwNzksImV4cCI6MjA0ODc5MzA3OX0.yI5L6S0G_uXv3N_0D_p_5_v_u_v_u_v_u_v_u_v_u'; // المفتاح مدمج
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [memberAds, setMemberAds] = useState([]);
  const [formData, setFormData] = useState({ name: "", adTitle: "", adUrl: "" });

  const myAds = [
    { id: "a1", title: "متجر أنفال - Anfel Store", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "a2", title: "Dymas Shopping - ديماس شوبينغ", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "a3", title: "DZ-New Store - منتج الشيب", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "a4", title: "LuxePhoneDZ - لوكس فون", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "a5", title: "TeymShop - آلة البطاطس", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  useEffect(() => { fetchAds(); }, []);

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (data) setMemberAds(data);
  };

  const handleVisit = (id, url) => {
    window.open(url, "_blank");
    if (!clickedLinks.has(id)) {
      const newClicked = new Set(clickedLinks).add(id);
      setClickedLinks(newClicked);
      setVisitedCount(newClicked.size);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('ads').insert([
      { name: formData.name, title: formData.adTitle, url: formData.adUrl }
    ]);
    if (!error) {
      alert("تم النشر بنجاح! إعلانك يظهر الآن للجميع.");
      setVisitedCount(0);
      setIsRegistered(false);
      fetchAds();
    } else {
      alert("خطأ: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-600">TRAFFIC-DZ</h1>
          <button onClick={() => setIsRegistered(!isRegistered)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition">
            {isRegistered ? "الرئيسية" : "إضافة إعلانك"}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {!isRegistered ? (
          <div>
            <div className="text-center py-12">
              <h2 className="text-4xl font-black text-slate-900 mb-4">مجتمع تبادل الإعلانات الجزائري</h2>
              <p className="text-slate-500 max-w-xl mx-auto">ادعم غيرك بزيارة مواقعهم، وسيدعمك الجميع بزيارة موقعك. نظام عادل ومجاني تماماً.</p>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-blue-600 font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-600 rounded-full"></span> إعلانات الإدارة (مثبتة)
                </h3>
                <div className="grid gap-3">
                  {myAds.map(ad => (
                    <a key={ad.id} href={ad.url} target="_blank" className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex justify-between items-center hover:bg-blue-100 transition">
                      <span className="font-bold text-blue-900">{ad.title}</span>
                      <span className="text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-full shadow-sm">زيارة الموقع</span>
                    </a>
                  ))}
                </div>
              </section>

              <section className="mt-12">
                <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-slate-400 rounded-full"></span> أحدث إعلانات الأعضاء
                </h3>
                <div className="grid gap-3">
                  {memberAds.length > 0 ? memberAds.map((ad, i) => (
                    <a key={i} href={ad.url} target="_blank" className="p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center hover:shadow-md transition">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{ad.title}</span>
                        <span className="text-[10px] text-slate-400">المعلن: {ad.name}</span>
                      </div>
                      <span className="text-xs text-slate-400 italic">زيارة ←</span>
                    </a>
                  )) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed">
                      <p className="text-slate-400">لا توجد إعلانات أعضاء حالياً. كن الأول وانشر إعلانك!</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl mt-4">
            <h2 className="text-2xl font-black text-center mb-2 text-slate-900">انشر إعلانك مجاناً</h2>
            <p className="text-center text-slate-500 text-sm mb-8 font-medium italic underline decoration-blue-200">الشرط: زر 5 إعلانات لتفعيل الزر</p>

            <div className="space-y-3 mb-8">
              {myAds.map(ad => (
                <button key={ad.id} onClick={() => handleVisit(ad.id, ad.url)} className={`w-full p-4 text-right rounded-xl border-2 transition-all font-bold flex justify-between items-center ${clickedLinks.has(ad.id) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-300'}`}>
                  <span>{ad.title}</span>
                  <span className="text-xs">{clickedLinks.has(ad.id) ? 'تمت الزيارة ✓' : 'زيارة'}</span>
                </button>
              ))}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${visitedCount * 20}%` }}></div>
              </div>
            </div>

            <form onSubmit={handlePublish} className={`space-y-4 ${visitedCount < 5 ? 'opacity-20 pointer-events-none' : ''}`}>
              <input type="text" placeholder="اسمك" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="عنوان الإعلان" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, adTitle: e.target.value})} />
              <input type="url" placeholder="رابط موقعك (https://...)" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, adUrl: e.target.value})} />
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg shadow-xl hover:bg-blue-700 transition">نشر الإعلان الآن</button>
            </form>
          </div>
        )}
      </main>
      <footer className="py-10 text-center text-slate-400 text-xs">
        MisterAI &copy; {new Date().getFullYear()} - البليدة 09
      </footer>
    </div>
  );
}
