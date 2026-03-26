import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user doc in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: name,
        completedChapters: [],
        createdAt: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-surface relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-container-low -z-10 skew-x-[-12deg] translate-x-1/4" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-surface-container-lowest p-12 rounded-2xl shadow-[0_32px_64px_rgba(25,28,30,0.08)] border border-outline-variant/10 relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-[1px] bg-primary" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-primary">
              ForgeHub Recruitment
            </span>
          </div>
          <h1 className="text-4xl font-display font-extrabold text-on-surface mb-4 tracking-tight">Créer un compte</h1>
          <p className="text-on-surface-variant font-sans leading-relaxed">Commencez votre voyage vers vos 100 premiers clients.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-error/5 text-error p-4 rounded-lg text-sm font-sans font-medium mb-8 border border-error/10 flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-error" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-sans font-bold text-primary uppercase tracking-[0.2em] ml-1">Nom complet</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low text-on-surface font-sans rounded-lg border-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/30"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-sans font-bold text-primary uppercase tracking-[0.2em] ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low text-on-surface font-sans rounded-lg border-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/30"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-sans font-bold text-primary uppercase tracking-[0.2em] ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low text-on-surface font-sans rounded-lg border-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-lg font-sans font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                S'inscrire
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-outline-variant/5">
          <button 
            onClick={handleGoogleSignup}
            className="w-full bg-surface-bright border border-outline-variant/10 text-on-surface py-4 rounded-lg font-sans font-bold flex items-center justify-center gap-4 hover:bg-surface-container-low transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            S'inscrire avec Google
          </button>
        </div>

        <p className="mt-12 text-center font-sans text-on-surface-variant">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
