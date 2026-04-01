import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Question3() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalStory, setOriginalStory] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStory = localStorage.getItem('deepinside_original_story');
      if (savedStory) setOriginalStory(savedStory);
      setAnswer1(localStorage.getItem('deep_answer1') || '');
      setAnswer2(localStorage.getItem('deep_answer2') || '');
    }
  }, []);

  const handleGenerate = async () => {
    if (!originalStory.trim()) {
      alert('请填写你的原始故事');
      return;
    }
    if (!answer.trim()) {
      alert('请回答第三个问题');
      return;
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('deep_answer3', answer);
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
          <h1 className="text-2xl font-bold mb-4">第三个问题</h1>
          
          {/* 让用户确认/修改原始故事 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              你的原始故事（可修改）
            </label>
            <textarea
              rows={3}
              className="w-full border rounded-lg p-3"
              value={originalStory}
              onChange={(e) => setOriginalStory(e.target.value)}
              placeholder="你最初写的故事会显示在这里，如果需要修改可以直接编辑"
            />
          </div>
          
          <p className="text-lg font-medium mb-4">
            如果坚持做信里建议的那件小事 30 天，你觉得最大的变化会是什么？
          </p>
          <textarea
            rows={4}
            className="w-full border rounded-lg p-3 mb-6"
            placeholder="比如：我可能会变成一个敢生气也敢和好的人"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !answer.trim() || !originalStory.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-blue-300"
          >
            {loading ? '生成深度报告中...' : '生成深度报告'}
          </button>
        </div>
      </div>
    </>
  );
}