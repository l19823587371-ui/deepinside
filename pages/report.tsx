import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface FieldDetail {
  pattern: string;
  insight: string;
  action: string;
}

interface ReportData {
  global: {
    tag: string;
    oneSentence: string;
    bonus: string;
  };
  fields: {
    爱情?: FieldDetail;
    事业?: FieldDetail;
    家庭?: FieldDetail;
    友情?: FieldDetail;
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
        // 兼容旧版扁平结构（如果你还保留了旧版 API，可以去掉这段）
        if (parsed.personality) {
          // 将旧版转换为新版结构
          setReport({
            global: {
              tag: parsed.tag || '探索者',
              oneSentence: parsed.oneSentence || '',
              bonus: parsed.bonus || ''
            },
            fields: {}
          });
        } else {
          setReport(parsed);
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

  const { global, fields } = report;
  const selectedFields = Object.keys(fields).filter(key => fields[key as keyof typeof fields]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 人格标签 */}
        {global.tag && (
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

        {/* 动态领域分析 */}
        {selectedFields.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center text-slate-500">
            暂无领域分析数据
          </div>
        )}

        {selectedFields.map((field) => {
          const data = fields[field as keyof typeof fields] as FieldDetail;
          if (!data) return null;
          return (
            <div key={field} className="mb-8">
              <h2 className="text-2xl font-bold text-slate-700 mb-4 border-l-4 border-blue-500 pl-3">
                {field}
              </h2>
              <div className="space-y-4">
                <HitCard
                  title="行为模式"
                  content={data.pattern}
                  onHit={() => onHit(`${field}·行为模式`, data.pattern)}
                  hit={hit === `${field}·行为模式`}
                />
                <HitCard
                  title="深层洞察"
                  content={data.insight}
                  onHit={() => onHit(`${field}·深层洞察`, data.insight)}
                  hit={hit === `${field}·深层洞察`}
                />
                <HitCard
                  title="行动建议"
                  content={data.action}
                  onHit={() => onHit(`${field}·行动建议`, data.action)}
                  hit={hit === `${field}·行动建议`}
                />
              </div>
            </div>
          );
        })}

        {/* 那句话（独立模块） */}
        {global.oneSentence && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8 text-center mt-8">
            <p className="text-xl font-medium text-slate-700 italic">
              “{global.oneSentence}”
            </p>
          </div>
        )}

        {/* bonus 自由输出 */}
        {global.bonus && global.bonus.trim() !== '' && (
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