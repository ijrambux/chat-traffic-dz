import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

// ربط Supabase (تأكد من استبدال المفاتيح إذا تغيرت)
const supabase = createClient(
  'https://rhhdvcatxfebxugcdlua.supabase.co',
  'YOUR_ANON_KEY_HERE' // ضع هنا مفتاح anon public key الخاص بك من Supabase
);

export default function TrafficDZ() {
  const [ads, setAds] = useState([]);
  const [views, setViews] = useState(0);
  const [formData, setFormData] = useState({ name: '', title: '', link: '' });
  const [loading, setLoading] = useState(false);

  // 1. جلب البيانات وتحديث العداد
  useEffect(() => {
    fetchAds();
    updateAndFetchViews();
    
    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(fetchAds, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAds = async () => {
    const { data } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAds(data);
  };

  const updateAndFetchViews = async () => {
    // جلب العداد الحالي
    const { data: currentStats } = await supabase.from('stats').select('views').eq('id', 1).single();
    if (currentStats) {
      const newCount = currentStats.views + 1;
      // تحديث العداد (+1)
      await supabase.from('stats').update({ views: newCount }).eq('id', 1);
      setViews(newCount);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('ads').insert([
      { user_name: formData.name, ad_title: formData.title, ad_link: formData.link }
    ]);
    if (!error) {
      setFormData({ name: '', title: '', link: '' });
      fetchAds();
      alert("✅ تم نشر إعلانك بنجاح في جدار موزاية!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans dir-rtl" dir="rtl">
      <Head>
        <title>TrafficDZ | منصة تبادل الزيارات</title>
      </Head>

      {/* Header مع الشعار المتحرك اللامع */}
      <header className="py-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/20 blur-[120px]"></div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-4 animate-pulse tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-200 to-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]">
            TRAFFIC DZ
          </span>
        </h1>
        <p className="text-blue-300/80 font-medium tracking-[0.2em] text-sm">مستقبل تبادل الزيارات في الجزائر</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20">
        
        {/* قسم العداد الاحترافي */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-3xl p-6 text-center backdrop-blur-sm">
            <p className="text-blue-400 text-xs font-bold uppercase mb-2">إجمالي الزيارات</p>
            <span className="text-4xl font-black text-white">{views.toLocaleString()}</span>
          </div>
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-3xl p-6 text-center backdrop-blur-sm">
            <p className="text-indigo-400 text-xs font-bold uppercase mb-2">إعلانات نشطة</p>
            <span className="text-4xl font-black text-white">{ads.length}</span>
          </div>
        </div>

        {/* نموذج النشر المتطور */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mb-16 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 text-center">🚀 أنشر إعلانك مجاناً</h2>
          <form onSubmit={handlePublish} className="space-y-4">
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all"
              placeholder="اسمك المستعار"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all"
              placeholder="عنوان الإعلان (مثال: اشترك في قناتي)"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <input 
              required
              type="url"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all"
              placeholder="رابط الموقع أو القناة (https://...)"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              {loading ? 'جاري النشر...' : 'نشر الإعلان الآن'}
            </button>
          </form>
        </section>

        {/* جدار الإعلانات الاحترافي */}
        <section>
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-2xl font-black tracking-tight">جدار الإعلانات</h2>
            <span className="bg-green-500/20 text-green-400 text-[10px] px-3 py-1 rounded-full font-bold border border-green-500/30 animate-pulse">مباشر الآن</span>
          </div>
          
          <div className="space-y-4">
            {ads.map((ad) => (
              <a 
                key={ad.id} 
                href={ad.ad_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden shadow-sm"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-blue-400 text-sm font-bold">@{ad.user_name}</span>
                    <span className="text-white/30 text-[10px]">{new Date(ad.created_at).toLocaleTimeString('ar-DZ')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white/90 group-hover:text-blue-300 transition-colors">{ad.ad_title}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* تذييل الصفحة */}
      <footer className="text-center py-10 border-t border-white/5 mt-10">
        <p className="text-white/40 text-sm italic">صنع بكل ❤️ في موزاية بواسطة MisterAI</p>
      </footer>

      <style jsx global>{`
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
