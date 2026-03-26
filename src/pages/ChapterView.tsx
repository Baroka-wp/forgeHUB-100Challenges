import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { chapters } from '../content/chapters';
import { useAuth } from '../App';
import { db } from '../firebase';
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
      console.error("Error saving exercise:", error);
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
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        completedChapters: arrayUnion(id)
      });
      await refreshUserData();
    } catch (error) {
      console.error("Error updating progress:", error);
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
    <div className="bg-neutral min-h-screen pb-24">
      {/* Chapter Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-6 sticky top-[73px] z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-secondary hover:text-primary font-medium transition-colors">
            <ArrowLeft size={20} />
            Retour au tableau de bord
          </Link>
          <div className="text-right">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">Chapitre {chapterIndex + 1}</span>
            <h1 className="text-xl font-bold text-primary">{chapter.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {!exerciseStarted && !quizStarted ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-10 md:p-16 rounded-sm shadow-sm border border-slate-100"
            >
              <div className="markdown-body">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>

              <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col items-center">
                <h3 className="text-2xl font-bold text-primary mb-6 text-center">Prêt pour l'exercice ?</h3>
                <p className="text-secondary text-center max-w-md mb-10">
                  Complétez votre dossier d'entrepreneur pour ce chapitre avant de passer au quiz de validation.
                </p>
                <button
                  onClick={() => setExerciseStarted(true)}
                  className="bg-primary text-white px-12 py-5 rounded-sm font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl flex items-center gap-3"
                >
                  Démarrer l'Exercice
                  <FileText size={20} />
                </button>
              </div>
            </motion.div>
          ) : exerciseStarted ? (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-10 md:p-16 rounded-sm shadow-sm border border-slate-100"
            >
              <div className="mb-8">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">
                  Exercice : {chapter.exercise.category}
                </span>
                <p className="text-secondary italic">
                  Répondez à chaque question pour compléter votre dossier d'entrepreneur.
                </p>
              </div>

              <div className="space-y-12">
                {chapter.exercise.questions.map((question, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-bold text-primary">{index + 1}. {question}</h3>
                    <div className="bg-white">
                      <ReactQuill 
                        theme="snow" 
                        value={exerciseAnswers[index] || ''} 
                        onChange={(val) => handleAnswerChange(index, val)}
                        className="h-48 mb-12"
                        placeholder="Saisissez votre réponse ici..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-16 pt-8 border-t border-slate-100">
                <button 
                  onClick={() => setExerciseStarted(false)}
                  className="text-secondary hover:text-primary font-bold transition-colors"
                >
                  Retour au cours
                </button>
                <button
                  onClick={handleSaveExercise}
                  disabled={savingExercise}
                  className="bg-primary text-white px-10 py-4 rounded-sm font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
                >
                  {savingExercise ? 'Enregistrement...' : (
                    <>
                      Valider et passer au Quiz
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : !quizFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 md:p-16 rounded-sm shadow-xl border border-slate-100"
            >
              <div className="mb-12 flex items-center justify-between">
                <span className="text-sm font-bold text-secondary uppercase tracking-widest">Question {currentQuizStep + 1} / {chapter.quiz.length}</span>
                <div className="flex gap-1">
                  {chapter.quiz.map((_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full ${i <= currentQuizStep ? 'bg-primary' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-display font-bold text-primary mb-12 leading-tight">
                {chapter.quiz[currentQuizStep].question}
              </h2>

              <div className="space-y-4 mb-12">
                {chapter.quiz[currentQuizStep].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    className={`w-full text-left p-6 rounded-sm border-2 transition-all font-medium text-lg flex items-center justify-between group ${
                      selectedOption === i 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-slate-100 hover:border-slate-300 text-secondary'
                    }`}
                  >
                    {option}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === i ? 'border-primary bg-primary' : 'border-slate-200 group-hover:border-slate-300'
                    }`}>
                      {selectedOption === i && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextQuizStep}
                disabled={selectedOption === null}
                className="w-full bg-primary text-white py-5 rounded-sm font-bold text-xl hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {currentQuizStep === chapter.quiz.length - 1 ? 'Terminer le quiz' : 'Question suivante'}
                <ChevronRight size={24} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 md:p-16 rounded-sm shadow-xl border border-slate-100 text-center"
            >
              {quizResults.every(r => r === true) ? (
                <>
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-primary mb-4">Félicitations !</h2>
                  <p className="text-xl text-secondary mb-12">
                    Vous avez répondu correctement à toutes les questions. Le chapitre est validé.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/dashboard" 
                      className="bg-neutral text-primary px-8 py-4 rounded-sm font-bold hover:bg-slate-100 transition-all"
                    >
                      Retour au tableau de bord
                    </Link>
                    {nextChapter && (
                      <Link 
                        to={`/chapter/${nextChapter.id}`}
                        className="bg-primary text-white px-8 py-4 rounded-sm font-bold hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        Chapitre suivant
                        <ChevronRight size={20} />
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertCircle size={48} />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-primary mb-4">Oups !</h2>
                  <p className="text-xl text-secondary mb-12">
                    Certaines de vos réponses sont incorrectes. Relisez le chapitre et réessayez.
                  </p>
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizFinished(false);
                      setCurrentQuizStep(0);
                      setSelectedOption(null);
                      setQuizResults([]);
                    }}
                    className="bg-primary text-white px-12 py-5 rounded-sm font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl"
                  >
                    Réessayer le Quiz
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons (only when reading content) */}
        {!quizStarted && (
          <div className="mt-12 flex items-center justify-between">
            {prevChapter ? (
              <Link 
                to={`/chapter/${prevChapter.id}`}
                className="flex items-center gap-2 text-secondary hover:text-primary font-bold transition-colors"
              >
                <ChevronLeft size={20} />
                Chapitre précédent
              </Link>
            ) : <div></div>}
            
            {nextChapter && userData?.completedChapters?.includes(chapter.id) && (
              <Link 
                to={`/chapter/${nextChapter.id}`}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-colors"
              >
                Chapitre suivant
                <ChevronRight size={20} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
