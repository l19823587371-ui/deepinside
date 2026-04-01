import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Question1() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [freeLetter, setFreeLetter] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const letter = localStorage.getItem('deepinside_free_letter');
      setFreeLetter(letter || '');
    }
  }, []);

  const handleNext = () => {
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
          <p className="text-slate-600 mb-6">
            你在免费信里看到这句话：<br />
            <span className="italic text-slate-800">
              {freeLetter.slice(0, 100)}...
            </span>
          </p>
          <p className="text-lg font-medium mb-4">
            如果这句话是真的，你觉得它最早是从什么时候开始的？
          </p>
          <textarea
            rows={4}
            className="w-full border rounded-lg p-3 mb-6"
            placeholder="比如：小时候爸妈吵架，我就躲进房间..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={handleNext}
            disabled={!answer.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-blue-300"
          >
            下一步
          </button>
        </div>
      </div>
    </>
  );
}