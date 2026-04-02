import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { domToPng } from 'modern-screenshot';
import Navbar from '../components/Navbar';

export default function DeepReport() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

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

  const handleShare = async () => {
    if (!reportRef.current) return;
    setSharing(true);
    
    try {
      const dataUrl = await domToPng(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `deepinside-report-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('截图失败:', error);
      alert('生成分享图失败，请重试');
    } finally {
      setSharing(false);
    }
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
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 可截图区域 */}
          <div ref={reportRef} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">深度拆解报告</h1>
              <p className="text-slate-500 text-sm">DEEPINSIDE</p>
            </div>
            
            <div className="space-y-4">
              <Section title="📌 根源拆解" content={report.root} />
              <Section title="⏳ 如果你继续现在的方式" content={report.pathA} />
              <Section title="✨ 如果你开始改变" content={report.pathB} />
              <Section title="⚠️ 风险预警" content={report.warning} />
              <Section title="🗺️ 30天破局地图" content={report.map} />
              <Section title="💫 一句话承诺" content={report.promise} highlight />
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
              DEEPINSIDE · 生成于 {new Date().toLocaleDateString()}
            </div>
          </div>
          
          {/* 分享按钮 */}
          <div className="text-center">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-green-300"
            >
              {sharing ? '生成中...' : '📸 分享报告（保存截图）'}
            </button>
            <p className="text-xs text-slate-400 mt-2">
              点击后自动生成截图，保存后即可分享到朋友圈或小红书
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, content, highlight }: { title: string; content: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-slate-50'}`}>
      <h2 className="text-lg font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">{content}</p>
    </div>
  );
}