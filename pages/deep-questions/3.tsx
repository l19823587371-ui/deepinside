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
      const story = localStorage.getItem('deepinside_original_story');
      console.log('追问3 - 从 localStorage 读取故事:', story?.slice(0, 50));
      
      if (story) {
        setOriginalStory(story);
      } else {
        console.error('追问3 - 没有找到故事');
        alert('未找到你的故事，请返回首页重新生成免费信');
      }
      
      setAnswer1(localStorage.getItem('deep_answer1') || '');
      setAnswer2(localStorage.getItem('deep_answer2') || '');
    }
  }, []);

  const handleGenerate = async () => {
    if (!originalStory) {
      alert('未找到原始故事，请返回首页重新生成免费信');
      return;
    }
    if (!answer.trim()) {
      alert('请回答第三个问题');
      return;
    }
    
    console.log('发送数据:', {
      originalStory: originalStory.slice(0, 50),
      answer1: answer1.slice(0, 50),
      answer2: answer2.slice(0, 50),
      answer3: answer.slice(0, 50)
    });
    
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
    
    if (!res.ok) {
      console.error('API 错误:', data);
      alert(`生成失败: ${data.error}`);
      setLoading(false);
      return;
    }
    
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
          <h1 className="text-2xl font-bold mb-4">最后一个问题</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              你的原始故事
            </label>
            <div className="bg-slate-50 p-3 rounded-lg text-slate-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
              {originalStory || '加载中...'}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              你的第一个回答
            </label>
            <div className="bg-slate-50 p-3 rounded-lg text-slate-600">
              {answer1 || '（未找到）'}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              你的第二个回答
            </label>
            <div className="bg-slate-50 p-3 rounded-lg text-slate-600">
              {answer2 || '（未找到）'}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              如果坚持做那件小事 30 天，最大的变化会是什么？ <span className="text-red-500">*</span>
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
            disabled={loading || !answer.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? '生成深度报告中...' : '生成深度报告'}
          </button>
        </div>
      </div>
    </>
  );
}