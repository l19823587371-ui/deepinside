import Navbar from '../components/Navbar';

export default function Pay() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">解锁深度拆解版</h1>
          <p className="text-slate-600 mb-6">
            包含「维持现状 vs 主动改变」双路径完整推演<br />
            未来 5 年关键节点 + 你的专属破局路线
          </p>
          <div className="bg-slate-100 p-4 rounded-lg mb-6">
            <p className="text-2xl font-bold">¥29.9</p>
            <p className="text-sm text-slate-500">一杯咖啡的价格，换一次灵魂校准</p>
          </div>
          <button
            onClick={() => alert('请添加微信支付，或联系客服')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold"
          >
            立即解锁
          </button>
        </div>
      </div>
    </>
  );
}