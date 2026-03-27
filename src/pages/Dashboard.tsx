import { useAuth } from '../App';
import { chapters } from '../content/chapters';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Play, Award, Calendar, ChevronRight, Clock, MapPin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  locationType: 'presentiel' | 'webinaire';
  date: string;
}

export default function Dashboard() {
  const { user, userData } = useAuth();
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const completedCount = userData?.completedChapters?.length || 0;
  const progressPercentage = Math.round((completedCount / chapters.length) * 100);

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(
          eventsRef, 
          where('date', '>=', new Date().toISOString()),
          orderBy('date', 'asc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setNextEvent({ id: doc.id, ...doc.data() } as Event);
        }
      } catch (error) {
        console.error("Error fetching next event:", error);
      }
    };
    fetchNextEvent();
  }, []);

  return (
    <div className="min-h-screen bg-surface py-8 md:py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Event Announcement Banner */}
        <AnimatePresence>
          {nextEvent && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 bg-primary/5 border border-primary/20 rounded-sm overflow-hidden group hover:bg-primary/10 transition-all"
            >
              <Link to="/events" className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Prochain Événement</span>
                      <div className="w-1 h-1 bg-primary/30 rounded-full" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
                        {new Date(nextEvent.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-display font-black text-on-surface uppercase tracking-tight">
                      {nextEvent.title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mr-8">
                    <div className="flex items-center gap-2">
                      {nextEvent.locationType === 'webinaire' ? <Globe size={14} /> : <MapPin size={14} />}
                      {nextEvent.locationType === 'webinaire' ? 'Webinaire' : nextEvent.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 group-hover:gap-5 transition-all w-full md:w-auto justify-center">
                    S'inscrire
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Asymmetrical Header Section */}
        <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 md:gap-12 mb-12 md:mb-24">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-4 md:mb-6 block opacity-70">
              Tableau de bord de Direction
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-extrabold text-primary leading-[0.9] tracking-tighter mb-6 md:mb-8">
              Bonjour, <br />
              <span className="text-on-surface">{userData?.displayName || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-lg leading-relaxed">
              Maintenez votre vision. Chaque chapitre est une étape vers la maîtrise de votre produit.
            </p>
          </div>
          
          {/* Zen Tracker - Custom Component */}
          <div className="w-full lg:w-96 bg-surface-container-low p-6 md:p-8 rounded-sm border border-outline-variant/20">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Progression Visionnaire</span>
              <span className="text-2xl md:text-3xl font-display font-extrabold text-primary">{progressPercentage}%</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {chapters.map((chapter, index) => {
            const isCompleted = userData?.completedChapters?.includes(chapter.id);
            const isLocked = index > 0 && !userData?.completedChapters?.includes(chapters[index - 1].id);

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative bg-surface-container-lowest p-6 md:p-10 rounded-sm border border-outline-variant/10 transition-all duration-500 ${
                  isLocked ? 'opacity-40 grayscale pointer-events-none' : 'hover:bg-surface-container-high hover:-translate-y-2'
                }`}
              >
                {/* Chapter Number - Editorial Style */}
                <div className="absolute -top-4 -left-2 md:-top-6 md:-left-4 text-7xl md:text-9xl font-display font-black text-on-surface/[0.03] select-none group-hover:text-primary/[0.05] transition-colors">
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
