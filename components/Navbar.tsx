import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const links = [
    { name: '首页', path: '/' },
    { name: '场景', path: '/scene' },
    { name: '关于', path: '/about' },
    { name: '反馈', path: '/feedback' },
    { name: '历史', path: '/history' },
    { name: '付费', path: '/pay' },
    { name: '分享', path: '/share' },
    { name: '联系', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-slate-800">
            DEEPINSIDE
          </Link>
          <div className="hidden md:flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition ${
                  router.pathname === link.path
                    ? 'text-blue-600 font-medium'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}