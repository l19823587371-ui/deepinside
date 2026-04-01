import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function FamilyInput() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mood: '',
    moodDetail: '',
    fields: ['家庭'],
    story: ''
  });

  const moods = ['焦虑', '迷茫', '疲惫', '孤独'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mood) {
      alert('请选择一个状态');
      return;
    }
    if (!formData.story.trim()) {
      alert('请描述一件具体的事');
      return;
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepinside_original_story', formData.story);
    }
    
    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: formData.mood,
        moodDetail: formData.moodDetail,
        fields: formData.fields,
        story: formData.story
      })
    });

    const data = await res.json();
    router.push({
      pathname: '/report',
      query: { 
        data: JSON.stringify(data.report),
        story: formData.story
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">家庭 · 你的故事</h1>
            <p className="text-slate-500 mb-6">说出你在家庭中的困惑，我会给你写一封信</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">你现在的状态？</label>
                <div className="flex flex-wrap gap-3">
                  {moods.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: m })}
                      className={`px-4 py-2 rounded-full border transition ${
                        formData.mood === m
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full mt-3 px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="可以多说一句（可选）"
                  value={formData.moodDetail}
                  onChange={(e) => setFormData({ ...formData, moodDetail: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">描述一件具体的事</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="例：每次回家，我都觉得压力很大，但又不知道说什么..."
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {loading ? '正在解析你的故事...' : '开始解析'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}