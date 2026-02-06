import React, { useState, useEffect } from 'react';

export default function ChatPage() {
  const [nick, setNick] = useState('');
  const [room, setRoom] = useState('الغرفة العامة');

  useEffect(() => {
    setNick(localStorage.getItem('chat_nick') || 'زائر');
  }, []);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* القائمة الجانبية */}
      <div className="w-64 bg-slate-900 text-white flex flex-col p-4 hidden md:flex">
        <h2 className="text-xl font-bold mb-8 text-blue-400">القوائم</h2>
        <button onClick={() => setRoom('الغرفة العامة')} className={`p-3 text-right rounded mb-2 ${room === 'الغرفة العامة' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>🌍 الغرفة العامة</button>
        <button onClick={() => setRoom('غرفة الاستثمارات')} className={`p-3 text-right rounded mb-2 ${room === 'غرفة الاستثمارات' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>💰 غرفة الاستثمارات</button>
        <div className="mt-auto border-t border-slate-700 pt-4 text-xs text-slate-500 text-center">
          Chat Traffic DZ v1.0
        </div>
      </div>

      {/* منطقة الدردشة */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between shadow-sm">
          <span className="font-bold text-slate-700">{room}</span>
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">مرحباً، {nick}</span>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <div className="bg-white p-4 rounded-lg shadow-sm border max-w-md text-sm mb-4">
            <span className="font-bold text-blue-600">نظام:</span> أهلاً بك في Chat Traffic DZ. يرجى احترام الأعضاء.
          </div>
          {/* هنا ستظهر الرسائل لاحقاً */}
        </main>

        <footer className="p-4 bg-white border-t">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <input type="text" placeholder="اكتب رسالتك..." className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">إرسال</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
