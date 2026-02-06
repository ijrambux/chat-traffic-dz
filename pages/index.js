import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pzyvclmscvunmshvshue.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXZjbG1zY3Z1bm1zaHZzaHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTcwNzksImV4cCI6MjA0ODc5MzA3OX0.yI5L6S0G_uXv3N_0D_p_5_v_u_v_u_v_u_v_u_v_u'
);

export default function Home() {
  const [step, setStep] = useState(1);
  const [visitedCount, setVisitedCount] = useState(0);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [memberAds, setMemberAds] = useState([]);
  const [formData, setFormData] = useState({ name: "", title: "", url: "" });

  const myAds = [
    { id: "1", title: "متجر أنفال - Anfel Store", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "2", title: "ديماس شوبينغ - Dymas", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "3", title: "منتج الشيب - DZ-New", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "4", title: "لوكس فون - LuxePhone", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "5", title: "آلة البطاطس - TeymShop", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  useEffect(() => {
    async function getAds() {
      const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
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
    if (visitedCount < 5) return alert("زر 5 مواقع أولاً");

    const { error } = await supabase.from('ads').insert([
      { name: formData.name, title: formData.title, url: formData.url }
    ]);

    if (error) {
      console.error(error);
      alert("مشكلة في السيرفر: " + error.message);
    } else {
      alert("تم النشر بنجاح! سيظهر إعلانك الآن.");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans" dir="rtl">
      <nav className="p-4 bg-blue-600 text-white shadow-lg flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black">TRAFFIC-DZ</h1>
        <button onClick={() => setStep(step === 1 ? 2 : 1)} className="bg-white text-blue-600 px-4 py-1 rounded-lg font-bold">
          {step === 1 ? "نشر إعلانك" : "الرئيسية"}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-4 py-6">
        {step === 1 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-center text-blue-600">إعلانات الأعضاء</h2>
            <div className="grid gap-3">
              <p className="text-xs font-bold text-slate-400">إعلانات الإدارة:</p>
              {myAds.map(ad => (
                <a key={ad.id} href={ad.url} target="_blank" className="p-4 border-2 border-blue-100 rounded-xl flex justify-between items-center bg-blue-50">
                  <span className="font-bold text-sm">{ad.title}</span>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded">زيارة</span>
                </a>
              ))}
              
              <p className="text-xs font-bold text-slate-400 mt-4">إعلانات الأعضاء:</p>
              {memberAds.length > 0 ? memberAds.map((ad, i) => (
                <a key={i} href={ad.url} target="_blank" className="p-4 border rounded-xl flex flex-col bg-white shadow-sm">
                  <span className="font-bold text-blue-500">{ad.title}</span>
                  <span className="text-[10px] text-slate-400">المعلن: {ad.name}</span>
                </a>
              )) : <p className="text-center text-slate-300 italic py-10">لا توجد إعلانات بعد.</p>}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner">
            <h2 className="text-xl font-black text-center mb-6">أنشر إعلانك في دقيقة</h2>
            <div className="space-y-2 mb-6">
              {myAds.map(ad => (
                <button key={ad.id} onClick={() => handleVisit(ad.id, ad.url)} className={`w-full p-3 rounded-xl border text-right text-sm flex justify-between ${clickedLinks.has(ad.id) ? 'bg-green-100 border-green-500' : 'bg-white'}`}>
                  <span>{ad.title}</span>
                  <span>{clickedLinks.has(ad.id) ? '✓' : 'زيارة'}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handlePublish} className={`space-y-3 ${visitedCount < 5 ? 'opacity-20 pointer-events-none' : ''}`}>
              <input type="text" placeholder="اسمك" required className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="عنوان الإعلان" required className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, title: e.target.value})} />
              <input type="url" placeholder="رابط موقعك" required className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, url: e.target.value})} />
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-black">تأكيد النشر</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
