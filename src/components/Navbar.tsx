import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { auth } from '../firebase';
import { LogOut, User, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-primary text-white p-1.5 rounded-sm">
          <BookOpen size={24} />
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-primary">ForgeHub</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-secondary hover:text-primary font-medium transition-colors">
              Ma Formation
            </Link>
            <Link to="/dossier" className="text-secondary hover:text-primary font-medium transition-colors">
              Mon Dossier
            </Link>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-primary">{userData?.displayName || user.email}</span>
                <span className="text-xs text-secondary">{userData?.completedChapters?.length || 0} chapitres terminés</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-secondary hover:text-red-500 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-secondary hover:text-primary font-medium transition-colors">
              Connexion
            </Link>
            <Link 
              to="/signup" 
              className="bg-primary text-white px-5 py-2 rounded-sm font-medium hover:bg-opacity-90 transition-all shadow-sm"
            >
              Démarrer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
