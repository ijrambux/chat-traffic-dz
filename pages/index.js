import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// إعدادات قاعدة البيانات
const supabaseUrl = 'https://rhhdvcatxfebxugcdlua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGR2Y2F0eGZlYnh1Z2NkbHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDg4OTQsImV4cCI6MjA4NTkyNDg5NH0.12qmM8PcddSAxH7TQXj44Ez1F5WATQ6ve8Q_vvmJzqg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // حالات المستخدم والنظام
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: الرئيسية، 2: المتجر، 3: العداد
  
  const [allAds, setAllAds] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [timer, setTimer] = useState(30);
  const [activeAd, setActiveAd] = useState(null);

  useEffect(() => {
    checkUser();
    fetchAds();
    // تسجيل الإعلان في الخلفية
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // عداد الـ 30 ثانية والعودة التلقائية
  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && activeAd) {
      addReward();
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      fetchBalance(session.user.id);
    }
  };

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    setAllAds(data || []);
  };

  const fetchBalance = async (uid) => {
    const { data } = await supabase.from('profiles').select('balance').eq('id', uid).single();
    if (data) setUserBalance(data.balance);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("خطأ: " + error.message);
    else { setUser(data.user); fetchBalance(data.user.id); }
    setLoading(false);
  };

  const startAd = (ad) => {
    setActiveAd(ad);
    setTimer(30);
    setStep(3);
    window.open(ad.url, "_blank");
  };

  const addReward = async () => {
    const reward = 5.00;
    const newBalance = userBalance + reward;
    // تحديث في قاعدة البيانات
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
    setUserBalance(newBalance);
    setStep(1);
    alert(`مبروك! ربحت ${reward} دج`);
  };

  // واجهة العداد
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <h2 className="text-2xl font-black mb-6">جاري التحقق من الزيارة...</h2>
        <div className="text-7xl font-black text-blue-500 mb-8 animate-pulse">{timer}</div>
        <p className="text-slate-400 font-bold max-w-xs">يرجى مشاهدة الإعلان في النافذة الأخرى. سنعيدك تلقائياً عند انتهاء الوقت.</p>
        <div className="mt-10 w-full max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${(30 - timer) / 30 * 100}%` }}></div>
        </div>
      </div>
    );
  }

  // واجهة تسجيل الدخول
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans" dir="rtl">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-black text-blue-600 text-center mb-8 animate-pulse">TRAFFIC-DZ</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" onChange={e => setPassword(e.target.value)} required />
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" dir="rtl">
      {/* Navbar */}
      <nav className="p-4 bg-white border-b-2 border-blue-600 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black text-blue-700">TRAFFIC-DZ</h1>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 font-black text-blue-700">
          {userBalance.toFixed(2)} دج
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4 flex-grow w-full">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-6 border-2 border-blue-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">مرحباً بك</p>
                <p className="font-black text-slate-800">ابدأ بجمع الأرباح الآن</p>
              </div>
              <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xs">شراء زيارات</button>
            </div>

            {allAds.map((ad, i) => (
              <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-500 transition-all cursor-pointer" onClick={() => startAd(ad)}>
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-800">{ad.title}</h3>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">+ 5.00 دج</span>
                </div>
              </div>
            ))}

            <a href="https://t.me/YOUR_TELEGRAM" target="_blank" className="block bg-[#229ED9] text-white p-5 rounded-[2rem] text-center font-black mt-10 shadow-lg">
              اتصل بنا عبر تليجرام لطلب السحب 💬
            </a>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black">متجر الزيارات 📈</h2>
              <button onClick={() => setStep(1)} className="text-slate-400 font-black">إغلاق</button>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-200">
                <p className="font-black text-slate-800">1,000 زيارة حقيقية</p>
                <p className="text-2xl font-black text-blue-600 my-2">500 دج</p>
                <p className="text-[10px] font-bold text-slate-500">الدفع عبر بريدي موب، تواصل معنا لتفعيل الحملة.</p>
              </div>
              {/* يمكن إضافة باقات أخرى هنا بنفس التنسيق */}
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 text-center text-slate-400 font-black text-[10px] tracking-widest">
        TRAFFIC-DZ &copy; 2026 | MADE IN ALGERIA 🇩🇿
      </footer>
    </div>
  );
}
