import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Home, Shield } from 'lucide-react';
import { useAuth } from '../App';

export default function BottomNav() {
  const { user, userData } = useAuth();
  const location = useLocation();

  if (!user || location.pathname === '/admin') return null;

  const navItems = [
    { label: 'Accueil', icon: Home, path: '/' },
    { label: 'Formation', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Dossier', icon: FileText, path: '/dossier' },
  ];

  if (userData?.role === 'admin' || user?.email === 'birotori@gmail.com') {
    navItems.push({ label: 'Admin', icon: Shield, path: '/admin' });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/15 z-50 px-4 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-primary' : 'text-on-surface-variant/60'
              }`}
            >
              <div className={`p-1 rounded-sm transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
