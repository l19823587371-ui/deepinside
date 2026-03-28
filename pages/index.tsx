import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    keywords: '',
    struggle: '',
    question: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();  // 这行必须存在，阻止页面刷新
  setLoading(true);

  try {
    console.log('提交的数据：', formData);  // 调试用
    
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    console.log('响应状态：', res.status);  // 调试用
    
    const data = await res.json();
    console.log('返回的数据：', data);  // 调试用

    // 检查数据是否存在
    if (data && data.report) {
      router.push({
        pathname: '/report',
        query: { data: JSON.stringify(data.report) }
      });
    } else {
      console.error('没有收到 report 数据');
      alert('生成报告失败，请重试');
      setLoading(false);
    }
  } catch (error) {
    console.error('请求失败：', error);
    alert('网络错误，请重试');
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            DEEPINSIDE
          </h1>
          <p className="text-slate-500">你的底层代码解析器</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                用三个词描述自己
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：敏感、爱思考、内向"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                最近让你困惑或难受的一件事
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="简单描述一下..."
                value={formData.struggle}
                onChange={(e) => setFormData({ ...formData, struggle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                你最想解决的问题
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：怎么才能不在意别人的看法"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? '正在解析你的底层代码...' : '开始解析'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}