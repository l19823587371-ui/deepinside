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
    
    console.log('Report - URL 参数:', { data: !!data, story });
    
    if (data && typeof data === 'string') {
      try {
        setReport(JSON.parse(data));
      } catch (e) {
        console.error('解析报告失败', e);
      }
    }
    
    // 关键：从 URL 获取故事
    if (story && typeof story === 'string') {
      console.log('Report - 从 URL 获取故事:', story);
      setOriginalStory(story);
      // 同时存到 localStorage 作为备份
      localStorage.setItem('deepinside_original_story', story);
    } else {
      // 如果 URL 没有，尝试从 localStorage 读取
      const saved = localStorage.getItem('deepinside_original_story');
      if (saved) {
        console.log('Report - 从 localStorage 获取故事:', saved);
        setOriginalStory(saved);
      } else {
        console.warn('Report - 没有找到故事');
      }
    }
  }, [router.query]);

  const handleUnlock = () => {
    console.log('Report - 解锁深度版，当前故事:', originalStory);
    
    if (!originalStory) {
      alert('未找到你的故事，请返回首页重新生成免费信');
      return;
    }
    
    // 存到 localStorage
    localStorage.setItem('deepinside_original_story', originalStory);
    localStorage.setItem('deepinside_free_letter', report?.letter || '');
    
    // 通过 URL 传递故事到追问页
    router.push(`/deep-questions/1?story=${encodeURIComponent(originalStory)}`);
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

            <div className="mt-8 p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-slate-600 mb-2">这封信戳中你了吗？</p>
              <p className="text-slate-600 mb-4 text-sm">
                如果你想看见更深的自己——<br />
                根源拆解 · 双路径推演 · 风险预警 · 30天破局地图 · 一句话承诺
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleUnlock}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  解锁深度拆解版 →
                </button>
                <button
                  onClick={() => router.push('/tip')}
                  className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
                >
                  ☕ 请我喝咖啡
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