import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Users, BookOpen, Clock, Shield, Search, Plus, X, Calendar, MapPin, Globe, Trash2, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  locationType: 'presentiel' | 'webinaire';
  date: string;
  coverImage?: string;
  registrationUrl?: string;
  createdAt: string;
}

interface Registration {
  id: string;
  eventId: string;
  userId: string;
  email: string;
  whatsapp: string;
  registeredAt: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    locationType: 'webinaire' as 'presentiel' | 'webinaire',
    date: '',
    time: '',
    coverImage: '',
    registrationUrl: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const eventsData: Event[] = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const regRef = collection(db, 'eventRegistrations');
      const querySnapshot = await getDocs(regRef);
      const regData: Registration[] = [];
      querySnapshot.forEach((doc) => {
        regData.push({ id: doc.id, ...doc.data() } as Registration);
      });
      setRegistrations(regData);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventDate = new Date(`${formData.date}T${formData.time}`);
      const newEvent = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        locationType: formData.locationType,
        date: eventDate.toISOString(),
        coverImage: formData.coverImage || `https://picsum.photos/seed/${formData.title}/800/400`,
        registrationUrl: formData.registrationUrl,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'events'), newEvent);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        locationType: 'webinaire',
        date: '',
        time: '',
        coverImage: '',
        registrationUrl: ''
      });
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-sm animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 z-50 border-r border-outline-variant/10 bg-surface-container-lowest flex-col p-8">
        <div className="mb-12">
          <Link to="/dashboard" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all mb-10 group">
            <Clock size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Retour au site</span>
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Shield size={20} className="text-primary" />
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tighter">Admin</h2>
          </div>

          <nav className="space-y-2">
            <Link to="/admin" className="w-full flex items-center gap-3 p-3 rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all">
              <Users size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Utilisateurs</span>
            </Link>
            <Link to="/admin/events" className="w-full flex items-center gap-3 p-3 rounded-sm bg-primary text-white shadow-lg shadow-primary/20 transition-all">
              <Clock size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Événements</span>
            </Link>
            <button className="w-full flex items-center gap-3 p-3 rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all opacity-40 cursor-not-allowed">
              <BookOpen size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Contenu</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto pt-8 border-t border-outline-variant/10">
          <div className="p-4 bg-surface-container-low rounded-sm border border-outline-variant/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Total Événements</span>
            <span className="text-3xl font-display font-black text-primary">{events.length}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 lg:p-16 lg:ml-72">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-primary/30" />
              <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/60">
                Événements & Communauté
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-black text-on-surface leading-[0.85] tracking-tighter uppercase">
              Gestion des <br />
              <span className="text-primary">Événements</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={20} />
            Créer un événement
          </button>
        </header>

        {/* Events List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {events.map((event) => {
            const eventRegs = registrations.filter(r => r.eventId === event.id);
            return (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-lowest border border-outline-variant/10 rounded-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden group">
                  <img 
                    src={event.coverImage} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest ${
                        event.locationType === 'webinaire' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {event.locationType}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-tight">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      <Calendar size={14} className="text-primary" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      {event.locationType === 'webinaire' ? <Globe size={14} className="text-primary" /> : <MapPin size={14} className="text-primary" />}
                      {event.location || (event.locationType === 'webinaire' ? 'En ligne' : 'Lieu à définir')}
                    </div>
                  </div>

                  <p className="text-sm text-on-surface-variant/70 mb-8 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Inscriptions</span>
                      <span className="text-xl font-display font-black text-primary">{eventRegs.length}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                        className="p-3 bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors rounded-sm"
                        title="Voir les inscrits"
                      >
                        <Users size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Registrations List (Expandable) */}
                  <AnimatePresence>
                    {selectedEventId === event.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-6"
                      >
                        <div className="bg-surface-container-low rounded-sm p-4 space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Liste des inscrits</h4>
                          {eventRegs.length === 0 ? (
                            <p className="text-xs text-on-surface-variant opacity-50 italic">Aucun inscrit pour le moment.</p>
                          ) : (
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                              {eventRegs.map(reg => (
                                <div key={reg.id} className="flex items-center justify-between text-xs p-2 bg-surface-container-lowest rounded-sm border border-outline-variant/5">
                                  <div className="flex flex-col">
                                    <span className="font-bold">{reg.email}</span>
                                    <span className="text-[10px] opacity-60">WhatsApp: {reg.whatsapp}</span>
                                  </div>
                                  <span className="text-[9px] opacity-40">{new Date(reg.registeredAt).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add Event Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/10 rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                  <h2 className="text-xl font-display font-black uppercase tracking-tight">Nouvel Événement</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface-container-high rounded-sm transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddEvent} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Titre de l'événement</label>
                    <input 
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40"
                      placeholder="ex: Masterclass: Pitcher son projet"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Type</label>
                      <select 
                        value={formData.locationType}
                        onChange={e => setFormData({...formData, locationType: e.target.value as any})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40"
                      >
                        <option value="webinaire">Webinaire (En ligne)</option>
                        <option value="presentiel">Présentiel (Physique)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Lieu / Lien</label>
                      <input 
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40"
                        placeholder={formData.locationType === 'webinaire' ? 'Lien Zoom/Google Meet' : 'Adresse physique'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Date</label>
                      <input 
                        required
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Heure</label>
                      <input 
                        required
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Description</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40 resize-none"
                      placeholder="Détails de l'événement..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Image de couverture (URL)</label>
                    <input 
                      type="url"
                      value={formData.coverImage}
                      onChange={e => setFormData({...formData, coverImage: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Lien d'inscription externe (Optionnel)</label>
                    <input 
                      type="url"
                      value={formData.registrationUrl}
                      onChange={e => setFormData({...formData, registrationUrl: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm focus:outline-none focus:border-primary/40"
                      placeholder="https://linktree.com/..."
                    />
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-primary text-white py-5 rounded-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      Publier l'événement
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
