import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1); 
  const [visitedCount, setVisitedCount] = useState(0);
  const [clickedLinks, setClickedLinks] = useState(new Set());

  const myAds = [
    { id: "a1", title: "متجر أنفال - Anfel Store", url: "https://anfelstore.myecomsite.net/xfam8EKdg/8WNYmFCd6" },
    { id: "a2", title: "Dymas Shopping - ديماس شوبينغ", url: "https://dymasshopping.flexdz.store/products/details/6979254d749bf018b1a27c91" },
    { id: "a3", title: "DZ-New Store - منتج الشيب", url: "https://dz-new.store/products/%D8%A7%D9%84%D8%AD%D9%84" },
    { id: "a4", title: "LuxePhoneDZ - لوكس فون", url: "https://luxephonedz.com/products/starlight-alpha-100" },
    { id: "a5", title: "TeymShop - آلة البطاطس", url: "https://teymshop.store/products/machine-pomme-de-terre" }
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
    <div className="min-h-screen bg-black text-blue-400 p-4" dir="rtl">
      <div className="max-w-md mx-auto py-10">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-black text-blue-600 italic">TRAFFIC-DZ</h1>
          <p className="text-gray-500 text-xs mt-2">BLIDA 09 - منصة تبادل الزيارات</p>
        </header>

        {step === 1 ? (
          <div className="bg-gray-900 p-8 rounded-3xl border border-blue-900 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 underline decoration-blue-600">1. معلومات الإعلان</h2>
            <div className="space-y-4">
              <input type="text" placeholder="الاسم المستعار" className="w-full p-4 bg-black border border-blue-900 rounded-2xl outline-none" />
              <input type="text" placeholder="عنوان الإعلان" className="w-full p-4 bg-black border border-blue-900 rounded-2xl outline-none" />
              <input type="url" placeholder="الرابط :https//..." className="w-full p-4 bg-black border border-blue-900 rounded-2xl outline-none" />
              <button onClick={() => setStep(2)} className="w-full p-4 bg-blue-600 text-white font-bold rounded-2xl">
                التالي: تفعيل النشر
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 p-8 rounded-3xl border border-green-900 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">2. تفعيل الإعلان</h2>
            <p className="text-gray-400 text-sm mb-6">زر 5 روابط لنشر إعلانك:</p>
            <div className="space-y-3 mb-8">
              {myAds.map((ad) => (
                <button key={ad.id} onClick={() => handleVisit(ad.id, ad.url)} className={`w-full p-4 text-right rounded-2xl border flex justify-between items-center ${clickedLinks.has(ad.id) ? 'border-green-600 text-green-400' : 'border-blue-900 bg-black'}`}>
                  <span>{ad.title}</span>
                  <span>{clickedLinks.has(ad.id) ? '✓' : 'زيارة'}</span>
                </button>
              ))}
            </div>
            <button disabled={visitedCount < 5} className={`w-full p-4 rounded-2xl font-bold ${visitedCount >= 5 ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
              {visitedCount >= 5 ? "انشر الآن" : `باقي ${5 - visitedCount} زيارات`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
