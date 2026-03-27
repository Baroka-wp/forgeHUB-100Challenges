import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { chapters } from '../content/chapters';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Save, Edit3, ChevronRight, BookOpen, Layout, List, CheckCircle2, ArrowUpRight } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface DossierEntry {
  chapterId: string;
  answers: Record<number, string>;
  updatedAt: string;
}

export default function Dossier() {
  const [entries, setEntries] = useState<Record<string, DossierEntry>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnswers, setEditAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string>(chapters[0].id);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      if (!auth.currentUser) return;
      
      try {
        const dossierRef = collection(db, 'users', auth.currentUser.uid, 'dossier');
        const q = query(dossierRef);
        const querySnapshot = await getDocs(q);
        
        const dossierData: Record<string, DossierEntry> = {};
        querySnapshot.forEach((doc) => {
          dossierData[doc.id] = doc.data() as DossierEntry;
        });
        
        setEntries(dossierData);
      } catch (error) {
        console.error("Error fetching dossier:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, []);

  const scrollToChapter = (id: string) => {
    const element = document.getElementById(`chapter-${id}`);
    if (element) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveChapter(id);
    }
  };

  // Intersection Observer to update active chapter on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id.replace('chapter-', ''));
          }
        });
      },
      { threshold: 0.5, rootMargin: '-10% 0% -70% 0%' }
    );

    chapters.forEach((chapter) => {
      const el = document.getElementById(`chapter-${chapter.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  const handleEdit = (chapterId: string, currentAnswers: Record<number, string>) => {
    setEditingId(chapterId);
    setEditAnswers(currentAnswers);
  };

  const handleSave = async (chapterId: string) => {
    if (!auth.currentUser) return;
    setSaving(true);
    const entryPath = `users/${auth.currentUser.uid}/dossier/${chapterId}`;
    try {
      const entryRef = doc(db, 'users', auth.currentUser.uid, 'dossier', chapterId);
      const updatedEntry = {
        chapterId,
        answers: editAnswers,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(entryRef, updatedEntry, { merge: true });
      
      setEntries(prev => ({
        ...prev,
        [chapterId]: updatedEntry
      }));
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, entryPath);
    } finally {
      setSaving(false);
    }
  };

  const handleAnswerChange = (index: number, val: string) => {
    setEditAnswers(prev => ({ ...prev, [index]: val }));
  };

  const completedCount = Object.keys(entries).length;
  const progressPercentage = Math.round((completedCount / chapters.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-sm animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">Chargement du dossier...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Sidebar Navigation - Desktop Only */}
      <aside className="hidden lg:flex w-80 h-screen sticky top-0 border-r border-outline-variant/10 bg-surface-container-lowest flex-col p-8 overflow-y-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Layout size={20} className="text-primary" />
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tighter">Sommaire</h2>
          </div>
          
          <div className="space-y-1">
            {chapters.map((chapter, idx) => {
              const isCompleted = !!entries[chapter.id];
              const isActive = activeChapter === chapter.id;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => scrollToChapter(chapter.id)}
                  className={`w-full text-left p-3 rounded-sm transition-all group flex items-start gap-3 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className={`text-[10px] font-bold mt-1 ${isActive ? 'opacity-60' : 'text-primary'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-grow">
                    <span className={`text-xs font-bold block leading-tight ${isActive ? 'text-white' : 'text-on-surface'}`}>
                      {chapter.title}
                    </span>
                    {isCompleted && !isActive && (
                      <span className="text-[9px] uppercase tracking-widest text-primary font-black mt-1 block">Complété</span>
                    )}
                  </div>
                  {isCompleted && (
                    <CheckCircle2 size={14} className={isActive ? 'text-white' : 'text-primary'} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-outline-variant/10">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Progression Globale</span>
            <span className="text-xl font-display font-black text-primary">{progressPercentage}%</span>
          </div>
          <div className="h-1 w-full bg-surface-container-high rounded-sm overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow" ref={scrollContainerRef}>
        {/* Mobile Header - Horizontal Scroll Navigation */}
        <div className="lg:hidden sticky top-16 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 px-4 py-3 overflow-x-auto no-scrollbar flex gap-2">
          {chapters.map((chapter, idx) => (
            <button
              key={chapter.id}
              onClick={() => scrollToChapter(chapter.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeChapter === chapter.id 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/10'
              }`}
            >
              {idx + 1}. {chapter.title}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12 py-12 md:py-24">
          <header className="mb-16 md:mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-primary/30" />
                <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/60">
                  Archives Stratégiques
                </span>
              </div>
              <h1 className="text-5xl md:text-9xl font-display font-black text-on-surface leading-[0.85] mb-10 tracking-tighter uppercase">
                Mon Dossier <br />
                <span className="text-primary">d'Entrepreneur</span>
              </h1>
              <p className="text-lg md:text-2xl font-sans text-on-surface-variant max-w-2xl leading-relaxed font-medium opacity-80">
                Le recueil de vos réflexions, analyses et stratégies. Chaque réponse est une pierre angulaire de votre futur empire.
              </p>
            </motion.div>
          </header>

          <div className="space-y-24 md:space-y-48">
            {chapters.map((chapter, chapterIndex) => {
              const entry = entries[chapter.id];
              const isEditing = editingId === chapter.id;

              return (
                <section 
                  id={`chapter-${chapter.id}`}
                  key={chapter.id}
                  className="scroll-mt-32"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 pb-8 border-b border-outline-variant/20">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl md:text-6xl font-display font-black text-primary/10">
                          {String(chapterIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] md:text-xs font-sans font-black uppercase tracking-[0.3em] text-primary/40">
                          {chapter.exercise.category}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-display font-black text-on-surface leading-none uppercase tracking-tighter">
                        {chapter.title}
                      </h2>
                    </div>
                    
                    {!isEditing && entry && (
                      <button 
                        onClick={() => handleEdit(chapter.id, entry.answers)}
                        className="group flex items-center gap-3 px-6 py-3 bg-surface-container-high text-primary rounded-sm text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                      >
                        <Edit3 size={14} />
                        Modifier
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    {isEditing ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-12 bg-surface-container-lowest p-6 md:p-12 border border-primary/20 rounded-sm shadow-2xl shadow-primary/5"
                      >
                        {chapter.exercise.questions.map((question, index) => (
                          <div key={index} className="space-y-6">
                            <label className="text-sm md:text-base font-sans font-bold text-on-surface flex gap-4 leading-tight">
                              <span className="text-primary font-black">{index + 1}.</span>
                              {question}
                            </label>
                            <div className="bg-surface border border-outline-variant/10 focus-within:border-primary/30 transition-all rounded-sm overflow-hidden">
                              <ReactQuill 
                                theme="snow" 
                                value={editAnswers[index] || ''} 
                                onChange={(val) => handleAnswerChange(index, val)}
                                className="h-64 md:h-96 mb-12"
                              />
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex flex-col md:flex-row justify-end items-center gap-6 pt-12 border-t border-outline-variant/10">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
                          >
                            Annuler
                          </button>
                          <button 
                            onClick={() => handleSave(chapter.id)}
                            disabled={saving}
                            className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                          >
                            {saving ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                            ) : <Save size={16} />}
                            {saving ? 'Enregistrement...' : 'Sauvegarder les changements'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="min-h-[200px]">
                        {entry ? (
                          <div className="space-y-16 md:space-y-24">
                            {chapter.exercise.questions.map((question, index) => (
                              <div key={index} className="group">
                                <h3 className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                                  <span className="w-8 h-[1px] bg-primary/20" />
                                  {question}
                                </h3>
                                <div 
                                  className="prose prose-slate prose-lg md:prose-xl max-w-none text-on-surface font-sans leading-relaxed break-words pl-0 md:pl-12"
                                  dangerouslySetInnerHTML={{ 
                                    __html: entry.answers[index] || '<p class="italic text-on-surface-variant/30">Aucune réponse enregistrée.</p>' 
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-20 md:py-32 bg-surface-container-low/20 border border-dashed border-outline-variant/20 rounded-sm flex flex-col items-center text-center px-6">
                            <div className="w-20 h-20 bg-surface-container-high rounded-sm flex items-center justify-center mb-8 text-on-surface-variant/20">
                              <BookOpen size={40} />
                            </div>
                            <h4 className="text-xl md:text-2xl font-display font-bold text-on-surface mb-4">Chapitre non complété</h4>
                            <p className="text-on-surface-variant font-medium max-w-md mb-10 opacity-70">
                              Les réponses de ce chapitre apparaîtront ici une fois que vous aurez terminé l'exercice correspondant.
                            </p>
                            <Link 
                              to={`/chapter/${chapter.id}`}
                              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-sm hover:shadow-xl hover:shadow-primary/20 transition-all group text-xs"
                            >
                              Accéder au chapitre 
                              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
