import { useRouter } from 'next/router';

export default function Scene() {
  const router = useRouter();

  const scenes = [
    { name: '职场', path: '/input/work', desc: '工作上的困惑、瓶颈、选择' },
    { name: '爱情', path: '/input/love', desc: '亲密关系里的不安、期待、卡点' },
    { name: '成长', path: '/input/growth', desc: '拖延、内耗、迷茫、自我怀疑' },
    { name: '家庭', path: '/input/family', desc: '与父母、家人的关系模式' },
    { name: '友情', path: '/input/friend', desc: '朋友间的疏远、依赖、边界' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">DEEPINSIDE</h1>
          <p className="text-slate-500">选择你想探索的领域</p>
        </div>

        <div className="space-y-4">
          {scenes.map((scene) => (
            <button
              key={scene.name}
              onClick={() => router.push(scene.path)}
              className="w-full bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-slate-800">{scene.name}</h2>
              <p className="text-slate-500 mt-1">{scene.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}