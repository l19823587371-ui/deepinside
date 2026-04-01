import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Question1() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const { story } = router.query;
    console.log('追问1 收到的 story:', story);
    
    if (story && typeof story === 'string') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('deepinside_original_story', story);
        console.log('追问1 已保存故事:', story);
        const saved = localStorage.getItem('deepinside_original_story');
        console.log('追问1 验证保存:', saved);
      }
    } else {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('deepinside_original_story');
        console.log('追问1 从 localStorage 读取:', saved);
        if (!saved) {
          console.error('追问1 没有找到故事');
          alert('未找到你的故事，请返回首页重新生成免费信');
        }
      }
    }
  }, [router.query]);

  const handleNext = () => {
    if (!answer.trim()) {
      alert('请回答这个问题');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('deep_answer1', answer);
    }
    router.push('/deep-questions/2');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-4">第一个问题</h1>
          <p className="text-lg font-medium mb-4">
            如果免费信里那句戳中你的话是真的，你觉得它最早是从什么时候开始的？
          </p>
          <textarea
            rows={5}
            className="w-full border rounded-lg p-3 mb-6"
            placeholder="比如：小时候爸妈吵架，我就躲进房间，觉得只要我不在，他们就不会吵了"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            下一步
          </button>
        </div>
      </div>
    </>
  );
}