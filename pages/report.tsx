import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ReportData {
  global?: {
    tag: string;
    oneSentence: string;
    bonus: string;
  };
  personality?: string;
  pattern?: string;
  blindspot?: string;
  advice?: string;
  oneSentence?: string;
  bonus?: string;
  // 兼容旧版扁平结构
  tag?: string;
}

export default function Report() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [hit, setHit] = useState<string | null>(null);

  useEffect(() => {
    const { data } = router.query;
    if (data && typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        // 统一转换成新版结构
        if (parsed.global) {
          setReport(parsed);
        } else {
          // 兼容旧版扁平结构
          setReport({
            global: {
              tag: parsed.tag || '探索者',
              oneSentence: parsed.oneSentence || '',
              bonus: parsed.bonus || ''
            },
            personality: parsed.personality,
            pattern: parsed.pattern,
            blindspot: parsed.blindspot,
            advice: parsed.advice
          });
        }
      } catch (e) {
        console.error('解析报告失败', e);
      }
    }
  }, [router.query]);

  const onHit = (module: string, text: string) => {
    setHit(module);
    console.log(`最戳我：${module} — ${text}`);
    alert(`✅ 已记录「${module}」\n你也可以分享这张卡片`);
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  const { global, personality, pattern, blindspot, advice } = report;
  const tag = global?.tag || report.tag || '探索者';
  const oneSentence = global?.oneSentence || report.oneSentence || '';
  const bonus = global?.bonus || report.bonus || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 人格标签 */}
        {tag && (
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
              {tag}
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
          {personality && (
            <HitCard
              title="人格核心"
              content={personality}
              onHit={() => onHit('人格核心', personality)}
              hit={hit === '人格核心'}
            />
          )}
          {pattern && (
            <HitCard
              title="行为模式"
              content={pattern}
              onHit={() => onHit('行为模式', pattern)}
              hit={hit === '行为模式'}
            />
          )}
          {blindspot && (
            <HitCard
              title="可能的盲点"
              content={blindspot}
              onHit={() => onHit('可能的盲点', blindspot)}
              hit={hit === '可能的盲点'}
            />
          )}
          {advice && (
            <HitCard
              title="给你的建议"
              content={advice}
              onHit={() => onHit('给你的建议', advice)}
              hit={hit === '给你的建议'}
            />
          )}
        </div>

        {/* 那句话 */}
        {oneSentence && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8 text-center mt-8">
            <p className="text-xl font-medium text-slate-700 italic">
              “{oneSentence}”
            </p>
          </div>
        )}

        {/* bonus 自由输出 */}
        {bonus && bonus.trim() !== '' && (
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl shadow-md p-6 italic text-slate-700 mt-4">
            💡 {bonus}
          </div>
        )}

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