import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { chapters } from '../content/chapters';
import { useAuth } from '../App';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';
import { ArrowLeft, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Save, FileText, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function ChapterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, string>>({});
  const [savingExercise, setSavingExercise] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const chapterIndex = chapters.findIndex(c => c.id === id);
  const chapter = chapters[chapterIndex];
  const nextChapter = chapters[chapterIndex + 1];
  const prevChapter = chapters[chapterIndex - 1];

  useEffect(() => {
    if (!chapter) {
      navigate('/dashboard');
      return;
    }

    // Access control: check if previous chapter is completed
    if (userData) {
      const isLocked = chapterIndex > 0 && !userData.completedChapters?.includes(chapters[chapterIndex - 1].id);
      if (isLocked) {
        navigate('/dashboard');
        return;
      }
    }

    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(chapter.file);
        const text = await response.text();
        setContent(text);

        // Fetch existing exercise if any
        if (user && id) {
          const entryRef = doc(db, 'users', user.uid, 'dossier', id);
          const entrySnap = await getDoc(entryRef);
          if (entrySnap.exists()) {
            const data = entrySnap.data();
            setExerciseAnswers(data.answers || {});
          } else {
            setExerciseAnswers({});
          }
        }
      } catch (error) {
        console.error("Error fetching chapter content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    // Reset quiz/exercise state when chapter changes
    setExerciseStarted(false);
    setQuizStarted(false);
    setCurrentQuizStep(0);
    setSelectedOption(null);
    setQuizResults([]);
    setQuizFinished(false);
    window.scrollTo(0, 0);
  }, [id, chapter, navigate, user, userData, chapterIndex]);

  const handleSaveExercise = async () => {
    if (!user || !id) return;
    
    // Check if all questions are answered
    const allAnswered = chapter.exercise.questions.every((_, i) => 
      exerciseAnswers[i] && exerciseAnswers[i].replace(/<[^>]*>/g, '').trim().length > 0
    );

    if (!allAnswered) {
      alert("Veuillez répondre à toutes les questions de l'exercice avant de continuer.");
      return;
    }

    setSavingExercise(true);
    const entryPath = `users/${user.uid}/dossier/${id}`;
    try {
      const entryRef = doc(db, 'users', user.uid, 'dossier', id);
      await setDoc(entryRef, {
        chapterId: id,
        answers: exerciseAnswers,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setExerciseStarted(false);
      setQuizStarted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, entryPath);
    } finally {
      setSavingExercise(false);
    }
  };

  const handleAnswerChange = (index: number, val: string) => {
    setExerciseAnswers(prev => ({ ...prev, [index]: val }));
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuizStep = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === chapter.quiz[currentQuizStep].answer;
    const newResults = [...quizResults, isCorrect];
    setQuizResults(newResults);

    if (currentQuizStep < chapter.quiz.length - 1) {
      setCurrentQuizStep(currentQuizStep + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      if (newResults.every(r => r === true)) {
        markAsCompleted();
      }
    }
  };

  const markAsCompleted = async () => {
    if (!user || !id) return;
    const userPath = `users/${user.uid}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        completedChapters: arrayUnion(id)
      });
      await refreshUserData();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, userPath);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* Chapter Header - Glassmorphism */}
      <div className="bg-surface-bright/70 backdrop-blur-xl border-b border-outline-variant/10 py-6 px-8 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 text-on-surface-variant hover:text-primary font-bold transition-all text-[10px] uppercase tracking-[0.2em]">
            <ArrowLeft size={16} />
            <span>Tableau de bord</span>
          </Link>
          <div className="text-right">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] block mb-1 opacity-60">Module {chapterIndex + 1}</span>
            <h1 className="text-xl font-display font-extrabold text-primary tracking-tight">{chapter.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-24">
        <AnimatePresence mode="wait">
          {!exerciseStarted && !quizStarted ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-surface-container-lowest p-12 md:p-24 rounded-xl shadow-[0_4px_30px_rgba(25,28,30,0.03)]"
            >
              <div className="markdown-body">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
              </div>

              <div className="mt-24 pt-16 border-t border-outline-variant/10 flex flex-col items-start max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Prochaine Étape</span>
                <h3 className="text-4xl font-display font-extrabold text-on-surface mb-8 leading-tight">Prêt à ancrer ces concepts ?</h3>
                <p className="text-lg text-on-surface-variant font-medium mb-12 leading-relaxed opacity-80">
                  Complétez votre dossier d'entrepreneur pour ce chapitre avant de passer au quiz de validation.
                </p>
                <button
                  onClick={() => setExerciseStarted(true)}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-4"
                >
                  Démarrer l'Exercice
                  <FileText size={18} />
                </button>
              </div>
            </motion.div>
          ) : exerciseStarted ? (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-surface-container-lowest p-12 md:p-24 rounded-xl shadow-[0_4px_30px_rgba(25,28,30,0.03)]"
            >
              <div className="mb-16">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] block mb-4">
                  Dossier : {chapter.exercise.category}
                </span>
                <h2 className="text-4xl font-display font-extrabold text-on-surface mb-6">Réflexion Stratégique</h2>
                <p className="text-on-surface-variant font-medium opacity-70">
                  Répondez avec précision pour construire les fondations de votre projet.
                </p>
              </div>

              <div className="space-y-20">
                {chapter.exercise.questions.map((question, index) => (
                  <div key={index} className="space-y-6">
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-display font-black text-primary/10">{index + 1}</span>
                      <h3 className="text-xl font-display font-extrabold text-on-surface leading-tight">{question}</h3>
                    </div>
                    <div className="bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/10 focus-within:border-primary/20 transition-all">
                      <ReactQuill 
                        theme="snow" 
                        value={exerciseAnswers[index] || ''} 
                        onChange={(val) => handleAnswerChange(index, val)}
                        className="min-h-[250px]"
                        placeholder="Saisissez votre réflexion ici..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-24 pt-12 border-t border-outline-variant/10 gap-8">
                <button 
                  onClick={() => setExerciseStarted(false)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all"
                >
                  Retour au cours
                </button>
                <button
                  onClick={handleSaveExercise}
                  disabled={savingExercise}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  {savingExercise ? 'Enregistrement...' : (
                    <>
                      Valider et passer au Quiz
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : !quizFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest p-12 md:p-24 rounded-xl shadow-[0_10px_50px_rgba(25,28,30,0.05)]"
            >
              <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Validation des Acquis</span>
                  <span className="text-sm font-bold text-on-surface-variant opacity-60">Question {currentQuizStep + 1} sur {chapter.quiz.length}</span>
                </div>
                <div className="flex gap-2">
                  {chapter.quiz.map((_, i) => (
                    <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${i <= currentQuizStep ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                  ))}
                </div>
              </div>

              <h2 className="text-4xl font-display font-extrabold text-on-surface mb-16 leading-[1.1] tracking-tight max-w-3xl">
                {chapter.quiz[currentQuizStep].question}
              </h2>

              <div className="grid grid-cols-1 gap-4 mb-16">
                {chapter.quiz[currentQuizStep].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    className={`w-full text-left p-8 rounded-xl transition-all duration-300 font-bold text-lg flex items-center justify-between group ${
                      selectedOption === i 
                        ? 'bg-primary text-on-primary shadow-xl shadow-primary/20' 
                        : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <span className="flex-grow pr-8 leading-tight">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedOption === i ? 'border-on-primary bg-on-primary' : 'border-outline-variant/30 group-hover:border-primary/30'
                    }`}>
                      {selectedOption === i && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextQuizStep}
                disabled={selectedOption === null}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-6 rounded-md font-bold text-sm uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-30 flex items-center justify-center gap-4"
              >
                <span>{currentQuizStep === chapter.quiz.length - 1 ? 'Terminer la validation' : 'Question suivante'}</span>
                <ChevronRight size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest p-12 md:p-24 rounded-xl shadow-[0_10px_50px_rgba(25,28,30,0.05)] text-center"
            >
              {quizResults.every(r => r === true) ? (
                <>
                  <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-10">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-5xl font-display font-extrabold text-on-surface mb-6 tracking-tight">Maîtrise Validée</h2>
                  <p className="text-xl text-on-surface-variant font-medium mb-16 max-w-xl mx-auto leading-relaxed opacity-80">
                    Vous avez démontré une compréhension parfaite des concepts. Le chapitre est désormais ancré dans votre parcours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link 
                      to="/dashboard" 
                      className="px-10 py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all"
                    >
                      Tableau de bord
                    </Link>
                    {nextChapter && (
                      <Link 
                        to={`/chapter/${nextChapter.id}`}
                        className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-4"
                      >
                        Chapitre suivant
                        <ChevronRight size={18} />
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-10">
                    <AlertCircle size={48} />
                  </div>
                  <h2 className="text-5xl font-display font-extrabold text-on-surface mb-6 tracking-tight">Révision Nécessaire</h2>
                  <p className="text-xl text-on-surface-variant font-medium mb-16 max-w-xl mx-auto leading-relaxed opacity-80">
                    Certains concepts demandent encore de la précision. Prenez le temps de relire le chapitre pour asseoir votre autorité sur le sujet.
                  </p>
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizFinished(false);
                      setCurrentQuizStep(0);
                      setSelectedOption(null);
                      setQuizResults([]);
                    }}
                    className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-12 py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all"
                  >
                    Réessayer la validation
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons (only when reading content) */}
        {!quizStarted && (
          <div className="mt-24 flex items-center justify-between">
            {prevChapter ? (
              <Link 
                to={`/chapter/${prevChapter.id}`}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all"
              >
                <ChevronLeft size={16} />
                <span>Précédent</span>
              </Link>
            ) : <div></div>}
            
            {nextChapter && userData?.completedChapters?.includes(chapter.id) && (
              <Link 
                to={`/chapter/${nextChapter.id}`}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-all"
              >
                <span>Suivant</span>
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
