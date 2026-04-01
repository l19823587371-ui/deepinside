import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function Question2() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deep_answer2', answer);
    }
    router.push('/deep-questions/3');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-4">第二个问题</h1>
          <p className="text-lg font-medium mb-4">
            如果 5 年后你真的变成了信里说的那个人，你最不想失去的是什么？
          </p>
          <textarea
            rows={4}
            className="w-full border rounded-lg p-3 mb-6"
            placeholder="比如：我最不想失去的是被一个人真正懂的感觉"
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