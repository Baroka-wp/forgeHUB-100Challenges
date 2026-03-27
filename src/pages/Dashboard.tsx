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
    <div className="min-h-screen bg-surface py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Asymmetrical Header Section */}
        <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-6 block opacity-70">
              Tableau de bord de Direction
            </span>
            <h1 className="text-6xl lg:text-8xl font-display font-extrabold text-primary leading-[0.9] tracking-tighter mb-8">
              Bonjour, <br />
              <span className="text-on-surface">{userData?.displayName || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-xl text-on-surface-variant font-medium max-w-lg leading-relaxed">
              Maintenez votre vision. Chaque chapitre est une étape vers la maîtrise de votre produit.
            </p>
          </div>
          
          {/* Zen Tracker - Custom Component */}
          <div className="w-full lg:w-96 bg-surface-container-low p-8 rounded-sm border border-outline-variant/20">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Progression Visionnaire</span>
              <span className="text-3xl font-display font-extrabold text-primary">{progressPercentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container-high rounded-sm overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-primary relative"
              >
                {/* Asymmetrical Glow at the leading edge */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/40 blur-xl rounded-sm" />
              </motion.div>
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">
              <span>{completedCount} Complétés</span>
              <span>{chapters.length} Total</span>
            </div>
          </div>
        </header>

        {/* Chapters Grid - Tonal Layering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {chapters.map((chapter, index) => {
            const isCompleted = userData?.completedChapters?.includes(chapter.id);
            const isLocked = index > 0 && !userData?.completedChapters?.includes(chapters[index - 1].id);

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative bg-surface-container-lowest p-10 rounded-sm border border-outline-variant/10 transition-all duration-500 ${
                  isLocked ? 'opacity-40 grayscale pointer-events-none' : 'hover:bg-surface-container-high hover:-translate-y-2'
                }`}
              >
                {/* Chapter Number - Editorial Style */}
                <div className="absolute -top-6 -left-4 text-9xl font-display font-black text-on-surface/[0.03] select-none group-hover:text-primary/[0.05] transition-colors">
                  {index + 1}
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
                      Module {index + 1}
                    </span>
                    {isCompleted && (
                      <div className="bg-primary/10 text-primary p-1.5 rounded-sm">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-display font-extrabold text-on-surface mb-6 leading-tight group-hover:text-primary transition-colors">
                    {chapter.title}
                  </h3>
                  
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-12 flex-grow font-medium opacity-80">
                    {chapter.description}
                  </p>

                  <div className="mt-auto">
                    {isLocked ? (
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40">
                        <Circle size={12} />
                        <span>Verrouillé</span>
                      </div>
                    ) : (
                      <Link
                        to={`/chapter/${chapter.id}`}
                        className={`inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                          isCompleted ? 'text-on-surface-variant hover:text-primary' : 'text-primary group-hover:gap-5'
                        }`}
                      >
                        <span>{isCompleted ? 'Revoir' : 'Commencer'}</span>
                        <Play size={12} fill={isCompleted ? 'none' : 'currentColor'} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
