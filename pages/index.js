import { useState } from "react";

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [clickedLinks, setClickedLinks] = useState(new Set());

  const myAds = [
    { id: "a1", title: "متجر أنفال - أفضل العروض المنزلية", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "a2", title: "Dymas Shopping - تسوق أحدث الصيحات", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "a3", title: "DZ-New Store - منتجات العناية الطبيعية", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "a4", title: "LuxePhoneDZ - عالم الهواتف الذكية", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "a5", title: "TeymShop - أدوات المطبخ العصرية", url: "https://teymshop.store/products/machine-pomme-de-terre" }
  ];

  const handleVisit = (id, url) => {
    window.open(url, "_blank");
    if (!clickedLinks.has(id)) {
      const newClicked = new Set(clickedLinks).add(id);
      setClickedLinks(newClicked);
      setVisitedCount(newClicked.size);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">TRAFFIC<span className="text-slate-800">-DZ</span></h1>
          {!isRegistered && (
            <button onClick={() => setIsRegistered(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md">
              تسجيل الدخول
            </button>
          )}
        </div>
      </nav>

      {!isRegistered ? (
        /* --- الصفحة الرئيسية (Landing Page) --- */
        <main>
          <section className="py-16 px-4 text-center bg-gradient-to-b from-white to-slate-100">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              انشر إعلانك <span className="text-blue-600">مجاناً</span> <br/> بلمسة واحدة
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
              أول منصة جزائرية لتبادل الزيارات الحقيقية. ادعم المجتمع بزيارة 5 إعلانات، واحصل على زوار لمتجرك مجاناً كل 24 ساعة.
            </p>
            <button onClick={() => setIsRegistered(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-transform">
              ابدأ الآن مجاناً
            </button>
          </section>

          <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold mb-2">الشروط والأحكام</h3>
              <p className="text-slate-500 leading-relaxed">الالتزام بزيارة 5 روابط يومياً هو مفتاح بقاء إعلانك نشطاً. نمنع الروابط المضللة تماماً.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold mb-2">ماذا نقدم؟</h3>
              <p className="text-slate-500 leading-relaxed">زيارات حقيقية 100% من مستخدمين مثلك. زيادة في ترتيب موقعك في محركات البحث وتفاعل أكبر.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold mb-2">دورة النشر</h3>
              <p className="text-slate-500 leading-relaxed">بإمكانك نشر إعلان جديد كل 24 ساعة. هذا يضمن لجميع الأعضاء فرصة عادلة في الظهور.</p>
            </div>
          </section>
        </main>
      ) : (
        /* --- واجهة العمل (Dashboard) --- */
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white shadow-2xl rounded-[2rem] border border-slate-100 overflow-hidden">
            <div className="bg-blue-600 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">لوحة تحكم المعلن</h2>
              <p className="text-blue-100 text-sm mt-1">أكمل المهمة البسيطة لنشر إعلانك</p>
            </div>

            <div className="p-8">
              <h3 className="text-lg font-bold mb-4 text-slate-800">الخطوة الأولى: قم بزيارة 5 إعلانات</h3>
              <div className="grid gap-3 mb-8">
                {myAds.map((ad) => (
                  <button 
                    key={ad.id} 
                    onClick={() => handleVisit(ad.id, ad.url)}
                    className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all font-bold ${
                      clickedLinks.has(ad.id) 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <span>{ad.title}</span>
                    <span className={`px-3 py-1 rounded-md text-xs ${clickedLinks.has(ad.id) ? 'bg-green-200' : 'bg-blue-600 text-white'}`}>
                      {clickedLinks.has(ad.id) ? 'تمت الزيارة ✓' : 'زيارة الإعلان'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-8 p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>مستوى التفعيل</span>
                  <span>{visitedCount} / 5</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${visitedCount * 20}%` }}></div>
                </div>
              </div>

              {/* Form */}
              <div className={`space-y-4 ${visitedCount < 5 ? 'opacity-30 grayscale pointer-events-none' : 'animate-bounce-in'}`}>
                <h3 className="text-lg font-bold text-slate-800">الخطوة الثانية: تفاصيل إعلانك</h3>
                <input type="text" placeholder="اسمك المستعار" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="عنوان الإعلان (مثلاً: خصومات 50%)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="url" placeholder="رابط موقعك أو متجرك" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg shadow-lg hover:bg-blue-700 transition-colors">
                  نشر الإعلان الآن
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="py-8 text-center text-slate-400 text-sm">
        جميع الحقوق محفوظة © {new Date().getFullYear()} TRAFFIC-DZ - MisterAI
      </footer>
    </div>
  );
}
