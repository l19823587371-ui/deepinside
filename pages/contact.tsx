import Navbar from '../components/Navbar';

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">联系我们</h1>
          <p className="text-slate-600 mb-2">📧 deepinside@email.com</p>
          <p className="text-slate-600">💬 公众号：DEEPINSIDE</p>
        </div>
      </div>
    </>
  );
}