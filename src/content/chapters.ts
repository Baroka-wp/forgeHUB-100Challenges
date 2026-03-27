export interface Chapter {
  id: string;
  title: string;
  description: string;
  file: string;
  exercise: {
    questions: string[];
    category: string;
  };
  quiz: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export const chapters: Chapter[] = [
  {
    id: '0',
    title: "Le Filtre Anti-Bullshit",
    description: "Teste la solidité de ton idée avant d'investir une seule heure de travail.",
    file: '/formation/chapitre0.md',
    exercise: {
      questions: [
        "Décris le problème que tu veux résoudre en une seule phrase, sans mentionner ton produit. Nomme qui souffre, de quoi, et quel est le coût.",
        "Demande à 5 personnes de noter la douleur de ce problème sur 10. Quel est le score moyen ?",
        "Nomme 5 personnes réelles (avec prénoms) qui ont ce problème et que tu pourrais appeler ce soir.",
        "Complète la Formule Madlib : 'J'aide [QUI] à [RÉSOUDRE QUOI] grâce à [COMMENT], contrairement à [ALTERNATIVE] qui [DÉFAUT].'"
      ],
      category: "Validation d'Idée"
    },
    quiz: [
      {
        question: "À quel score minimum (sur 10) un problème doit-il être noté pour justifier de construire une solution ?",
        options: ["3/10 - s'il y a de l'intérêt, c'est suffisant", "7/10 - la douleur doit être significative", "5/10 - un niveau moyen est acceptable"],
        answer: 1
      },
      {
        question: "Que signifie l'absence totale de concurrence sur ton marché ?",
        options: ["C'est un signe que tu as trouvé une idée révolutionnaire", "C'est un signal d'alarme : le marché est peut-être inexistant", "C'est la preuve que tu as une longueur d'avance"],
        answer: 1
      },
      {
        question: "Quelle est la preuve minimale que ton idée mérite d'avancer ?",
        options: ["Un feedback positif de tes amis et famille", "Un score de 4 ou 5 GO sur les 5 critères du Filtre", "Une idée similaire réussie aux États-Unis"],
        answer: 1
      }
    ]
  },
  {
    id: '1',
    title: "L'Intention et la Vision",
    description: "Clarifiez votre 'pourquoi' profond et construisez une Proposition de Valeur Unique solide.",
    file: '/formation/chapitre1.md',
    exercise: {
      questions: [
        "Décris ta vision en 3 niveaux : Quoi (produit), Pour Qui (client), et Pourquoi Profond (changement dans le monde).",
        "Réalise le Test des 3 Ans Difficiles : si ton entreprise ne génère rien pendant 3 ans, pourquoi continues-tu ? C'est ton vrai 'pourquoi'.",
        "Rédige ta Proposition de Valeur Unique : quel résultat concret, en combien de temps, et pourquoi tu es différent ?",
        "Écris une lettre de 15 lignes à toi-même dans 18 mois. Décris ce que tu as accompli."
      ],
      category: "Vision & Intention"
    },
    quiz: [
      {
        question: "Selon le cadre des 3 niveaux de vision, quel niveau est le plus important pour tenir sur la durée ?",
        options: ["Niveau 1 - Le Quoi (ce que tu construis)", "Niveau 3 - Le Pourquoi Profond (le changement que tu veux voir)", "Niveau 2 - Le Pour Qui (ton client cible)"],
        answer: 1
      },
      {
        question: "Comment Eric Ries définit-il l'unité de progrès d'une startup ?",
        options: ["Le nombre de fonctionnalités livrées", "Les apprentissages validés sur les clients réels", "Le chiffre d'affaires mensuel"],
        answer: 1
      },
      {
        question: "Quelle est la différence entre un rêve et un objectif selon Zig Ziglar ?",
        options: ["Un objectif rapporte de l'argent, un rêve non", "Un objectif est écrit, daté et assorti d'un plan d'action", "Un objectif est partagé avec des investisseurs"],
        answer: 1
      }
    ]
  },
  {
    id: '2',
    title: "Obsède-toi sur ton Client",
    description: "Construis un profil micro précis, identifie le 'Job to be Done' et réalise tes 5 entretiens obligatoires.",
    file: '/formation/chapitre2.md',
    exercise: {
      questions: [
        "Crée un Profil Micro pour ton Adopteur Précoce : donne-lui un prénom, décris où il passe ses journées, quand il ressent le problème, et avec quels outils il essaie de s'en sortir.",
        "Identifie le 'Job to be Done' principal : quel résultat de vie ton client cherche-t-il vraiment (pas la fonctionnalité, le résultat) ?",
        "Conduis 5 entretiens de découverte. Pour chaque entretien, note les mots exacts utilisés pour décrire la douleur.",
        "Qu'est-ce que ton client doit 'licencier' pour t'adopter ? Comment peux-tu rendre cette transition moins coûteuse ?"
      ],
      category: "Connaissance Client"
    },
    quiz: [
      {
        question: "Pourquoi un Early Adopter accepte-t-il une solution imparfaite ?",
        options: ["Parce qu'il n'a pas les moyens d'une solution complète", "Parce que son problème est suffisamment douloureux pour qu'il cherche n'importe quelle issue", "Parce qu'il aime tester les nouvelles technologies"],
        answer: 1
      },
      {
        question: "Dans l'exemple du milk-shake de Christensen, quel était le vrai 'Job to be Done' ?",
        options: ["Se faire plaisir avec un dessert sucré", "Avoir un compagnon de route qui occupe la main et rassasie pendant le trajet", "Remplacer un repas complet le matin"],
        answer: 1
      },
      {
        question: "Quelle question révèle le mieux la vérité lors d'un entretien client ?",
        options: ["'Est-ce que vous aimeriez un produit qui résout ce problème ?'", "'Racontez-moi la dernière fois que vous avez eu ce problème. Comment l'avez-vous résolu ?'", "'Sur une échelle de 1 à 10, aimez-vous mon idée ?'"],
        answer: 1
      }
    ]
  },
  {
    id: '3',
    title: "Construire le MVP",
    description: "Testez votre hypothèse la plus risquée avec le minimum de ressources possible.",
    file: '/formation/chapitre3.md',
    exercise: {
      questions: [
        "Quelle est l'hypothèse la plus risquée de ton business - celle dont tout dépend ? Comment peux-tu la tester en moins de 2 semaines ?",
        "Quel type de MVP choisiras-tu (vidéo, page de vente, concierge) et pourquoi ?",
        "Teste ton prix : demande à 5 clients potentiels combien ils paieraient. Note leurs réactions exactes.",
        "Identifie une fonctionnalité que tu voulais ajouter et à laquelle tu vas dire NON. Pourquoi ?"
      ],
      category: "Produit & MVP"
    },
    quiz: [
      {
        question: "Quel est le but premier d'un MVP ?",
        options: ["Lancer un produit le plus vite possible même s'il est incomplet", "Tester l'hypothèse la plus risquée avec le minimum de ressources", "Impressionner les investisseurs avec une démo fonctionnelle"],
        answer: 1
      },
      {
        question: "Qu'est-ce qu'un 'Concierge MVP' ?",
        options: ["Une app pour gérer les réservations d'hôtel", "Fournir le service manuellement à quelques clients avant d'automatiser quoi que ce soit", "Engager une équipe de support client dès le lancement"],
        answer: 1
      },
      {
        question: "Selon la citation de Saint-Exupéry, quand la perfection est-elle atteinte ?",
        options: ["Quand toutes les fonctionnalités demandées ont été ajoutées", "Quand il n'y a plus rien à enlever", "Quand le produit reçoit une note de 5 étoiles"],
        answer: 1
      }
    ]
  },
  {
    id: '4',
    title: "Validation sur le Terrain",
    description: "Sortez du bureau, observez le comportement réel et mesurez ce qui compte vraiment.",
    file: '/formation/chapitre4.md',
    exercise: {
      questions: [
        "Identifie ta North Star Metric - l'indicateur unique qui reflète le mieux la valeur que tu apportes. Comment vas-tu la mesurer ?",
        "Observe 3 clients utiliser ton MVP en conditions réelles. Note exactement où ils bloquent et ce qui les surprend.",
        "Obtiens un premier paiement réel - même symbolique. Décris la conversation qui y a mené.",
        "Remplis le tableau de décision Pivoter/Persévérer selon tes données actuelles."
      ],
      category: "Validation Terrain"
    },
    quiz: [
      {
        question: "Quelle est la différence entre une Vanity Metric et une Actionable Metric ?",
        options: ["Une Vanity Metric est quantitative, une Actionable Metric est qualitative", "Une Vanity Metric flatte l'ego sans informer, une Actionable Metric révèle une relation de cause à effet", "Une Vanity Metric mesure la croissance, une Actionable Metric mesure le profit"],
        answer: 1
      },
      {
        question: "Que signifie 'Genchi Gembutsu' ?",
        options: ["Automatiser tous les processus le plus tôt possible", "Aller sur le terrain pour observer la réalité par soi-même", "Déléguer l'observation client à son équipe"],
        answer: 1
      },
      {
        question: "Si tes clients utilisent ton produit mais ne paient pas, quel est le problème principal ?",
        options: ["Problème de notoriété - tu n'es pas assez connu", "Problème de modèle économique - teste différentes approches de prix", "Problème de produit - améliore les fonctionnalités"],
        answer: 1
      }
    ]
  },
  {
    id: '5',
    title: "Obtenir tes 100 Premiers Clients",
    description: "Maîtrisez la vente directe, le script simple et le suivi des 100 premiers prospects.",
    file: '/formation/chapitre5.md',
    exercise: {
      questions: [
        "Choisis 1 ou 2 canaux d'acquisition principaux et justifie ce choix en fonction de là où sont tes Adopteurs Précoces.",
        "Rédige ton script de vente de 60 secondes en suivant la structure : Accroche → Curiosité → Preuve → Offre.",
        "Crée ton tableau de suivi des 100 premiers prospects. Complète-le avec les 10 premières conversations que tu vas avoir cette semaine.",
        "Identifie le 'problème invisible' de ton client - ce qu'il ne voit pas encore et que tu peux lui enseigner."
      ],
      category: "Vente & Acquisition"
    },
    quiz: [
      {
        question: "Selon 'The Challenger Sale', quel est le profil de vendeur le plus performant ?",
        options: ["Le Bâtisseur de Relations - toujours disponible et à l'écoute", "Le Challenger - qui enseigne quelque chose de nouveau au client sur son business", "Le Loup Solitaire - qui travaille de façon autonome et intuitive"],
        answer: 1
      },
      {
        question: "Que signifie le 'I' dans la méthode SPIN Selling ?",
        options: ["Innovation - montre ce que ton produit innove", "Implication - fais comprendre les conséquences du problème non résolu", "Intérêt - suscite l'intérêt pour ta solution"],
        answer: 1
      },
      {
        question: "Quand faut-il commencer à investir dans la publicité payante ?",
        options: ["Dès le lancement pour maximiser la visibilité", "Après avoir obtenu ses 10 premiers clients en vente directe", "Uniquement quand on a un budget de 10 000€ minimum"],
        answer: 1
      }
    ]
  },
  {
    id: '6',
    title: "Progresser Constamment",
    description: "Passez de 10 à 100 clients avec une méthode de revue mensuelle et des critères objectifs pour pivoter ou persévérer.",
    file: '/formation/chapitre6.md',
    exercise: {
      questions: [
        "Identifie ta 'Tête de Pont' : quel est le plus petit segment de marché sur lequel tu peux devenir la référence absolue ?",
        "Définis tes 3 KPIs mensuels : Taux de Rétention à 30j, Coût d'Acquisition Client (CAC), et NPS. Comment vas-tu les mesurer concrètement ?",
        "Planifie ta première Revue Mensuelle dans ton agenda pour dans 30 jours. Prépare les 4 sections : Chiffres, Clients, Apprentissages, Décisions.",
        "Applique le Concept de l'Hérisson à ton projet : es-tu à l'intersection de la passion, de l'excellence potentielle, et du moteur économique ?"
      ],
      category: "Progression & Système"
    },
    quiz: [
      {
        question: "Qu'est-ce que le 'Gouffre' selon Geoffrey Moore ?",
        options: ["Le manque de financement qui freine la croissance", "Le fossé entre les Adopteurs Précoces et la Majorité Précoce qui nécessite une stratégie différente", "La période difficile des 3 premières années d'une startup"],
        answer: 1
      },
      {
        question: "Quelle est la différence entre un vrai pivot et un faux pivot ?",
        options: ["Un vrai pivot change de secteur, un faux pivot change seulement de produit", "Un vrai pivot est basé sur des données, un faux pivot est une fuite face à la difficulté", "Un vrai pivot nécessite de nouveaux investisseurs, un faux pivot pas"],
        answer: 1
      },
      {
        question: "Quel KPI minimum de rétention à 30 jours indique un produit viable ?",
        options: ["10% - si une personne sur dix revient, c'est un début", "40% - en dessous, il y a un problème de valeur produit à résoudre", "80% - la majorité doit revenir pour que le modèle soit sain"],
        answer: 1
      }
    ]
  }
];
