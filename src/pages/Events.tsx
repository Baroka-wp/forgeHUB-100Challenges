import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, getDocs, orderBy, addDoc, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Globe, Clock, X, CheckCircle2, Phone, CalendarPlus, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  locationType: 'presentiel' | 'webinaire';
  date: string;
  coverImage?: string;
  registrationUrl?: string;
}

interface Registration {
  eventId: string;
  userId: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    fetchEvents();
    if (auth.currentUser) {
      fetchUserRegistrations();
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'asc'));
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

  const fetchUserRegistrations = async () => {
    try {
      const regRef = collection(db, 'eventRegistrations');
      const q = query(regRef, where('userId', '==', auth.currentUser?.uid));
      const querySnapshot = await getDocs(q);
      const regIds: string[] = [];
      querySnapshot.forEach((doc) => {
        regIds.push(doc.data().eventId);
      });
      setUserRegistrations(regIds);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !auth.currentUser) return;

    setIsRegistering(true);
    try {
      await addDoc(collection(db, 'eventRegistrations'), {
        eventId: selectedEvent.id,
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        whatsapp: whatsapp,
        registeredAt: new Date().toISOString()
      });
      
      setUserRegistrations([...userRegistrations, selectedEvent.id]);
      setRegistrationSuccess(true);
      setTimeout(() => {
        setRegistrationSuccess(false);
        setSelectedEvent(null);
        setWhatsapp('');
      }, 3000);
    } catch (error) {
      console.error("Error registering for event:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  const addToCalendar = (event: Event) => {
    const date = new Date(event.date);
    const endDate = new Date(date.getTime() + 60 * 60 * 1000); // Default 1 hour
    
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location || (event.locationType === 'webinaire' ? 'En ligne' : ''));
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatTime(date)}/${formatTime(endDate)}&details=${description}&location=${location}`;
    
    window.open(googleUrl, '_blank');
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date()).reverse();

  const groupEventsByMonth = (eventList: Event[]) => {
    const groups: { [key: string]: Event[] } = {};
    eventList.forEach(event => {
      const month = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(event.date));
      if (!groups[month]) groups[month] = [];
      groups[month].push(event);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-sm animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <header className="mb-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Retour au tableau de bord</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-primary/30" />
            <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/60">
              Événements & Communauté
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-black text-on-surface leading-[0.85] tracking-tighter uppercase mb-6">
            Calendrier <br />
            <span className="text-primary">ForgeHub</span>
          </h1>
          <p className="text-on-surface-variant/70 max-w-2xl text-lg font-medium leading-relaxed">
            Participez à nos webinaires, masterclasses et sessions de networking pour accélérer votre projet entrepreneurial.
          </p>
        </header>

        {/* Upcoming Events */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-display font-black uppercase tracking-tight flex items-center gap-3">
              <Calendar className="text-primary" size={24} />
              Événements à venir
            </h2>
            <div className="h-[1px] flex-grow mx-8 bg-outline-variant/10 hidden md:block" />
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="bg-surface-container-low rounded-sm p-12 text-center border border-outline-variant/10">
              <p className="text-on-surface-variant font-medium italic">Aucun événement prévu pour le moment. Revenez bientôt !</p>
            </div>
          ) : (
            Object.entries(groupEventsByMonth(upcomingEvents)).map(([month, monthEvents]) => (
              <div key={month} className="mb-16 last:mb-0">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-4">
                  {month}
                  <div className="h-[1px] flex-grow bg-primary/10" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {monthEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      isRegistered={userRegistrations.includes(event.id)}
                      onRegister={() => setSelectedEvent(event)}
                      onAddToCalendar={() => addToCalendar(event)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-display font-black uppercase tracking-tight opacity-40">
                Événements passés
              </h2>
              <div className="h-[1px] flex-grow mx-8 bg-outline-variant/10 hidden md:block" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
              {pastEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  isPast 
                  isRegistered={userRegistrations.includes(event.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isRegistering && setSelectedEvent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-lowest border border-outline-variant/10 rounded-sm shadow-2xl overflow-hidden"
            >
              {registrationSuccess ? (
                <div className="p-12 text-center flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-display font-black uppercase tracking-tight">Inscription validée !</h2>
                  <p className="text-on-surface-variant font-medium">Vous recevrez les détails de l'événement par email et WhatsApp.</p>
                  <button 
                    onClick={() => addToCalendar(selectedEvent)}
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                  >
                    <CalendarPlus size={20} />
                    Ajouter au calendrier
                  </button>
                </div>
              ) : (
                <>
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={selectedEvent.coverImage} 
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-sm hover:bg-black/70 transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-tight">
                        {selectedEvent.title}
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={handleRegister} className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                        <Calendar size={16} className="text-primary" />
                        {new Date(selectedEvent.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                        {selectedEvent.locationType === 'webinaire' ? <Globe size={16} className="text-primary" /> : <MapPin size={16} className="text-primary" />}
                        {selectedEvent.location || (selectedEvent.locationType === 'webinaire' ? 'En ligne' : 'Lieu à définir')}
                      </div>
                    </div>

                    <div className="h-[1px] bg-outline-variant/10" />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Votre Email</label>
                        <input 
                          disabled
                          type="email"
                          value={auth.currentUser?.email || ''}
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm p-4 text-sm opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Numéro WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                          <input 
                            required
                            type="tel"
                            placeholder="+221 ..."
                            value={whatsapp}
                            onChange={e => setWhatsapp(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/40 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isRegistering}
                      className="w-full bg-primary text-white py-5 rounded-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRegistering ? 'Inscription...' : "S'inscrire à l'événement"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventCard({ event, isRegistered, onRegister, onAddToCalendar, isPast }: { 
  event: Event, 
  isRegistered?: boolean, 
  onRegister?: () => void, 
  onAddToCalendar?: () => void,
  isPast?: boolean 
}) {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');

  return (
    <motion.div 
      layout
      className="bg-surface-container-lowest border border-outline-variant/10 rounded-sm overflow-hidden flex flex-col group h-full"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={event.coverImage} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-sm flex flex-col items-center min-w-[50px] shadow-lg">
          <span className="text-xl font-display font-black text-primary leading-none">{day}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{month}</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <span className={`inline-block px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest mb-2 ${
            event.locationType === 'webinaire' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {event.locationType}
          </span>
          <h3 className="text-lg font-display font-black text-white uppercase tracking-tight leading-tight line-clamp-2">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <Clock size={14} className="text-primary" />
            {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {event.locationType === 'webinaire' ? <Globe size={14} className="text-primary" /> : <MapPin size={14} className="text-primary" />}
            <span className="truncate">{event.location || (event.locationType === 'webinaire' ? 'En ligne' : 'Lieu à définir')}</span>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant/70 mb-8 line-clamp-2">
          {event.description}
        </p>

        <div className="mt-auto">
          {isPast ? (
            <div className="w-full p-3 bg-surface-container-high text-on-surface-variant/40 rounded-sm text-center text-[10px] font-black uppercase tracking-widest border border-outline-variant/5">
              Événement terminé
            </div>
          ) : isRegistered ? (
            <div className="flex flex-col gap-2">
              <div className="w-full p-3 bg-green-500/10 text-green-600 rounded-sm text-center text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center justify-center gap-2">
                <CheckCircle2 size={14} />
                Inscrit
              </div>
              <button 
                onClick={onAddToCalendar}
                className="w-full p-3 bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all rounded-sm text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <CalendarPlus size={14} />
                Ajouter au calendrier
              </button>
            </div>
          ) : (
            <button 
              onClick={onRegister}
              className="w-full bg-primary text-white py-4 rounded-sm font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              S'inscrire
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
