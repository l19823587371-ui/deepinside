import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface ReportData {
  letter: string;
}

export default function Report() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [originalStory, setOriginalStory] = useState('');

  useEffect(() => {
    const { data, story } = router.query;
    if (data && typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        setReport({ letter: parsed.letter || parsed });
        
        // 保存原始故事到 localStorage，供深度版使用
        if (story && typeof story === 'string') {
          setOriginalStory(story);
          localStorage.setItem('deepinside_original_story', story);
        }
      } catch (e) {
        console.error('解析报告失败', e);
      }
    }
  }, [router.query]);

  const handleDeepDive = () => {
    if (report?.letter) {
      localStorage.setItem('deepinside_free_letter', report.letter);
    }
    router.push('/deep-questions/1');
  };

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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">你的来信</h1>
              <p className="text-slate-500">来自 DEEPINSIDE</p>
            </div>
            <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif text-slate-700 leading-relaxed text-base">
              {report.letter}
            </div>

            {/* 深度版入口 */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <p className="text-slate-600 mb-2">这封信戳中你了吗？</p>
                <p className="text-slate-600 mb-4 text-sm">
                  如果你想看见更深的自己——<br />
                  包括根源拆解、双路径推演、风险预警、30天破局地图、一句话承诺
                </p>
                <button
                  onClick={handleDeepDive}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  解锁深度拆解版 →
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
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
    </>
  );
}