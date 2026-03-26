import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
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
      console.error("Error saving dossier entry:", error);
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-sm text-primary">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl font-display font-extrabold text-primary">Mon Dossier d'Entrepreneur</h1>
        </div>
        <p className="text-xl text-secondary">
          Retrouvez ici toutes vos réflexions et stratégies élaborées au fil de la formation.
        </p>
      </header>

      <div className="space-y-8">
        {chapters.map((chapter) => {
          const entry = entries[chapter.id];
          const isEditing = editingId === chapter.id;

          return (
            <motion.div 
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm"
            >
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-slate-200 px-2 py-1 rounded-sm">
                    {chapter.exercise.category}
                  </span>
                  <h2 className="text-lg font-bold text-primary">{chapter.title}</h2>
                </div>
                {!isEditing && entry && (
                  <button 
                    onClick={() => handleEdit(chapter.id, entry.answers)}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
                  >
                    <Edit3 size={16} />
                    Modifier
                  </button>
                )}
              </div>

              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-8">
                    {chapter.exercise.questions.map((question, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-sm font-bold text-primary">{index + 1}. {question}</h3>
                        <div className="bg-white">
                          <ReactQuill 
                            theme="snow" 
                            value={editAnswers[index] || ''} 
                            onChange={(val) => handleAnswerChange(index, val)}
                            className="h-48 mb-12"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end gap-4 mt-8">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={() => handleSave(chapter.id)}
                        disabled={saving}
                        className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? 'Enregistrement...' : (
                          <>
                            <Save size={16} />
                            Enregistrer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {entry ? (
                      <div className="space-y-8">
                        {chapter.exercise.questions.map((question, index) => (
                          <div key={index} className="border-l-2 border-slate-100 pl-4">
                            <h3 className="text-sm font-bold text-secondary mb-2 uppercase tracking-wider">{question}</h3>
                            <div 
                              className="prose prose-slate max-w-none text-primary"
                              dangerouslySetInnerHTML={{ __html: entry.answers[index] || '<p className="italic text-slate-400">Pas de réponse.</p>' }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-sm">
                        <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-secondary font-medium">
                          Vous n'avez pas encore complété l'exercice de ce chapitre.
                        </p>
                        <Link 
                          to={`/chapter/${chapter.id}`}
                          className="mt-4 inline-flex items-center gap-2 text-primary font-bold hover:underline"
                        >
                          Aller au chapitre <ChevronRight size={16} />
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
  );
}
