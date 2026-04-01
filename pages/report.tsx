import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ReportData {
  letter: string;
}

export default function Report() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    const { data } = router.query;
    if (data && typeof data === 'string') {
      try {
        setReport(JSON.parse(data));
      } catch (e) {
        console.error('解析报告失败', e);
      }
    }
  }, [router.query]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">你的来信</h1>
            <p className="text-slate-500">来自 DEEPINSIDE</p>
          </div>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif text-slate-700 leading-relaxed text-base">
            {report.letter}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
            >
              重新测试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}