import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function Share() {
  const router = useRouter();
  const [report, setReport] = useState('');

  useEffect(() => {
    const { letter } = router.query;
    if (letter && typeof letter === 'string') {
      setReport(letter.slice(0, 100) + '...');
    }
  }, [router.query]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold mb-4">分享你的来信</h1>
            <div className="bg-slate-100 p-4 rounded-lg mb-6 text-left">
              <p className="text-slate-600">{report || '加载中...'}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(report)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              复制内容
            </button>
          </div>
        </div>
      </div>
    </>
  );
}