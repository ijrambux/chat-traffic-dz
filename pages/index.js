import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// إعدادات قاعدة البيانات Supabase
const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDg4OTQsImV4cCI6MjA4NTkyNDg5NH0.12qmM8PcddSAxH7TQXj44Ez1F5WATQ6ve8Q_vvmJzqg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // --- حالات المستخدم والأمان ---
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState("login"); // login أو signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- حالات الموقع الرئيسية ---
  const [step, setStep] = useState(1); // 1: الرئيسية، 2: المتجر، 3: العداد
  const [allAds, setAllAds] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [timer, setTimer] = useState(30);
  const [activeAd, setActiveAd] = useState(null);

  useEffect(() => {
    checkUser();
    fetchAds();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // --- منطق العداد والربح التلقائي ---
  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && activeAd) {
      handleReward();
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      fetchProfile(session.user.id);
    }
  };

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('balance').eq('id', uid).single();
    if (data) setUserBalance(data.balance);
  };

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    setAllAds(data || []);
  };

  // --- وظائف التسجيل والدخول ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;
    if (authStep === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error) alert("تفقد بريدك الإلكتروني لتأكيد الحساب!");
    }

    if (result.error) alert("خطأ: " + result.error.message);
    else if (authStep === "login") {
      setUser(result.data.user);
      fetchProfile(result.data.user.id);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  // --- وظائف الإعلانات والربح ---
  const startAd = (ad) => {
    setActiveAd(ad);
    setTimer(30);
    setStep(3);
    window.open(ad.url, "_blank"); // فتح الإعلان في نافذة جديدة لضمان عمل فيسبوك/تليجرام
  };

  const handleReward = async () => {
    const rewardAmount = 5.00; // 5 دج لكل إعلان
    const newBalance = userBalance + rewardAmount;
    
    const { error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
    
    if (!error) {
      setUserBalance(newBalance);
      setStep(1);
      alert(`مبروك! ربحت ${rewardAmount} دج رصيد إضافي.`);
    }
  };

  // --- واجهة العداد التنازلي (Step 3) ---
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-slate-900">
          <div className="text-6xl font-black text-blue-600 mb-4 animate-bounce">{timer}</div>
          <h2 className="text-xl font-black mb-2">جاري احتساب الأرباح...</h2>
          <p className="text-slate-500 font-bold text-sm mb-6">يرجى مشاهدة الإعلان في النافذة الأخرى. سنعيدك تلقائياً عند انتهاء الوقت.</p>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${(30 - timer) / 30 * 100}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  // --- واجهة تسجيل الدخول والاشتراك ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans" dir="rtl">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-blue-600 mb-2 tracking-tighter animate-pulse">TRAFFIC-DZ</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase">المنصة الجزائرية الأولى للربح والزيارات</p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button onClick={() => setAuthStep("login")} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${authStep === "login" ? "bg-white text-blue-600 shadow-md" : "text-slate-500"}`}>دخول</button>
            <button onClick={() => setAuthStep("signup")} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${authStep === "signup" ? "bg-white text-blue-600 shadow-md" : "text-slate-500"}`}>حساب جديد</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" onChange={e => setPassword(e.target.value)} required />
            <button disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
              {loading ? "جاري المعالجة..." : authStep === "login" ? "دخول إلى المحفظة 🔓" : "ابدأ جني الأرباح 🚀"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- الواجهة الرئيسية للموقع ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" dir="rtl">
      {/* Navbar المحترف */}
      <nav className="p-4 bg-white border-b-2 border-blue-600 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black text-blue-700">TRAFFIC-DZ</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">بكل فخر.. صُنع في الجزائر 🇩🇿</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 font-black text-blue-700 shadow-sm">
            {userBalance.toFixed(2)} دج
          </div>
          <button onClick={handleLogout} className="text-[10px] font-black text-red-500 bg-red-50 p-2 rounded-lg">خروج</button>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4 flex-grow w-full mt-4">
        {step === 1 ? (
          <div className="space-y-5">
            {/* بطاقة الترحيب */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-slate-400">مرحباً بك مجدداً</p>
                <p className="font-black text-slate-800">تصفح الإعلانات واجمع رصيدك</p>
              </div>
              <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-md active:scale-95">شراء زيارات 📈</button>
            </div>

            {/* قائمة الإعلانات */}
            <h2 className="text-sm font-black text-slate-500 mr-2 uppercase tracking-widest">إعلانات نشطة (5 دج/إعلان)</h2>
            <div className="space-y-3">
              {allAds.map((ad, i) => (
                <div key={ad.id || i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-500 transition-all cursor-pointer group" onClick={() => startAd(ad)}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-lg group-hover:text-blue-600">{ad.title}</h3>
                    <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-black">+ 5.00 دج</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">بواسطة: {ad.name}</p>
                </div>
              ))}
            </div>

            {/* الدعم الفني */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-2 border-slate-50 mt-10">
              <h3 className="text-lg font-black text-slate-800 mb-2">الدعم الفني والارتقاء 💬</h3>
              <p className="text-slate-400 font-bold text-xs mb-6 px-4">لسحب الأرباح عبر بريدي موب أو الاستفسار عن حملاتك الإعلانية</p>
              <a href="https://t.me/YOUR_TELEGRAM" target="_blank" className="flex items-center justify-center gap-3 bg-[#229ED9] text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-[#229ed966] transition-all active:scale-95">
                تواصل معنا عبر تليجرام
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom border border-blue-50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">متجر الزيارات 📦</h2>
              <button onClick={() => setStep(1)} className="text-slate-300 font-black text-xl hover:text-slate-800">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-slate-800">باقة 1,000 زيارة</h4>
                    <p className="text-[10px] font-bold text-blue-600">زيارات حقيقية 100%</p>
                  </div>
                  <p className="font-black text-xl text-slate-800">500 دج</p>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-[2rem] border-2 border-blue-400 relative">
                <span className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full">الأكثر طلباً 🔥</span>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-slate-800">باقة 5,000 زيارة</h4>
                    <p className="text-[10px] font-bold text-blue-600">مثالية لقنوات اليوتيوب</p>
                  </div>
                  <p className="font-black text-xl text-slate-800">2,000 دج</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-yellow-50 rounded-[1.5rem] border border-yellow-100">
              <p className="text-[11px] font-bold text-yellow-800 leading-relaxed">
                🔴 <span className="underline">طريقة الشراء:</span> أرسل مبلغ الباقة إلى حسابنا بريدي موب، ثم راسلنا بصورة الوصل ورابط موقعك عبر التليجرام.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="p-10 text-center">
        <div className="flex justify-center gap-3 mb-4 opacity-50">
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
          <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
        </div>
        <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest leading-loose">
          TRAFFIC-DZ &copy; 2026 | نظام محمي بالكامل <br/>
          MADE WITH ❤️ IN ALGERIA
        </p>
      </footer>
    </div>
  );
}
