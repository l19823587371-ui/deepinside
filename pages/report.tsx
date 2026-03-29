import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ReportData {
  tag?: string;
  personality: string;
  pattern: string;
  blindspot: string;
  advice: string;
  oneSentence: string;
  bonus?: string;
}

export default function Report() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [hit, setHit] = useState<string | null>(null);

  useEffect(() => {
    const { data } = router.query;
    if (data && typeof data === 'string') {
      try {
        setReport(JSON.parse(data));
      } catch (e) {
        console.error('解析报告失败');
      }
    }
  }, [router.query]);

  const onHit = (module: string, text: string) => {
    setHit(module);
    // 这里可以调一个极简 API 收集数据（现在先 console）
    console.log(`最戳我：${module} — ${text}`);
    // 可选：弹个提示
    alert(`✅ 已记录「${module}」\n你也可以分享这张卡片`);
  };

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
        {/* 标签卡片（P0 核心） */}
        {report.tag && (
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
              {report.tag}
            </span>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            你的底层代码解析报告
          </h1>
          <p className="text-slate-500">看见你未曾看见的自己</p>
        </div>

        <div className="space-y-4">
          <HitCard
            title="人格核心"
            content={report.personality}
            onHit={() => onHit('人格核心', report.personality)}
            hit={hit === '人格核心'}
          />
          <HitCard
            title="行为模式"
            content={report.pattern}
            onHit={() => onHit('行为模式', report.pattern)}
            hit={hit === '行为模式'}
          />
          <HitCard
            title="可能的盲点"
            content={report.blindspot}
            onHit={() => onHit('可能的盲点', report.blindspot)}
            hit={hit === '可能的盲点'}
          />
          <HitCard
            title="给你的建议"
            content={report.advice}
            onHit={() => onHit('给你的建议', report.advice)}
            hit={hit === '给你的建议'}
          />
          <HitCard
            title="那句话"
            content={`“${report.oneSentence}”`}
            onHit={() => onHit('那句话', report.oneSentence)}
            hit={hit === '那句话'}
          />

          {/* bonus 自由输出（P1 惊喜感） */}
          {report.bonus && report.bonus.trim() !== '' && (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl shadow-md p-6 italic text-slate-700">
              💡 {report.bonus}
            </div>
          )}
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

// 可点击卡片组件（这句最戳我）
function HitCard({ title, content, onHit, hit }: { title: string; content: string; onHit: () => void; hit: boolean }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 border-l-4 transition-all cursor-pointer ${
        hit ? 'border-l-amber-500 bg-amber-50' : 'border-l-blue-500'
      }`}
      onClick={onHit}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">{title}</h2>
        <span className="text-xs text-slate-400">⬅️ 这句最戳我</span>
      </div>
      <p className="text-slate-600">{content}</p>
    </div>
  );
}