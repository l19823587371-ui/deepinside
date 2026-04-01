import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Tip() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAmounts = [6.6, 9.9, 19.9];

  const handleTip = async () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      alert('请输入有效金额（1-100元）');
      return;
    }
    if (numAmount > 100) {
      alert('单次打赏不超过100元，感谢支持 ❤️');
      return;
    }

    setLoading(true);

    // 模拟支付（后续可接入真实支付）
    alert(`感谢打赏 ¥${numAmount}！\n深度报告将自动解锁。`);

    // 标记已打赏
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepinside_tipped', 'true');
      localStorage.setItem('deepinside_tip_amount', numAmount.toString());
    }

    // 获取原始故事并进入深度版
    const story = localStorage.getItem('deepinside_original_story');
    if (story) {
      router.push(`/deep-questions/1?story=${encodeURIComponent(story)}`);
    } else {
      alert('未找到你的故事，请返回首页重新生成免费信');
      router.push('/');
    }
    
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-5xl mb-4">☕</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">请我喝杯咖啡</h1>
            <p className="text-slate-500 mb-6">
              你的支持让我能继续写出更戳心的信
            </p>
          </div>

          <div className="space-y-6">
            {/* 预设金额 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                选择金额
              </label>
              <div className="flex gap-3 justify-center">
                {presetAmounts.map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className={`px-5 py-2 rounded-full border transition ${
                      amount === amt.toString()
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400'
                    }`}
                  >
                    ¥{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义金额 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                自定义金额
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="100"
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="1-100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                金额将用于维护和迭代 DEEPINSIDE
              </p>
            </div>

            {/* 打赏按钮 */}
            <button
              onClick={handleTip}
              disabled={loading}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition disabled:bg-amber-300"
            >
              {loading ? '处理中...' : '☕ 请我喝咖啡'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              打赏后深度报告将自动解锁，无需重复付费
            </p>
          </div>
        </div>
      </div>
    </>
  );
}