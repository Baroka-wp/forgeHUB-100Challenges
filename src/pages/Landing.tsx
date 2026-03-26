import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles, Target, Users, Rocket } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-surface min-h-screen selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        {/* Architectural Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-container-low -z-10 skew-x-[-12deg] translate-x-1/4" />
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 text-left"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary">
                  L'Élite de la Création
                </span>
              </div>
              
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-display font-extrabold text-on-surface leading-[0.85] mb-12 tracking-tighter">
                LE CODE <br />
                <span className="text-primary italic">NE SUFFIT</span> <br />
                PLUS.
              </h1>
              
              <p className="text-xl md:text-2xl font-sans text-on-surface-variant max-w-xl leading-relaxed mb-16 border-l-2 border-primary/20 pl-8">
                À l'ère de l'IA, la maîtrise technique est un prérequis. La <span className="text-on-surface font-bold">vision stratégique</span> est votre seule arme de distinction massive.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Link 
                  to="/signup" 
                  className="group relative bg-gradient-to-r from-primary to-primary-container text-white px-12 py-6 rounded-md text-lg font-sans font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all w-full sm:w-auto text-center"
                >
                  Démarrer l'Ascension
                  <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#details" 
                  className="text-on-surface-variant hover:text-primary font-sans font-bold text-lg transition-colors tracking-tight"
                >
                  Explorer la Méthode
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(87,0,5,0.15)] group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1000" 
                  alt="Architectural Strategy" 
                  className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Asymmetrical decorative frame */}
              <div className="absolute -inset-4 border border-primary/10 rounded-2xl -z-10 translate-x-8 translate-y-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="details" className="py-40 bg-surface-container-lowest px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-display font-extrabold text-on-surface leading-none tracking-tighter mb-8">
                FORGER <br />
                <span className="text-primary">L'IMPACT.</span>
              </h2>
              <p className="text-xl font-sans text-on-surface-variant leading-relaxed">
                Inspiré par la méthode "The First 100" de Ben Lee, ce parcours transforme votre expertise technique en une machine de guerre entrepreneuriale.
              </p>
            </div>
            <div className="text-right">
              <span className="text-8xl font-display font-black text-primary/5 select-none">01-03</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
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
                className="p-12 bg-surface hover:bg-surface-container-high transition-all duration-500 group border-r border-outline-variant/10 last:border-r-0"
              >
                <span className="text-sm font-sans font-bold text-primary mb-8 block tracking-widest">{feature.number}</span>
                <h3 className="text-3xl font-display font-bold text-on-surface mb-6 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-sans">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-display font-extrabold text-white mb-12 leading-none tracking-tighter">
              PRÊT À <br />
              <span className="opacity-50 italic">COMMANDER ?</span>
            </h2>
            <p className="text-2xl text-white/70 mb-16 leading-relaxed max-w-2xl mx-auto font-sans">
              Rejoignez l'élite des bâtisseurs. La formation est gratuite, votre détermination est le seul prix.
            </p>
            <Link 
              to="/signup" 
              className="inline-block bg-white text-primary px-16 py-8 rounded-md text-xl font-sans font-black hover:bg-surface-bright transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 active:translate-y-0"
            >
              CRÉER MON COMPTE
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-surface text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-outline-variant/10 pt-12">
          <div className="flex items-center gap-2 font-display font-black text-2xl text-primary">
            FORGE<span className="text-on-surface">HUB</span>
          </div>
          <p className="text-on-surface-variant font-sans text-sm tracking-tight">
            © 2026 ForgeHub — Inspiré par Ben Lee & Rootstrap. <br className="md:hidden" />
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
