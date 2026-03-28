import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ReportData {
  personality: string;
  pattern: string;
  blindspot: string;
  advice: string;
  oneSentence: string;
}

export default function Report() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    // 确保 router 已经准备好了（拿到了 query 参数）
    if (!router.isReady) return;

    const { data } = router.query;
    
    if (data && typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        setReport(parsed);
      } catch (e) {
        console.error('解析报告失败', e);
      }
    } else {
      // 如果没有数据，可能是直接访问报告页，跳回首页
      console.log('没有报告数据，跳转回首页');
      router.push('/');
    }
  }, [router.isReady, router.query, router]);

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

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold text-slate-700 mb-2">人格核心</h2>
            <p className="text-slate-600">{report.personality}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold text-slate-700 mb-2">行为模式</h2>
            <p className="text-slate-600">{report.pattern}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
            <h2 className="text-lg font-semibold text-slate-700 mb-2">可能的盲点</h2>
            <p className="text-slate-600">{report.blindspot}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <h2 className="text-lg font-semibold text-slate-700 mb-2">给你的建议</h2>
            <p className="text-slate-600">{report.advice}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8 text-center">
            <p className="text-xl font-medium text-slate-700 italic">
              “{report.oneSentence}”
            </p>
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