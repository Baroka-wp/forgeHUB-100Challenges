import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ChapterView from './pages/ChapterView';
import Dossier from './pages/Dossier';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

import { LogoIcon } from './components/Logo';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: any;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userData: null, refreshUserData: async () => {} });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // Create user doc if it doesn't exist (e.g. after social login)
        const newUserData = {
          uid,
          email: auth.currentUser?.email,
          displayName: auth.currentUser?.displayName,
          completedChapters: [],
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshUserData = async () => {
    if (user) await fetchUserData(user.uid);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-sm animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LogoIcon className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-primary animate-pulse">
            La Forge
          </span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, userData, refreshUserData }}>
      <Router>
        <div className="min-h-screen bg-surface flex flex-col selection:bg-primary/20 selection:text-primary">
          <Navbar />
          <main className={`flex-grow ${user ? 'pb-20 md:pb-0' : ''}`}>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/chapter/:id" element={user ? <ChapterView /> : <Navigate to="/login" />} />
              <Route path="/dossier" element={user ? <Dossier /> : <Navigate to="/login" />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
