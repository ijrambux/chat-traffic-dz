import { useState, useEffect } from "react";

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [lastPostDate, setLastPostDate] = useState(null);

  const myAds = [
    { id: "a1", title: "Anfel Store - متجر أنفال", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "a2", title: "Dymas Shopping - ديماس شوبينغ", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "a3", title: "DZ-New Store - منتج الشيب", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "a4", title: "LuxePhoneDZ - لوكس فون", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "a5", title: "TeymShop - آلة البطاطس", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30" dir="rtl">
      {/* 1. Landing Page (الصفحة الاحترافية) */}
      {!isRegistered ? (
        <main className="max-w-6xl mx-auto px-6 py-20">
          <nav className="flex justify-between items-center mb-16">
            <h1 className="text-2xl font-black tracking-tighter text-blue-500">TRAFFIC<span className="text-white">-DZ</span></h1>
            <button onClick={() => setIsRegistered(true)} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">دخول / تسجيل</button>
          </nav>

          <section className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">أكبر مجتمع لتبادل <span className="text-blue-600">الزيارات</span> الحقيقية.</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">زد مبيعاتك، وسع جمهورك، وانشر إعلانك مجاناً مقابل دعم مجتمعنا. نظام عادل، بسيط، وفعال.</p>
          </section>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-all">
              <h3 className="text-blue-500 font-bold mb-2">01. الشروط والأحكام</h3>
              <p className="text-sm text-gray-500">يجب زيارة 5 إعلانات على الأقل لنشر إعلانك الخاص. الروابط المشبوهة تؤدي للحظر.</p>
            </div>
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-all">
              <h3 className="text-blue-500 font-bold mb-2">02. كيف يعمل؟</h3>
              <p className="text-sm text-gray-500">كل مستخدم جديد يزور 5 إعلانات من سبقوه، مما يضمن لك تدفقاً مستمراً من الزوار الحقيقيين.</p>
            </div>
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-all">
              <h3 className="text-blue-500 font-bold mb-2">03. التكرار اليومي</h3>
              <p className="text-sm text-gray-500">يسمح بنشر إعلان واحد كل 24 ساعة لضمان الجودة ومنع "السبام".</p>
            </div>
          </div>
        </main>
      ) : (
        /* 2. Dashboard (واجهة العمل بعد التسجيل) */
        <main className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-bold">لوحة التحكم</h2>
                <p className="text-xs text-gray-500">مرحباً MisterAI، جاهز لنشر إعلانك اليوم؟</p>
              </div>
              <button onClick={() => setIsRegistered(false)} className="text-xs text-gray-600 underline">خروج</button>
            </header>

            <div className="space-y-4 mb-8">
                <p className="text-sm text-blue-400 mb-2">المهمة الحالية: زُر 5 إعلانات لفتح "زر النشر"</p>
                {myAds.map((ad, index) => (
                  <button key={index} onClick={() => { window.open(ad.url); setVisitedCount(prev => Math.min(prev + 1, 5)) }} className="w-full flex justify-between p-4 bg-black/50 border border-white/5 rounded-2xl hover:border-blue-500 transition-all">
                    <span>{ad.title}</span>
                    <span className="text-xs opacity-50">زيارة →</span>
                  </button>
                ))}
            </div>

            <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 mb-8">
              <div className="flex justify-between text-xs mb-2">
                <span>التقدم</span>
                <span>{visitedCount} / 5</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{width: `${visitedCount * 20}%`}}></div>
              </div>
            </div>

            <form className={`space-y-4 ${visitedCount < 5 ? 'opacity-20 pointer-events-none' : ''}`}>
              <input type="text" placeholder="عنوان إعلانك" className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-blue-600" />
              <input type="url" placeholder="الرابط المباشر" className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-blue-600" />
              <button className="w-full py-4 bg-blue-600 rounded-2xl font-black shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] transition-transform">
                نشر الإعلان (صلاحية 24 ساعة)
              </button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}
