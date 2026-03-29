import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface DomainInsight {
  pattern: string;
  fear: string;
  advice: string;
}

interface ReportData {
  global: {
    tag: string;
    oneSentence: string;
    bonus: string;
  };
  personality: string;
  pattern: string;
  blindspot: string;
  advice: string;
  domain_insights?: {
    爱情?: DomainInsight;
    事业?: DomainInsight;
    家庭?: DomainInsight;
    友情?: DomainInsight;
  };
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
        setReport(parsed);
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

  const { global, personality, pattern, blindspot, advice, domain_insights } = report;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 人格标签 */}
        {global?.tag && (
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
              {global.tag}
            </span>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            你的底层代码解析报告
          </h1>
          <p className="text-slate-500">看见你未曾看见的自己</p>
        </div>

        {/* ===== 基础模块（始终显示） ===== */}
        <div className="space-y-4 mb-8">
          <HitCard
            title="人格核心"
            content={personality}
            onHit={() => onHit('人格核心', personality)}
            hit={hit === '人格核心'}
          />
          <HitCard
            title="行为模式"
            content={pattern}
            onHit={() => onHit('行为模式', pattern)}
            hit={hit === '行为模式'}
          />
          <HitCard
            title="可能的盲点"
            content={blindspot}
            onHit={() => onHit('可能的盲点', blindspot)}
            hit={hit === '可能的盲点'}
          />
          <HitCard
            title="给你的建议"
            content={advice}
            onHit={() => onHit('给你的建议', advice)}
            hit={hit === '给你的建议'}
          />
        </div>

        {/* ===== 场景化洞察（domain_insights） ===== */}
        {domain_insights && Object.keys(domain_insights).length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4 border-l-4 border-blue-500 pl-3">
              场景深度分析
            </h2>
            {Object.entries(domain_insights).map(([domain, insight]) => (
              <div key={domain} className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3">
                  <h3 className="text-xl font-bold text-white">{domain}</h3>
                </div>
                <div className="p-4 space-y-3">
                  <HitCard
                    title="行为模式"
                    content={insight.pattern}
                    onHit={() => onHit(`${domain}·行为模式`, insight.pattern)}
                    hit={hit === `${domain}·行为模式`}
                  />
                  <HitCard
                    title="深层恐惧"
                    content={insight.fear}
                    onHit={() => onHit(`${domain}·深层恐惧`, insight.fear)}
                    hit={hit === `${domain}·深层恐惧`}
                  />
                  <HitCard
                    title="场景建议"
                    content={insight.advice}
                    onHit={() => onHit(`${domain}·场景建议`, insight.advice)}
                    hit={hit === `${domain}·场景建议`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 那句话 */}
        {global?.oneSentence && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8 text-center mt-8">
            <p className="text-xl font-medium text-slate-700 italic">
              “{global.oneSentence}”
            </p>
          </div>
        )}

        {/* bonus 自由输出 */}
        {global?.bonus && global.bonus.trim() !== '' && (
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl shadow-md p-6 italic text-slate-700 mt-4">
            💡 {global.bonus}
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
        <h3 className="text-md font-semibold text-slate-600 mb-2">{title}</h3>
        <span className="text-xs text-slate-400">⬅️ 这句最戳我</span>
      </div>
      <p className="text-slate-700">{content}</p>
    </div>
  );
}