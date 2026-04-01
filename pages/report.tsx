import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ReportData {
  mirror_a: string;
  mirror_b: string;
  path: string;
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            你的底层代码解析报告
          </h1>
          <p className="text-slate-500">看见你未曾看见的自己</p>
        </div>

        <div className="space-y-6">
          {/* 模块一：你现在在做什么 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-bold text-slate-700 mb-3">🔍 你现在在做什么</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{report.mirror_a}</p>
          </div>

          {/* 模块二：如果你不改，5年后你会成为谁 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
            <h2 className="text-xl font-bold text-slate-700 mb-3">⏳ 如果你不改，5年后你会成为谁</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{report.mirror_b}</p>
          </div>

          {/* 模块三：如果你现在做一件事 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <h2 className="text-xl font-bold text-slate-700 mb-3">✨ 如果你现在做一件事</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{report.path}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
          >
            重新测试
          </button>
        </div>
      </div>
    </div>
  );
}