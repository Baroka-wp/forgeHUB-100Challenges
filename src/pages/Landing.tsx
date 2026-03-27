import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles, Target, Users, Rocket } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Landing() {
  return (
    <div className="bg-surface min-h-screen selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-24 md:pb-40 px-4 md:px-6 overflow-hidden">
        {/* Architectural Background Elements */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-surface-container-low -z-10 skew-x-[-12deg] translate-x-1/2 md:translate-x-1/4 opacity-50 md:opacity-100" />
        <div className="absolute top-20 md:top-40 left-10 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 text-left"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                <div className="w-8 md:w-12 h-[1px] bg-primary" />
                <span className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary">
                  L'Élite de la Création
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-extrabold text-on-surface leading-[0.9] md:leading-[0.85] mb-8 md:mb-12 tracking-tighter">
                LE CODE <br />
                <span className="text-primary italic">NE SUFFIT</span> <br />
                PLUS.
              </h1>
              
              <p className="text-lg md:text-2xl font-sans text-on-surface leading-relaxed mb-10 md:mb-16 border-l-2 border-primary/30 pl-6 md:pl-8">
                À l'ère de l'IA, la maîtrise technique est un prérequis. La <span className="text-primary font-bold">vision stratégique</span> est votre seule arme de distinction massive.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                <Link 
                  to="/signup" 
                  className="group relative bg-gradient-to-r from-primary to-primary-container text-white px-8 md:px-12 py-5 md:py-6 rounded-sm text-base md:text-lg font-sans font-bold border border-white/10 hover:-translate-y-1 transition-all w-full sm:w-auto text-center"
                >
                  Démarrer l'Ascension
                  <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#details" 
                  className="text-on-surface-variant hover:text-primary font-sans font-bold text-base md:text-lg transition-colors tracking-tight"
                >
                  Explorer la Méthode
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative mt-12 lg:mt-0"
            >
              <div className="relative z-10 rounded-sm overflow-hidden border border-primary/20 group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1000" 
                  alt="Architectural Strategy" 
                  className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Asymmetrical decorative frame */}
              <div className="absolute -inset-4 border border-primary/10 rounded-sm -z-10 translate-x-4 md:translate-x-8 translate-y-4 md:translate-y-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="details" className="py-24 md:py-40 bg-surface-container-lowest px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 gap-8 md:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-on-surface leading-none tracking-tighter mb-6 md:mb-8">
                FORGER <br />
                <span className="text-primary">L'IMPACT.</span>
              </h2>
              <p className="text-lg md:text-xl font-sans text-on-surface-variant leading-relaxed">
                Inspiré par la méthode "The First 100" de Ben Lee, ce parcours transforme votre expertise technique en une machine de guerre entrepreneuriale.
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-6xl md:text-8xl font-display font-black text-primary/5 select-none">01-03</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-1 bg-outline-variant/10">
            {[
              {
                number: "01",
                title: "Validation d'Idée",
                desc: "Ne construisez pas dans le vide. Apprenez à valider la demande avant d'écrire une seule ligne de code."
              },
              {
                number: "02",
                title: "Acquisition Client",
                desc: "Identifiez vos 100 premiers clients et comprenez leurs besoins profonds (Job to be Done)."
              },
              {
                number: "03",
                title: "Lancement & Traction",
                desc: "Maîtrisez les canaux de traction et la méthode Bullseye pour faire décoller votre produit."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 md:p-12 bg-surface hover:bg-surface-container-high transition-all duration-500 group"
              >
                <span className="text-xs md:text-sm font-sans font-bold text-primary mb-6 md:mb-8 block tracking-widest">{feature.number}</span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-4 md:mb-6 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm md:text-base text-on-surface leading-relaxed font-sans">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-4 md:px-6 relative bg-black overflow-hidden">
        {/* Deep dark architectural overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black -z-10" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-display font-extrabold text-white mb-8 md:mb-12 leading-[0.9] md:leading-[0.85] tracking-tighter">
              PRÊT À <br />
              <span className="text-primary italic brightness-200 drop-shadow-[0_0_30px_rgba(87,0,5,0.3)]">COMMANDER ?</span>
            </h2>
            <p className="text-lg md:text-2xl text-white/90 mb-10 md:mb-16 leading-relaxed max-w-2xl mx-auto font-sans">
              Rejoignez l'élite des bâtisseurs. La formation est gratuite, votre détermination est le seul prix.
            </p>
            <Link 
              to="/signup" 
              className="inline-block bg-primary text-white px-10 md:px-16 py-6 md:py-8 rounded-sm text-lg md:text-xl font-sans font-black hover:bg-primary-container transition-all hover:-translate-y-2 active:translate-y-0 border border-white/20 w-full sm:w-auto"
            >
              CRÉER MON COMPTE
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-surface text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-outline-variant/10 pt-12">
          <Logo />
          <p className="text-on-surface-variant font-sans text-sm tracking-tight">
            © 2026 La Forge — Inspiré par Ben Lee & Rootstrap. <br className="md:hidden" />
            Design System: Stoic Commander v1.0
          </p>
          <div className="flex gap-8 text-sm font-sans font-bold text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
