import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// إعدادات الاتصال
const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDg4OTQsImV4cCI6MjA4NTkyNDg5NH0.12qmM8PcddSAxH7TQXj44Ez1F5WATQ6ve8Q_vvmJzqg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // --- States ---
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Main, 3: Timer
  const [userBalance, setUserBalance] = useState(0);
  const [timer, setTimer] = useState(30);
  const [activeAd, setActiveAd] = useState(null);
  const [ads, setAds] = useState([]);

  const staticAdUrl = "https://otieu.com/4/10578997";

  // --- Initial Load ---
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    };
    getSession();
    fetchAds();
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && activeAd) {
      handleReward();
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // --- Functions ---
  const fetchProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('balance').eq('id', uid).single();
    if (data) setUserBalance(data.balance);
  };

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    setAds(data || []);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (authStep === "login") {
      res = await supabase.auth.signInWithPassword({ email, password });
    } else {
      res = await supabase.auth.signUp({ email, password, options: { data: { name: email.split('@')[0] } } });
    }

    if (res.error) alert(res.error.message);
    else if (authStep === "login") {
      setUser(res.data.user);
      fetchProfile(res.data.user.id);
    } else {
      alert("تم التسجيل! سجل دخولك الآن.");
      setAuthStep("login");
    }
    setLoading(false);
  };

  const startAd = (url, type, adId = null) => {
    const lastClick = localStorage.getItem(`click_${adId || 'static'}`);
    const now = Date.now();
    if (type === 'static' && lastClick && now - lastClick < 86400000) {
      alert("هذا الإعلان متاح مرة كل 24 ساعة.");
      return;
    }
    setActiveAd({ url, type, adId });
    setTimer(30);
    setStep(3);
    window.open(url, "_blank");
  };

  const handleReward = async () => {
    const reward = activeAd.type === 'static' ? 0.50 : 0.25;
    const { error } = await supabase.from('profiles').update({ balance: userBalance + reward }).eq('id', user.id);
    if (!error) {
      if (activeAd.type === 'static') localStorage.setItem(`click_${activeAd.adId}`, Date.now().toString());
      setUserBalance(prev => prev + reward);
      setStep(1);
      alert(`تم إضافة ${reward} دج`);
    }
  };

  // --- Views ---

  // 1. Timer View
  if (step === 3) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans" dir="rtl">
      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-blue-500/20 shadow-2xl text-center max-w-sm w-full">
        <div className="text-7xl font-black text-blue-500 mb-6 animate-pulse">{timer}</div>
        <h2 className="text-xl font-bold mb-2 text-white">جاري معالجة الطلب...</h2>
        <p className="text-slate-400 text-xs mb-8">ابقَ في صفحة الإعلان للحصول على المكافأة.</p>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear" style={{ width: `${(30-timer)/30*100}%` }}></div>
        </div>
      </div>
    </div>
  );

  // 2. Auth View (Login/Signup)
  if (!user) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans text-right" dir="rtl">
      <div className="bg-[#0f172a] p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TRAFFIC<span className="text-blue-500">-DZ</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">The King of PTC in Algeria</p>
        </div>
        <div className="flex bg-[#020617] p-1.5 rounded-2xl mb-8 border border-slate-800">
          <button onClick={() => setAuthStep("login")} className={`flex-1 py-3 rounded-xl font-bold text-sm ${authStep === "login" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500"}`}>دخول</button>
          <button onClick={() => setAuthStep("signup")} className={`flex-1 py-3 rounded-xl font-bold text-sm ${authStep === "signup" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500"}`}>تسجيل</button>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" onChange={e => setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all">
            {loading ? "جاري التحميل..." : authStep === "login" ? "تسجيل الدخول" : "فتح حساب جديد"}
          </button>
        </form>
      </div>
    </div>
  );

  // 3. Main Dashboard View
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans text-right pb-10" dir="rtl">
      {/* Header */}
      <nav className="p-5 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black text-white tracking-tighter">TRAFFIC<span className="text-blue-500">-DZ</span></h1>
        <div className="bg-blue-600/10 border border-blue-500/30 px-5 py-2 rounded-2xl font-black text-blue-400">
          {userBalance.toFixed(2)} دج
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">أعلن لدينا الآن 🚀</h3>
            <p className="text-xs font-bold text-white/70 mb-5 leading-relaxed">احصل على آلاف الزيارات لموقعك بأسعار تبدأ من 500 دج فقط.</p>
            <a href="https://t.me/YOUR_TELEGRAM" target="_blank" className="inline-block bg-white text-blue-700 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg uppercase tracking-wider">تواصل تليجرام</a>
          </div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
        </div>

        {/* Static Ads (0.50 DA) */}
        <section>
          <div className="flex justify-between items-center px-2 mb-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">إعلانات VIP (0.50 دج)</h2>
            <div className="h-px bg-slate-800 flex-grow mr-4"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} onClick={() => startAd(staticAdUrl, 'static', `vip_${i}`)} className="bg-[#0f172a] p-6 rounded-[2rem] border border-blue-500/20 hover:border-blue-500 shadow-sm transition-all text-center cursor-pointer group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💎</div>
                <p className="font-black text-xs text-slate-300">إعلان ثابت {i}</p>
                <span className="text-[10px] text-blue-500 font-bold mt-1 inline-block">24 ساعة</span>
              </div>
            ))}
          </div>
        </section>

        {/* Paid Ads (0.25 DA) */}
        <section>
          <div className="flex justify-between items-center px-2 mb-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">إعلانات المعلنين (0.25 دج)</h2>
            <div className="h-px bg-slate-800 flex-grow mr-4"></div>
          </div>
          <div className="space-y-3">
            {ads.length > 0 ? ads.map((ad) => (
              <div key={ad.id} onClick={() => startAd(ad.url, 'paid', ad.id)} className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 flex justify-between items-center cursor-pointer hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-lg">⚡</div>
                  <h4 className="font-bold text-sm text-slate-200">{ad.title}</h4>
                </div>
                <span className="text-blue-500 font-black text-[10px] bg-blue-500/5 px-3 py-1.5 rounded-full">+ 0.25 دج</span>
              </div>
            )) : (
              <div className="bg-[#0f172a] border border-dashed border-slate-800 rounded-3xl p-10 text-center text-slate-600 text-xs font-bold italic">لا توجد إعلانات مدفوعة حالياً..</div>
            )}
          </div>
        </section>

        {/* Withdrawal Section */}
        <section className="pt-10">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 text-center shadow-inner">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">الحد الأدنى للسحب: 500 دج</p>
            <button 
              disabled={userBalance < 500} 
              className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${userBalance >= 500 ? 'bg-green-600 text-white shadow-xl hover:bg-green-500' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
            >
              {userBalance >= 500 ? "سحب الأرباح 🏦" : "رصيد غير كافٍ"}
            </button>
            <p className="mt-4 text-[10px] text-slate-600 font-bold">يتم الدفع عبر بريدي موب خلال 24 ساعة.</p>
          </div>
        </section>

        {/* Footer Rights */}
        <footer className="pt-10 text-center">
          <div className="h-px bg-slate-800 mb-6 w-1/2 mx-auto"></div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">TRAFFIC-DZ | ALGERIA</p>
          <p className="text-[9px] font-bold text-slate-700 leading-relaxed">جميع الحقوق محفوظة 2026 &copy; المنصة الجزائرية الأولى لتبادل الزيارات والأرباح.</p>
        </footer>
      </main>
    </div>
  );
}
