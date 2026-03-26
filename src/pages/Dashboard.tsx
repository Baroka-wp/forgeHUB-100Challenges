import { useAuth } from '../App';
import { chapters } from '../content/chapters';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Play, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, userData } = useAuth();
  const completedCount = userData?.completedChapters?.length || 0;
  const progressPercentage = Math.round((completedCount / chapters.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-display font-extrabold text-primary mb-4">
          Bonjour, {userData?.displayName || user?.email?.split('@')[0]}
        </h1>
        <p className="text-xl text-secondary">
          Continuez votre formation pour transformer votre idée en produit à succès.
        </p>
      </header>

      {/* Progress Card */}
      <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeDasharray="100, 100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-primary"
              strokeDasharray={`${progressPercentage}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
          </div>
        </div>
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-2xl font-bold text-primary mb-2">Votre progression globale</h2>
          <p className="text-secondary mb-4">
            Vous avez complété {completedCount} chapitres sur {chapters.length}. 
            {completedCount === chapters.length ? " Félicitations ! Vous avez terminé la formation." : " Continuez comme ça !"}
          </p>
          {completedCount === chapters.length && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm">
              <Award size={18} />
              Certificat disponible
            </div>
          )}
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chapters.map((chapter, index) => {
          const isCompleted = userData?.completedChapters?.includes(chapter.id);
          const isLocked = index > 0 && !userData?.completedChapters?.includes(chapters[index - 1].id);

          return (
            <motion.div
              key={chapter.id}
              whileHover={!isLocked ? { y: -5 } : {}}
              className={`bg-white rounded-sm p-8 border border-slate-100 shadow-sm flex flex-col h-full ${isLocked ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Chapitre {index + 1}</span>
                {isCompleted ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <Circle className="text-slate-200" size={24} />
                )}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{chapter.title}</h3>
              <p className="text-secondary text-sm mb-8 flex-grow">{chapter.description}</p>
              
              {isLocked ? (
                <div className="text-center py-3 bg-slate-50 rounded-sm text-slate-400 font-bold text-sm">
                  Complétez le chapitre précédent
                </div>
              ) : (
                <Link
                  to={`/chapter/${chapter.id}`}
                  className={`flex items-center justify-center gap-2 py-4 rounded-sm font-bold transition-all ${
                    isCompleted 
                      ? 'bg-neutral text-primary hover:bg-slate-100' 
                      : 'bg-primary text-white hover:bg-opacity-90 shadow-md'
                  }`}
                >
                  {isCompleted ? 'Revoir' : 'Commencer'}
                  <Play size={18} fill={isCompleted ? 'none' : 'currentColor'} />
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
