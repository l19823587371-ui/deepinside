import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Feedback() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    alert('感谢你的反馈！');
    router.push('/');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6">你的反馈很重要</h1>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">这封信有戳中你吗？</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setScore(s)}
                    className={`w-12 h-12 rounded-full border ${
                      score === s ? 'bg-blue-600 text-white' : 'bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2">哪句话最戳中你？</label>
              <textarea
                rows={3}
                className="w-full border rounded-lg p-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              提交反馈
            </button>
          </div>
        </div>
      </div>
    </>
  );
}