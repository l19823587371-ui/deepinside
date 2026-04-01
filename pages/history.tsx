import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function History() {
  const [reports, setReports] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('deepinside_history');
    if (saved) setReports(JSON.parse(saved));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-4">你的历史来信</h1>
          {reports.length === 0 ? (
            <p className="text-slate-500">还没有来信，去生成一封吧</p>
          ) : (
            reports.map((r, i) => (
              <div key={i} className="border-b py-3 text-slate-600">
                {r.slice(0, 80)}...
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}