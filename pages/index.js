import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

const supabase = createClient(
  'https://rhhdvcatxfebxugcdlua.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTc1MjcsImV4cCI6MjA0ODc5MzUyN30.8v-U-G-q8fO_4-Ym-1-1-1-1-1-1-1-1'
);

export default function TrafficDZ() {
  const [ads, setAds] = useState([]);
  const [views, setViews] = useState(0);
  const [formData, setFormData] = useState({ name: '', title: '', link: '' });

  useEffect(() => {
    fetchAds();
    updateViews();
    const interval = setInterval(fetchAds, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (data) setAds(data);
  };

  const updateViews = async () => {
    const { data } = await supabase.from('stats').select('views').eq('id', 1).single();
    if (data) {
      const newCount = data.views + 1;
      await supabase.from('stats').update({ views: newCount }).eq('id', 1);
      setViews(newCount);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('ads').insert([
      { user_name: formData.name, ad_title: formData.title, ad_link: formData.link }
    ]);
    if (!error) {
      setFormData({ name: '', title: '', link: '' });
      fetchAds();
      alert("✅ مبروك يا مصطفى، تم النشر!");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans text-right px-4" dir="rtl">
      <Head>
        <title>TRAFFIC DZ | موزاية</title>
      </Head>

      <header className="py-12 text-center">
        <h1 className="text-6xl font-black mb-2 tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 animate-shine bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            TRAFFIC DZ
          </span>
        </h1>
        <p className="text-blue-400/60 font-bold tracking-[0.2em] text-xs">منصة تبادل الزيارات - BLIDA 09</p>
      </header>

      <main className="max-w-2xl mx-auto">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6 mb-8 text-center">
          <p className="text-blue-400 text-[10px] font-black uppercase mb-1">عدد الزوار</p>
          <span className="text-4xl font-black">{views}</span>
        </div>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
          <form onSubmit={handlePublish} className="space-y-3">
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="الاسم" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="عنوان الإعلان" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input required type="url" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="رابط الموقع https://..." value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-lg transition-all shadow-lg shadow-blue-900/50">نشر الإعلان 🚀</button>
          </form>
        </section>

        <div className="space-y-4 pb-10">
          <h2 className="text-lg font-black px-2">الإعلانات الحالية</h2>
          {ads.map((ad) => (
            <a key={ad.id} href={ad.ad_link} target="_blank" className="block bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all border-r-4 border-r-blue-500">
              <div className="flex justify-between items-center mb-1">
                <span className="text-blue-400 text-sm font-bold">@{ad.user_name}</span>
                <span className="text-white/20 text-[10px]">{new Date(ad.created_at).toLocaleTimeString('ar-DZ')}</span>
              </div>
              <h3 className="text-md font-bold text-white/90">{ad.ad_title}</h3>
            </a>
          ))}
        </div>
      </main>

      <style jsx global>{`
        @keyframes shine { to { background-position: 200% center; } }
        .animate-shine { animation: shine 3s linear infinite; }
      `}</style>
    </div>
  );
}
