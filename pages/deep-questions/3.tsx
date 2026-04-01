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
      // 尝试从多个来源获取原始故事
      let story = '';
      
      // 1. 从 localStorage 读取
      story = localStorage.getItem('deepinside_original_story') || '';
      
      // 2. 如果 localStorage 没有，从 sessionStorage 读取
      if (!story) {
        story = sessionStorage.getItem('deepinside_original_story') || '';
      }
      
      // 3. 如果还没有，从 URL 参数读取
      const urlParams = new URLSearchParams(window.location.search);
      const urlStory = urlParams.get('story');
      if (!story && urlStory) {
        story = urlStory;
      }
      
      // 4. 如果还没有，从浏览器历史读取（尝试从之前页面的 localStorage）
      if (!story) {
        const savedLetter = localStorage.getItem('deepinside_free_letter');
        if (savedLetter && savedLetter.includes('我看到了')) {
          // 尝试从信中提取，但这不准确，所以最好还是让用户自己填
          console.log('无法从 localStorage 获取原始故事');
        }
      }
      
      setOriginalStory(story || '');
      
      // 获取前两个回答
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
          
          {/* 原始故事输入框 - 让用户手动确认/填写 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              你的原始故事 <span className="text-red-500">*</span>
              <span className="text-xs text-slate-500 ml-2">（请填写或确认你的故事）</span>
            </label>
            <textarea
              rows={4}
              className="w-full border rounded-lg p-3"
              placeholder="例：我总担心男朋友会离开我。上次他三小时没回消息，我就开始胡思乱想..."
              value={originalStory}
              onChange={(e) => setOriginalStory(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-1">
              如果系统没有自动显示，请手动粘贴你的故事
            </p>
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