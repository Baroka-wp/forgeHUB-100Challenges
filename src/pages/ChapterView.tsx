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
      <div className="bg-surface-bright/70 backdrop-blur-xl border-b border-outline-variant/10 py-4 md:py-6 px-4 md:px-8 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 md:gap-3 text-on-surface-variant hover:text-primary font-bold transition-all text-[9px] md:text-[10px] uppercase tracking-[0.2em] shrink-0">
            <ArrowLeft size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
            <span className="sm:hidden">Retour</span>
          </Link>
          <div className="text-right truncate">
            <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] block mb-0.5 md:mb-1 opacity-60">Module {chapterIndex + 1}</span>
            <h1 className="text-sm md:text-xl font-display font-extrabold text-primary tracking-tight truncate">{chapter.title}</h1>
          </div>
        </div>
        
        {/* Chapter Progress Indicator */}
        <div className="max-w-6xl mx-auto mt-4 flex gap-1">
          <div className={`h-1 flex-grow rounded-full transition-all duration-500 ${!exerciseStarted && !quizStarted ? 'bg-primary' : 'bg-primary/20'}`} />
          <div className={`h-1 flex-grow rounded-full transition-all duration-500 ${exerciseStarted ? 'bg-primary' : (quizStarted || quizFinished ? 'bg-primary/20' : 'bg-surface-container-high')}`} />
          <div className={`h-1 flex-grow rounded-full transition-all duration-500 ${quizStarted ? 'bg-primary' : (quizFinished ? 'bg-primary/20' : 'bg-surface-container-high')}`} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-8 md:mt-24">
        <AnimatePresence mode="wait">
          {!exerciseStarted && !quizStarted ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-surface-container-lowest p-6 md:p-24 rounded-sm border border-outline-variant/20"
            >
              <div className="markdown-body text-sm md:text-base">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
              </div>

              <div className="mt-12 md:mt-24 pt-8 md:pt-16 border-t border-outline-variant/10 flex flex-col items-start max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 md:mb-6">Prochaine Étape</span>
                <h3 className="text-2xl md:text-4xl font-display font-extrabold text-on-surface mb-6 md:mb-8 leading-tight">Prêt à ancrer ces concepts ?</h3>
                <p className="text-base md:text-lg text-on-surface-variant font-medium mb-8 md:mb-12 leading-relaxed opacity-80">
                  Complétez votre dossier d'entrepreneur pour ce chapitre avant de passer au quiz de validation.
                </p>
                <button
                  onClick={() => setExerciseStarted(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-4"
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
              className="bg-surface-container-lowest p-6 md:p-24 rounded-sm border border-outline-variant/20"
            >
              <div className="mb-8 md:mb-16">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] block mb-2 md:mb-4">
                  Dossier : {chapter.exercise.category}
                </span>
                <h2 className="text-2xl md:text-4xl font-display font-extrabold text-on-surface mb-4 md:mb-6">Réflexion Stratégique</h2>
                <p className="text-sm md:text-base text-on-surface-variant font-medium opacity-70">
                  Répondez avec précision pour construire les fondations de votre projet.
                </p>
              </div>

              <div className="space-y-12 md:space-y-20">
                {chapter.exercise.questions.map((question, index) => (
                  <div key={index} className="space-y-4 md:space-y-6">
                    <div className="flex items-baseline gap-3 md:gap-4">
                      <span className="text-2xl md:text-4xl font-display font-black text-primary/10">{index + 1}</span>
                      <h3 className="text-lg md:text-xl font-display font-extrabold text-on-surface leading-tight">{question}</h3>
                    </div>
                    <div className="bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10 focus-within:border-primary/20 transition-all">
                      <ReactQuill 
                        theme="snow" 
                        value={exerciseAnswers[index] || ''} 
                        onChange={(val) => handleAnswerChange(index, val)}
                        className="min-h-[200px] md:min-h-[250px]"
                        placeholder="Saisissez votre réflexion ici..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 md:mt-24 pt-8 md:pt-12 border-t border-outline-variant/10 gap-6 md:gap-8">
                <button 
                  onClick={() => setExerciseStarted(false)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all order-2 sm:order-1"
                >
                  Retour au cours
                </button>
                <button
                  onClick={handleSaveExercise}
                  disabled={savingExercise}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-4 disabled:opacity-50 order-1 sm:order-2"
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
              className="bg-surface-container-lowest p-6 md:p-24 rounded-sm border border-outline-variant/20"
            >
              <div className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Validation des Acquis</span>
                  <span className="text-xs md:text-sm font-bold text-on-surface-variant opacity-60">Question {currentQuizStep + 1} sur {chapter.quiz.length}</span>
                </div>
                <div className="flex gap-1 md:gap-2">
                  {chapter.quiz.map((_, i) => (
                    <div key={i} className={`h-1 w-8 md:w-12 rounded-sm transition-all duration-500 ${i <= currentQuizStep ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-on-surface mb-8 md:mb-16 leading-[1.1] tracking-tight max-w-3xl">
                {chapter.quiz[currentQuizStep].question}
              </h2>

              <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-16">
                {chapter.quiz[currentQuizStep].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    className={`w-full text-left p-5 md:p-8 rounded-sm border border-outline-variant/10 transition-all duration-300 font-bold text-base md:text-lg flex items-center justify-between group ${
                      selectedOption === i 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <span className="flex-grow pr-4 md:pr-8 leading-tight">{option}</span>
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedOption === i ? 'border-on-primary bg-on-primary' : 'border-outline-variant/30 group-hover:border-primary/30'
                    }`}>
                      {selectedOption === i && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-sm"></div>}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextQuizStep}
                disabled={selectedOption === null}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 md:py-6 rounded-md font-bold text-sm uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-30 flex items-center justify-center gap-4"
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
              className="bg-surface-container-lowest p-8 md:p-24 rounded-sm border border-outline-variant/20 text-center"
            >
              {quizResults.every(r => r === true) ? (
                <>
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10">
                    <CheckCircle2 size={32} className="md:w-12 md:h-12" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-extrabold text-on-surface mb-4 md:mb-6 tracking-tight">Maîtrise Validée</h2>
                  <p className="text-base md:text-xl text-on-surface-variant font-medium mb-8 md:mb-16 max-w-xl mx-auto leading-relaxed opacity-80">
                    Vous avez démontré une compréhension parfaite des concepts. Le chapitre est désormais ancré dans votre parcours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                    <Link 
                      to="/dashboard" 
                      className="w-full sm:w-auto px-10 py-4 md:py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all text-center"
                    >
                      Tableau de bord
                    </Link>
                    {nextChapter && (
                      <Link 
                        to={`/chapter/${nextChapter.id}`}
                        className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-4 md:py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-4"
                      >
                        Chapitre suivant
                        <ChevronRight size={18} />
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/5 text-primary rounded-sm flex items-center justify-center mx-auto mb-6 md:mb-10">
                    <AlertCircle size={32} className="md:w-12 md:h-12" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-extrabold text-on-surface mb-4 md:mb-6 tracking-tight">Révision Nécessaire</h2>
                  <p className="text-base md:text-xl text-on-surface-variant font-medium mb-8 md:mb-16 max-w-xl mx-auto leading-relaxed opacity-80">
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
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 md:px-12 py-4 md:py-5 rounded-md font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all"
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
          <div className="mt-12 md:mt-24 flex items-center justify-between">
            {prevChapter ? (
              <Link 
                to={`/chapter/${prevChapter.id}`}
                className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all"
              >
                <ChevronLeft size={14} className="md:w-4 md:h-4" />
                <span>Précédent</span>
              </Link>
            ) : <div></div>}
            
            {nextChapter && userData?.completedChapters?.includes(chapter.id) && (
              <Link 
                to={`/chapter/${nextChapter.id}`}
                className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-all"
              >
                <span>Suivant</span>
                <ChevronRight size={14} className="md:w-4 md:h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
