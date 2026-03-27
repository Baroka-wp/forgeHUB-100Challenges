import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { auth } from '../firebase';
import { LogOut, User } from 'lucide-react';
import { Logo } from './Logo';

export default function Navbar() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3">
        <Logo />
      </Link>

      <div className="flex items-center gap-8">
        {user ? (
          <>
            <Link to="/dashboard" className="text-on-surface-variant hover:text-primary font-semibold transition-all text-sm uppercase tracking-widest">
              Formation
            </Link>
            <Link to="/dossier" className="text-on-surface-variant hover:text-primary font-semibold transition-all text-sm uppercase tracking-widest">
              Dossier
            </Link>
            <div className="flex items-center gap-5 pl-8 border-l border-outline-variant/20">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-on-surface">{userData?.displayName || user.email}</span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
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
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-on-surface-variant hover:text-primary font-bold transition-colors text-sm uppercase tracking-widest">
              Connexion
            </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-sm font-bold border border-white/10 transition-all text-sm uppercase tracking-widest"
              >
              Démarrer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
