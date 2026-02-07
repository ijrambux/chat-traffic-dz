import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDg4OTQsImV4cCI6MjA4NTkyNDg5NH0.12qmM8PcddSAxH7TQXj44Ez1F5WATQ6ve8Q_vvmJzqg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const [timer, setTimer] = useState(30);
  const [activeAd, setActiveAd] = useState(null);
  const [ads, setAds] = useState([]);

  const staticAdUrl = "https://otieu.com/4/10578997";

  useEffect(() => {
    checkUser();
    fetchAds();
  }, []);

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
    setAds(data || []);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = authStep === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (result.error) alert("خطأ: " + result.error.message);
    else if (authStep === "login") { setUser(result.data.user); fetchProfile(result.data.user.id); }
    else alert("تم! تفقد بريدك الإلكتروني");
    setLoading(false);
  };

  const startAd = (url, type, adId = null) => {
    const now = new Date().getTime();
    const lastClick = localStorage.getItem(`last_click_${adId || 'static'}`);
    
    if (type === 'static' && lastClick && now - lastClick < 24 * 60 * 60 * 1000) {
      alert(`عذراً! هذا الإعلان متاح مرة كل 24 ساعة.`);
      return;
    }

    setActiveAd({ url, type, adId });
    setTimer(30);
    setStep(3);
    window.open(url, "_blank");
  };

  const handleReward = async () => {
    const reward = activeAd.type === 'static' ? 0.50 : 0.25; 
    const newBalance = userBalance + reward;
    const { error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
    
    if (!error) {
      if (activeAd.type === 'static') {
        localStorage.setItem(`last_click_${activeAd.adId || 'static'}`, new Date().getTime().toString());
      }
      setUserBalance(newBalance);
      setStep(1);
    }
  };

  // --- واجهة العداد المحترفة ---
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] z-[100] flex items-center justify-center p-6 text-white font-sans" dir="rtl">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[3rem] blur opacity-25 animate-pulse"></div>
          <div className="relative bg-white text-slate-900 p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
            <div className="text-7xl font-black bg-gradient-to-br from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-4">{timer}</div>
            <h2 className="text-xl font-bold mb-2">جاري التحقق من الأمان</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">ستحصل على {activeAd.type === 'static' ? '0.50' : '0.25'} دج فور انتهاء الوقت</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-1000 ease-linear" style={{ width: `${(30 - timer) / 30 * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- واجهة تسجيل الدخول ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans" dir="rtl">
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-slate-100">
          <div className="text-center mb-10">
             <div className="inline-block p-4 bg-blue-50 rounded-3xl mb-4">
                <span className="text-3xl">🇩🇿</span>
             </div>
             <h1 className="text-3xl font-black text-slate-800 tracking-tight">TRAFFIC-DZ</h1>
             <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Premium PTC Platform</p>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8">
            <button onClick={() => setAuthStep("login")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${authStep === "login" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>دخول</button>
            <button onClick={() => setAuthStep("signup")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${authStep === "signup" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>تسجيل</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" onChange={e => setPassword(e.target.value)} required />
            <button className="w-full py-5 bg-[#1e293b] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-all transform active:scale-95">
              {authStep === "login" ? "تسجيل الدخول" : "إنشاء حساب مجاني"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- الواجهة الرئيسية المحترفة ---
  return (
    <div className="min-h-screen bg-[#fbfcfd] font-sans" dir="rtl">
      {/* Navbar العصري */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">TRAFFIC<span className="text-blue-600">-DZ</span></h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
                <span className="text-emerald-600 font-black text-sm">{userBalance.toFixed(2)} دج</span>
             </div>
             <button onClick={() => supabase.auth.signOut()} className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4 space-y-8 pb-24">
        
        {/* بطاقة الترحيب والإعلان */}
        <div className="relative group mt-4">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
           <div className="relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
              <h3 className="text-xl font-black text-slate-800 mb-2">منصة المعلنين 📢</h3>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">روّج لموقعك أو صفحتك بأسعار تبدأ من 500 دج لـ 1000 زيارة حقيقية من الجزائر.</p>
              <a href="https://t.me/YOUR_TELEGRAM" target="_blank" className="flex items-center justify-center gap-2 bg-[#1e293b] text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-600 transition-all w-max">
                اتصل بنا لتفعيل إعلانك
              </a>
           </div>
        </div>

        {/* شبكة الإعلانات الثابتة */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">إعلانات ثابتة VIP</h2>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">تتجدد يومياً</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <button 
                key={i} 
                onClick={() => startAd(staticAdUrl, 'static', `st_${i}`)}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group text-right"
              >
                <div className="bg-blue-50 w-10 h-10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-lg">💎</div>
                <p className="font-black text-slate-800 text-sm">إعلان مميز {i}</p>
                <p className="text-blue-600 font-bold text-[10px] mt-1">المكافأة: 0.50 دج</p>
              </button>
            ))}
          </div>
        </div>

        {/* الإعلانات المدفوعة */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-800 px-2 uppercase tracking-widest">إعلانات المعلنين</h2>
          <div className="space-y-3">
            {ads.length > 0 ? ads.map((ad) => (
              <button 
                key={ad.id} 
                onClick={() => startAd(ad.url, 'paid', ad.id)}
                className="w-full bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all group text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-emerald-50 transition-colors text-lg">⚡</div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm tracking-tight">{ad.title}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">زيارة حقيقية</p>
                  </div>
                </div>
                <div className="bg-emerald-50 px-3 py-1.5 rounded-full">
                  <span className="text-emerald-600 font-black text-[10px]">+ 0.25 دج</span>
                </div>
              </button>
            )) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
                <p className="text-slate-400 font-bold text-xs italic tracking-tight">لا توجد إعلانات مدفوعة حالياً..</p>
              </div>
            )}
          </div>
        </div>

        {/* قسم السحب النهائي */}
        <div className="pt-10">
           <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">رصيدك القابل للسحب</p>
                <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">{userBalance.toFixed(2)} دج</h2>
                <button 
                  disabled={userBalance < 500}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${userBalance >= 500 ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                >
                  {userBalance >= 500 ? "طلب السحب (بريدي موب)" : "الحد الأدنى للسحب 500 دج"}
                </button>
              </div>
              {/* زخرفة خلفية */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-20"></div>
           </div>
        </div>
      </main>

      {/* Footer بسيط */}
      <footer className="max-w-xl mx-auto p-8 text-center border-t border-slate-100">
        <p className="text-slate-300 font-black text-[9px] uppercase tracking-[0.4em]">TRAFFIC-DZ &copy; 2026</p>
      </footer>
    </div>
  );
}
