import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mood: '',
    moodDetail: '',
    fields: [] as string[],
    story: ''
  });

  const moods = ['焦虑', '迷茫', '疲惫', '孤独'];
  const fieldOptions = ['爱情', '事业', '家庭', '友情'];

  const handleFieldChange = (field: string) => {
    setFormData(prev => {
      const newFields = prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field];
      // 如果选了“全部”，清空其他，只保留“全部”
      if (field === '全部') {
        return { ...prev, fields: newFields.includes('全部') ? ['全部'] : [] };
      }
      // 如果选了其他，去掉“全部”
      if (newFields.includes(field) && prev.fields.includes('全部')) {
        return { ...prev, fields: newFields.filter(f => f !== '全部') };
      }
      return { ...prev, fields: newFields };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fields.length === 0) {
      alert('请至少选择一个分析领域');
      return;
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
      query: { data: JSON.stringify(data.report) }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">DEEPINSIDE</h1>
          <p className="text-slate-500">你的底层代码解析器</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 问题1：整体状态 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                1. 你现在的整体状态？
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {moods.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: m })}
                    className={`px-4 py-2 rounded-full border transition ${
                      formData.mood === m
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="可以多说一句（可选）"
                value={formData.moodDetail}
                onChange={(e) => setFormData({ ...formData, moodDetail: e.target.value })}
              />
            </div>

            {/* 问题2：选择分析领域 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                2. 你最想分析哪个领域？
              </label>
              <div className="flex flex-wrap gap-3">
                {fieldOptions.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleFieldChange(f)}
                    className={`px-4 py-2 rounded-full border transition ${
                      formData.fields.includes(f)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleFieldChange('全部')}
                  className={`px-4 py-2 rounded-full border transition ${
                    formData.fields.includes('全部')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                  }`}
                >
                  全部
                </button>
              </div>
            </div>

            {/* 问题3：具体事件 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                3. 针对你选的领域，描述一件具体的事
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="例：我总担心 ta 会离开我"
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
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