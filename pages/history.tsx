import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface HistoryItem {
  id: number;
  createdAt: string;
  data: {
    root: string;
    pathA: string;
    pathB: string;
    warning: string;
    map: string;
    promise: string;
  };
}

export default function History() {
  const router = useRouter();
  const [reports, setReports] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('deepinside_history');
      if (history) {
        setReports(JSON.parse(history));
      }
    }
  }, []);

  const handleViewReport = (report: HistoryItem) => {
    router.push({
      pathname: '/view-report',
      query: { data: JSON.stringify(report.data) }
    });
  };

  const handleDeleteReport = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newReports = reports.filter(r => r.id !== id);
    setReports(newReports);
    localStorage.setItem('deepinside_history', JSON.stringify(newReports));
  };

  const handleClearAll = () => {
    if (confirm('确定要删除所有历史记录吗？')) {
      setReports([]);
      localStorage.removeItem('deepinside_history');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">历史记录</h1>
              {reports.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  清空全部
                </button>
              )}
            </div>
            
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">暂无历史记录</p>
                <button
                  onClick={() => router.push('/')}
                  className="text-blue-600 hover:underline"
                >
                  去生成第一份报告 →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => handleViewReport(report)}
                    className="bg-slate-50 rounded-lg p-4 cursor-pointer hover:bg-slate-100 transition flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="text-sm text-slate-400 mb-1">
                        {new Date(report.createdAt).toLocaleString()}
                      </div>
                      <div className="text-slate-700 line-clamp-2">
                        {report.data.promise || report.data.root?.slice(0, 80) || '深度报告'}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteReport(report.id, e)}
                      className="ml-4 text-red-400 hover:text-red-600 text-sm"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}