import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

// الربط النهائي بمشروعك في موزاية
const supabase = createClient(
  'https://rhhdvcatxfebxugcdlua.supabase.co',
  'sb_publishable_5AoPRPUWEKB3wPBx5qSWng_VX1_-oH-'
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
    try {
      const { data } = await supabase.from('stats').select('views').eq('id', 1).single();
      if (data) {
        const newCount = data.views + 1;
        await supabase.from('stats').update({ views: newCount }).eq('id', 1);
        setViews(newCount);
      }
    } catch (e) { console.log(e) }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('ads').insert([
      { user_name: formData.name, ad_title: formData.title, ad_link: formData.link }
    ]);
    if (!error) {
      setFormData({ name: '', title: '', link: '' });
      fetchAds();
      alert("✅ مبروك يا مصطفى، إعلانك راهو لايف!");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans text-right px-4 pb-10" dir="rtl">
      <Head>
        <title>TRAFFIC DZ | موزاية</title>
      </Head>

      <header className="py-16 text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-2 tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 animate-shine bg-[length:200%_auto] drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            TRAFFIC DZ
          </span>
        </h1>
        <p className="text-blue-400/60 font-bold tracking-[0.3em] text-xs uppercase">منصة تبادل الزيارات - BLIDA 09</p>
      </header>

      <main className="max-w-2xl mx-auto">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 mb-10 text-center backdrop-blur-md shadow-2xl shadow-blue-900/20">
          <p className="text-blue-400 text-[10px] font-black uppercase mb-1 tracking-widest">إجمالي الزيارات الحقيقية</p>
          <span className="text-5xl font-black text-white">{views.toLocaleString()}</span>
        </div>

        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-12">
          <h2 className="text-xl font-bold mb-6 text-center text-blue-300 underline decoration-blue-500/30 underline-offset-8">أنشر رابطك الآن 🚀</h2>
          <form onSubmit={handlePublish} className="space-y-4">
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all" placeholder="الاسم المستعار" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all" placeholder="عنوان الإعلان" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input required type="url" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all" placeholder="الرابط https://..." value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
            <button className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/50 transition-all active:scale-95">نشر في الجدار</button>
          </form>
        </section>

        <div className="space-y-5">
          <div className="flex justify-between items-center px-2 mb-4">
            <h2 className="text-2xl font-black">آخر الإعلانات</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
               <span className="text-green-400 text-[10px] font-bold">مباشر</span>
            </div>
          </div>
          
          {ads.map((ad) => (
            <a key={ad.id} href={ad.ad_link} target="_blank" className="group block bg-white/5 border-r-4 border-r-blue-600 border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:translate-x-[-5px] transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-black text-sm">@{ad.user_name}</span>
                <span className="text-white/20 text-[10px]">{new Date(ad.created_at).toLocaleTimeString('ar-DZ')}</span>
              </div>
              <h3 className="text-lg font-bold text-white/90 group-hover:text-blue-300">{ad.ad_title}</h3>
              <p className="text-blue-500 text-xs mt-3 font-bold opacity-0 group-hover:opacity-100 transition-opacity italic">انقر لزيارة الموقع ←</p>
            </a>
          ))}
        </div>
      </main>

      <style jsx global>{`
        @keyframes shine { to { background-position: 200% center; } }
        .animate-shine { animation: shine 4s linear infinite; }
      `}</style>
    </div>
  );
}
