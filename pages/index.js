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

    if (result.error) alert(result.error.message);
    else if (authStep === "login") { setUser(result.data.user); fetchProfile(result.data.user.id); }
    else alert("تأكد من بريدك الإلكتروني لتفعيل الحساب");
    setLoading(false);
  };

  const handleReward = async () => {
    const reward = 1.00; // 1 دج لكل إعلان
    const { error } = await supabase.from('profiles').update({ balance: userBalance + reward }).eq('id', user.id);
    if (!error) {
      setUserBalance(prev => prev + reward);
      setStep(1);
      alert("✅ تمت إضافة 1 دج إلى رصيدك");
    }
  };

  // --- واجهة العداد ---
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex items-center justify-center p-6 text-white font-sans" dir="rtl">
        <div className="bg-white text-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
          <div className="text-6xl font-black text-blue-600 mb-4">{timer}</div>
          <h2 className="text-xl font-black mb-2">جاري احتساب الرصيد</h2>
          <p className="text-slate-400 font-bold text-sm mb-6">شاهد الإعلان المفتوح، سنعيدك تلقائياً بعد انتهاء الوقت.</p>
        </div>
      </div>
    );
  }

  // --- واجهة البداية الاحترافية ---
  if (!user && authStep === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
        <nav className="p-6 bg-white flex justify-between items-center border-b border-slate-100">
          <h1 className="text-2xl font-black text-blue-600">TRAFFIC-DZ</h1>
          <button onClick={() => setAuthStep("login")} className="bg-blue-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-md">دخول</button>
        </nav>

        <header className="py-20 px-6 text-center">
          <h2 className="text-4xl font-black text-slate-800 mb-6 leading-tight">أول منصة PTC جزائرية <br/>بأرباح حقيقية 🇩🇿</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
              <p className="text-blue-600 font-black">1 دج</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">لكل نقرة</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
              <p className="text-blue-600 font-black">500 دج</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">الحد أدنى للسحب</p>
            </div>
          </div>
          <button onClick={() => setAuthStep("signup")} className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl transition-transform hover:scale-105">إنشاء حساب وابدأ الربح</button>
        </header>

        <section className="max-w-4xl mx-auto px-6 py-10 border-t border-slate-200">
          <h3 className="text-xl font-black mb-6">قوانين المنصة ⚖️</h3>
          <ul className="space-y-4 text-slate-500 font-bold text-sm leading-relaxed">
            <li>• يمنع استخدام الـ VPN أو البرامج التلقائية (حظر نهائي).</li>
            <li>• الحد الأدنى لطلب السحب عبر بريدي موب هو 500 دج.</li>
            <li>• يتم معالجة طلبات السحب في غضون 24-48 ساعة.</li>
          </ul>
        </section>

        <footer className="py-10 text-center border-t border-slate-100">
          <p className="text-[11px] font-black text-slate-400">TRAFFIC-DZ &copy; 2026 | جميع الحقوق محفوظة</p>
        </footer>
      </div>
    );
  }

  // --- واجهة تسجيل الدخول ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-black text-center mb-8 text-blue-600 tracking-tighter">TRAFFIC-DZ</h2>
          <form onSubmit={handleAuth} className="space-y-5">
            <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" onChange={e => setPassword(e.target.value)} required />
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg">{authStep === "login" ? "دخول" : "اشتراك جديد"}</button>
            <p onClick={() => setAuthStep(authStep === "login" ? "signup" : "login")} className="text-center text-xs font-bold text-blue-600 cursor-pointer underline">أو قم بـ {authStep === "login" ? "فتح حساب جديد" : "تسجيل الدخول"}</p>
          </form>
        </div>
      </div>
    );
  }

  // --- لوحة التحكم الرئيسية ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col" dir="rtl">
      <nav className="p-4 bg-white border-b-2 border-blue-600 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div>
           <h1 className="text-xl font-black text-blue-700 leading-none">TRAFFIC-DZ</h1>
           <span className="text-[8px] font-bold text-slate-400">لوحة تحكم الأعضاء</span>
        </div>
        <div className="bg-blue-600 text-white px-5 py-2 rounded-2xl font-black text-sm shadow-md">
           {userBalance.toFixed(2)} دج
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4 w-full flex-grow">
        {/* قسم المعلنين */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-[2.5rem] text-white mb-8 shadow-xl">
           <h3 className="text-lg font-black mb-2">تريد الإعلان في الموقع؟ 📈</h3>
           <p className="text-xs font-bold opacity-80 mb-4 leading-relaxed">احصل على آلاف الزيارات الجزائرية لموقعك بأسعار تنافسية. تواصل معنا لتفعيل إعلانك فوراً.</p>
           <a href="https://t.me/YOUR_TELEGRAM" target="_blank" className="inline-block bg-white text-blue-700 px-6 py-2 rounded-xl font-black text-xs shadow-sm">تواصل عبر تليجرام</a>
        </div>

        {/* الإعلانات الثابتة (4 إعلانات) */}
        <h2 className="text-xs font-black text-slate-400 mr-2 mb-4 uppercase tracking-widest">إعلانات مميزة (ثابتة)</h2>
        <div className="grid grid-cols-2 gap-4 mb-10">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="bg-white p-4 rounded-3xl border border-blue-100 shadow-sm text-center h-24 flex items-center justify-center font-black text-slate-300 border-dashed">
                مساحة إعلانية {i+1}
             </div>
           ))}
        </div>

        {/* الإعلانات المدفوعة (غير محدودة) */}
        <h2 className="text-xs font-black text-slate-400 mr-2 mb-4 uppercase tracking-widest">إعلانات المستخدمين (+1 دج)</h2>
        <div className="space-y-3">
           {ads.map((ad, i) => (
             <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all" onClick={() => startAd(ad)}>
                <div>
                   <h4 className="font-black text-slate-800">{ad.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 italic">بواسطة: {ad.name}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-black text-[10px]">+ 1.00 دج</span>
             </div>
           ))}
        </div>

        {/* قسم السحب */}
        <div className="mt-12 bg-white p-8 rounded-[3rem] shadow-inner text-center">
           <p className="text-xs font-black text-slate-400 mb-2">رصيدك الحالي: {userBalance.toFixed(2)} دج</p>
           <button 
             disabled={userBalance < 500}
             className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${userBalance >= 500 ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}
           >
             {userBalance >= 500 ? "طلب سحب عبر بريدي موب" : "تحتاج 500 دج للسحب"}
           </button>
        </div>
      </main>

      <footer className="p-8 text-center text-slate-300 font-bold text-[10px] tracking-[0.2em]">
        TRAFFIC-DZ | MADE WITH ❤️ IN ALGERIA 🇩🇿
      </footer>
    </div>
  );
}
