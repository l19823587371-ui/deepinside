import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { questionsMap, domainOrder } from '../lib/questions';

export default function QuestionsPage() {
  const router = useRouter();
  const [page1Data, setPage1Data] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // 加载页面1的数据
  useEffect(() => {
    const saved = localStorage.getItem('deepinside_page1');
    if (!saved) {
      router.push('/');
      return;
    }
    setPage1Data(JSON.parse(saved));
  }, [router]);

  if (!page1Data) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  const { fields } = page1Data;
  // 按固定顺序过滤出用户选择的领域
  const selectedDomains = domainOrder.filter(d => fields.includes(d));
  const currentDomain = selectedDomains[currentDomainIndex];
  const currentQuestions = questionsMap[currentDomain as keyof typeof questionsMap] || [];

  const handleAnswer = (qId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [`${currentDomain}_${qId}`]: answer }));
  };

  const isCurrentDomainComplete = () => {
    return currentQuestions.every(q => answers[`${currentDomain}_${q.id}`]);
  };

  const handleNext = () => {
    if (!isCurrentDomainComplete()) {
      alert('请先完成当前领域的所有问题');
      return;
    }
    if (currentDomainIndex + 1 < selectedDomains.length) {
      setCurrentDomainIndex(prev => prev + 1);
    } else {
      // 所有领域完成，提交
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentDomainIndex > 0) {
      setCurrentDomainIndex(prev => prev - 1);
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // 组织 domain_answers
    const domainAnswers: Record<string, Record<string, string>> = {};
    selectedDomains.forEach(domain => {
      domainAnswers[domain] = {};
      const domainQuestions = questionsMap[domain as keyof typeof questionsMap] || [];
      domainQuestions.forEach(q => {
        const key = `${domain}_${q.id}`;
        if (answers[key]) {
          domainAnswers[domain][q.id] = answers[key];
        }
      });
    });

    const payload = {
      ...page1Data,
      domain_answers: domainAnswers
    };

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    router.push({
      pathname: '/report',
      query: { data: JSON.stringify(data.report) }
    });
  };

  const progress = `${currentDomainIndex + 1}/${selectedDomains.length}`;
  const answeredCount = currentQuestions.filter(q => answers[`${currentDomain}_${q.id}`]).length;
  const domainProgress = `${answeredCount}/${currentQuestions.length}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 进度条 */}
          <div className="mb-6 text-sm text-slate-500">
            领域 {progress} · {currentDomain} · 已完成 {domainProgress}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(currentDomainIndex / selectedDomains.length) * 100}%` }} />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-6">{currentDomain}</h2>
          
          <div className="space-y-6">
            {currentQuestions.map((q, idx) => (
              <div key={q.id} className="border-b pb-4">
                <p className="font-medium text-slate-700 mb-3">{idx + 1}. {q.text}</p>
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[`${currentDomain}_${q.id}`] === opt}
                        onChange={() => handleAnswer(q.id, opt)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-slate-600">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handlePrev}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={!isCurrentDomainComplete()}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {currentDomainIndex + 1 === selectedDomains.length ? '开始解析' : '下一领域'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}