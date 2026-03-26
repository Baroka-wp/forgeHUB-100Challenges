import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles, Target, Users, Rocket } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-neutral min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase mb-8">
                <Sparkles size={16} />
                L'ère de l'IA est là
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-extrabold text-primary leading-[1.1] mb-8 tracking-tight">
                Le Code ne suffit plus.<br />
                <span className="text-secondary">Devenez un Bâtisseur de Valeur.</span>
              </h1>
              <p className="text-xl text-secondary max-w-xl leading-relaxed mb-12">
                À l'heure où l'IA peut écrire votre code, la compétence qui fera de vous un leader est de savoir 
                <strong> créer et vendre un produit</strong> qui apporte une réelle valeur au monde.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link 
                  to="/signup" 
                  className="group bg-primary text-white px-10 py-5 rounded-sm text-lg font-bold hover:bg-opacity-90 transition-all shadow-xl flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                  Démarrer la formation
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#details" 
                  className="text-secondary hover:text-primary font-bold text-lg transition-colors"
                >
                  En savoir plus
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/5 -rotate-3 rounded-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1000" 
                alt="Product Strategy Illustration" 
                className="relative z-10 rounded-sm shadow-2xl border border-slate-200 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="details" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-primary mb-6">Ce que vous allez apprendre</h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Inspiré par la méthode "The First 100" de Ben Lee, ce cours vous guide de l'idée brute à vos 100 premiers clients payants.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Target className="text-primary" size={32} />,
                title: "Validation d'Idée",
                desc: "Ne construisez pas dans le vide. Apprenez à valider la demande avant d'écrire une seule ligne de code."
              },
              {
                icon: <Users className="text-primary" size={32} />,
                title: "Acquisition Client",
                desc: "Identifiez vos 100 premiers clients et comprenez leurs besoins profonds (Job to be Done)."
              },
              {
                icon: <Rocket className="text-primary" size={32} />,
                title: "Lancement & Traction",
                desc: "Maîtrisez les canaux de traction et la méthode Bullseye pour faire décoller votre produit."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-sm bg-neutral border border-slate-100 shadow-sm"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Prêt à passer de développeur à entrepreneur ?</h2>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Rejoignez des centaines de bâtisseurs qui ont déjà transformé leur vision en réalité. 
            La formation est gratuite, votre temps est l'investissement.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-primary px-12 py-6 rounded-sm text-xl font-extrabold hover:bg-neutral transition-all shadow-2xl"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 text-center text-secondary">
        <p>© 2026 ForgeHub - Inspiré par Ben Lee & Rootstrap</p>
      </footer>
    </div>
  );
}
