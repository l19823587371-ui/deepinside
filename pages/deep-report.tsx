import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface DeepReport {
  root: string;
  pathA: string;
  pathB: string;
  warning: string;
  map: string;
  promise: string;
}

export default function DeepReport() {
  const router = useRouter();
  const [report, setReport] = useState<DeepReport | null>(null);

  useEffect(() => {
    const { data } = router.query;
    if (data && typeof data === 'string') {
      try {
        setReport(JSON.parse(data));
      } catch (e) {
        console.error('解析深度报告失败', e);
      }
    }
  }, [router.query]);

  if (!report) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-slate-500">加载中...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-2">深度拆解报告</h1>
            <p className="text-center text-slate-500 mb-8">你的专属破局地图</p>

            <div className="space-y-6">
              <Section title="📌 根源拆解" content={report.root} />
              <Section title="⏳ 如果你继续现在的方式" content={report.pathA} />
              <Section title="✨ 如果你开始改变" content={report.pathB} />
              <Section title="⚠️ 风险预警" content={report.warning} />
              <Section title="🗺️ 30天破局地图" content={report.map} />
              <Section title="💫 一句话承诺" content={report.promise} highlight />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, content, highlight }: { title: string; content: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-slate-50'}`}>
      <h2 className="text-xl font-bold text-slate-800 mb-3">{title}</h2>
      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
}