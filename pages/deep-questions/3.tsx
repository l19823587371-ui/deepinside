import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Question3() {
  const router = useRouter();
  const [originalStory, setOriginalStory] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnswer1(localStorage.getItem('deep_answer1') || '');
      setAnswer2(localStorage.getItem('deep_answer2') || '');
    }
  }, []);

  const handleGenerate = async () => {
    if (!originalStory.trim()) {
      alert('请粘贴你的原始故事');
      return;
    }
    if (!answer.trim()) {
      alert('请回答第三个问题');
      return;
    }
    
    setLoading(true);

    const res = await fetch('/api/deep-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        originalStory, 
        answer1, 
        answer2, 
        answer3: answer 
      })
    });

    const data = await res.json();
    router.push({
      pathname: '/deep-report',
      query: { data: JSON.stringify(data.report) }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-4">最后一步：生成深度报告</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              1. 你的原始故事 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className="w-full border rounded-lg p-3"
              placeholder="请复制你在第一步写的故事..."
              value={originalStory}
              onChange={(e) => setOriginalStory(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-1">
              💡 提示：回到上一页，复制你最初写的故事
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              2. 你的第一个回答
            </label>
            <div className="bg-slate-50 p-3 rounded-lg text-slate-600">
              {answer1 || '（未找到，请回到上一页重新填写）'}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              3. 你的第二个回答
            </label>
            <div className="bg-slate-50 p-3 rounded-lg text-slate-600">
              {answer2 || '（未找到，请回到上一页重新填写）'}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              4. 如果坚持做那件小事 30 天，最大的变化会是什么？ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              className="w-full border rounded-lg p-3"
              placeholder="例：我可能会变成一个敢生气也敢和好的人"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !originalStory.trim() || !answer.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? '生成深度报告中...' : '生成深度报告'}
          </button>
          
          <p className="text-xs text-slate-400 text-center mt-4">
            你的故事和回答仅用于生成报告，不会保存
          </p>
        </div>
      </div>
    </>
  );
}