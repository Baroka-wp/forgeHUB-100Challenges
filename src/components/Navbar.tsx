import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { auth } from '../firebase';
import { LogOut, User, Calendar } from 'lucide-react';
import { Logo } from './Logo';

export default function Navbar() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/admin') return null;

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 md:gap-3">
        <Logo textClassName="hidden sm:block" />
      </Link>

      <div className="flex items-center gap-4 md:gap-8">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-on-surface-variant hover:text-primary font-semibold transition-all text-sm uppercase tracking-widest">
                Formation
              </Link>
              <Link to="/dossier" className="text-on-surface-variant hover:text-primary font-semibold transition-all text-sm uppercase tracking-widest">
                Dossier
              </Link>
              <Link to="/events" className="text-on-surface-variant hover:text-primary transition-all p-2 bg-surface-container-low rounded-sm hover:scale-110 active:scale-95" title="Calendrier des événements">
                <Calendar size={18} />
              </Link>
              {(userData?.role === 'admin' || user?.email === 'birotori@gmail.com') && (
                <Link to="/admin" className="text-primary hover:text-primary-container font-black transition-all text-sm uppercase tracking-[0.2em] border-l border-outline-variant/20 pl-8">
                  Admin
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3 md:gap-5 md:pl-8 md:border-l border-outline-variant/20">
              <div className="flex flex-col items-end">
                <span className="text-xs md:text-sm font-bold text-on-surface truncate max-w-[150px] md:max-w-none">
                  {userData?.displayName || user.email?.split('@')[0]}
                </span>
                <span className="hidden md:block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
                  {userData?.completedChapters?.length || 0} Chapitres
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                title="Déconnexion"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/login" className="text-on-surface-variant hover:text-primary font-bold transition-colors text-xs md:text-sm uppercase tracking-widest">
              Connexion
            </Link>
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-4 md:px-6 py-1.5 md:py-2 rounded-sm font-bold border border-white/10 transition-all text-xs md:text-sm uppercase tracking-widest"
            >
              Démarrer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
