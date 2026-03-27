import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { chapters } from '../content/chapters';
import { motion } from 'motion/react';
import { Users, BookOpen, Clock, Shield, Search, ChevronRight, ArrowUpRight, Filter, ArrowLeft } from 'lucide-react';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  completedChapters: string[];
  lastLogin: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('lastLogin', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const usersData: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          usersData.push(doc.data() as UserProfile);
        });
        
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-sm animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">Initialisation du Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 z-50 border-r border-outline-variant/10 bg-surface-container-lowest flex-col p-8">
        <div className="mb-12">
          <Link to="/dashboard" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all mb-10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Retour au site</span>
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Shield size={20} className="text-primary" />
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tighter">Admin</h2>
          </div>

          <nav className="space-y-2">
            <Link to="/admin" className="w-full flex items-center gap-3 p-3 rounded-sm bg-primary text-white shadow-lg shadow-primary/20 transition-all">
              <Users size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Utilisateurs</span>
            </Link>
            <Link to="/admin/events" className="w-full flex items-center gap-3 p-3 rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all">
              <Clock size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Événements</span>
            </Link>
            {/* Placeholder for future admin sections */}
            <button className="w-full flex items-center gap-3 p-3 rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all opacity-40 cursor-not-allowed">
              <BookOpen size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Contenu</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto pt-8 border-t border-outline-variant/10">
          <div className="p-4 bg-surface-container-low rounded-sm border border-outline-variant/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Total Utilisateurs</span>
            <span className="text-3xl font-display font-black text-primary">{users.length}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 lg:p-16 lg:ml-72">
        <header className="mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-primary/30" />
              <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/60">
                Contrôle de Gestion
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-black text-on-surface leading-[0.85] mb-10 tracking-tighter uppercase">
              Gestion des <br />
              <span className="text-primary">Utilisateurs</span>
            </h1>
          </motion.div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mt-12">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
              <input 
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="bg-surface-container-low border border-outline-variant/20 rounded-sm px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant focus:outline-none focus:border-primary/40"
              >
                <option value="all">Tous les rôles</option>
                <option value="user">Utilisateurs</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </header>

        {/* Users Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Utilisateur</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Rôle</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Progression</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Dernière Connexion</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filteredUsers.map((user, idx) => {
                  const progress = Math.round(((user.completedChapters?.length || 0) / chapters.length) * 100);
                  
                  return (
                    <motion.tr 
                      key={user.uid}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-surface-container-low/30 transition-colors group"
                    >
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-on-surface">{user.displayName || 'Utilisateur'}</span>
                          <span className="text-xs text-on-surface-variant opacity-60">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                          user.role === 'admin' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-2 w-32">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                            <span>{user.completedChapters?.length || 0}/{chapters.length}</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-surface-container-high rounded-sm overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                          <Clock size={12} className="opacity-40" />
                          {formatDate(user.lastLogin)}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-xs font-medium text-on-surface-variant opacity-60">
                          {formatDate(user.createdAt).split(' à')[0]}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-sm flex items-center justify-center mx-auto mb-6 text-on-surface-variant/20">
                <Search size={32} />
              </div>
              <p className="text-on-surface-variant font-medium">Aucun utilisateur ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
