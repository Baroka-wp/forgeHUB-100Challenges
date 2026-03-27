import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { chapters } from '../content/chapters';
import { motion } from 'motion/react';
import { FileText, Save, Edit3, ChevronRight, BookOpen } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <header className="mb-20 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-primary/30" />
              <span className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-primary/60">
                Archives Stratégiques
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-extrabold text-on-surface leading-none tracking-tighter mb-8">
              Mon Dossier <br />
              <span className="text-primary">d'Entrepreneur</span>
            </h1>
            <p className="text-xl font-sans text-on-surface-variant max-w-2xl leading-relaxed">
              Le recueil de vos réflexions, analyses et stratégies. Chaque réponse est une pierre angulaire de votre futur empire.
            </p>
          </motion.div>
          
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-sm blur-3xl -z-10" />
        </header>

        <div className="space-y-12">
          {chapters.map((chapter, chapterIndex) => {
            const entry = entries[chapter.id];
            const isEditing = editingId === chapter.id;

            return (
              <motion.div 
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chapterIndex * 0.1 }}
                className="bg-surface-container-lowest rounded-sm overflow-hidden border border-outline-variant/10"
              >
                <div className="px-8 py-6 flex justify-between items-center bg-surface-bright/50 border-b border-outline-variant/5">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-display font-black text-primary/10 select-none">
                      {String(chapterIndex + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/60 block mb-1">
                        {chapter.exercise.category}
                      </span>
                      <h2 className="text-xl font-display font-bold text-on-surface">{chapter.title}</h2>
                    </div>
                  </div>
                  {!isEditing && entry && (
                    <button 
                      onClick={() => handleEdit(chapter.id, entry.answers)}
                      className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-sans font-bold text-primary hover:bg-primary/5 transition-all"
                    >
                      <Edit3 size={16} />
                      Modifier
                    </button>
                  )}
                </div>

                <div className="p-8">
                  {isEditing ? (
                    <div className="space-y-12">
                      {chapter.exercise.questions.map((question, index) => (
                        <div key={index} className="space-y-4">
                          <label className="text-sm font-sans font-bold text-on-surface flex gap-3">
                            <span className="text-primary/40">{index + 1}.</span>
                            {question}
                          </label>
                          <div className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 focus-within:border-primary/20 transition-all">
                            <ReactQuill 
                              theme="snow" 
                              value={editAnswers[index] || ''} 
                              onChange={(val) => handleAnswerChange(index, val)}
                              className="h-64 mb-12"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end items-center gap-6 pt-6 border-t border-outline-variant/5">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="text-sm font-sans font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                          Annuler
                        </button>
                        <button 
                          onClick={() => handleSave(chapter.id)}
                          disabled={saving}
                          className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-sm text-sm font-sans font-bold hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                          ) : <Save size={18} />}
                          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {entry ? (
                        <div className="space-y-12">
                          {chapter.exercise.questions.map((question, index) => (
                            <div key={index} className="relative pl-8">
                              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/20 to-transparent" />
                              <h3 className="text-[11px] font-sans font-bold text-primary/40 uppercase tracking-[0.2em] mb-4">
                                {question}
                              </h3>
                              <div 
                                className="prose prose-slate max-w-none text-on-surface font-sans leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                  __html: entry.answers[index] || '<p class="italic text-on-surface-variant/40">Aucune réponse enregistrée pour cette section.</p>' 
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-surface-container-low/30 border border-dashed border-outline-variant/20 rounded-sm">
                          <div className="w-16 h-16 bg-surface-container-high rounded-sm flex items-center justify-center mx-auto mb-6 text-on-surface-variant/30">
                            <BookOpen size={32} />
                          </div>
                          <p className="text-on-surface-variant font-sans font-medium mb-6">
                            Vous n'avez pas encore complété l'exercice de ce chapitre.
                          </p>
                          <Link 
                            to={`/chapter/${chapter.id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-high text-primary font-sans font-bold rounded-sm hover:bg-surface-container-highest transition-all group"
                          >
                            Aller au chapitre 
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
