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
    id: '1',
    title: "L'Intention et la Vision",
    description: "Définissez votre 'pourquoi' et devenez un 'spécifique significatif'.",
    file: '/formation/chapitre1.md',
    exercise: {
      questions: [
        "Quelle est votre vision à long terme ? (Vendre l'entreprise ? La diriger pendant 20 ans ?)",
        "Qu'est-ce qui entretient votre 'feu' intérieur en dehors de l'argent ?",
        "Quel est le besoin le plus essentiel auquel votre produit répondra ?"
      ],
      category: "Vision & Intention"
    },
    quiz: [
      {
        question: "Selon Zig Ziglar, que devez-vous devenir pour réussir ?",
        options: ["Une généralité vagabonde", "Un spécifique significatif", "Un expert polyvalent"],
        answer: 1
      },
      {
        question: "Comment Eric Ries définit-il la 'Valeur' dans le cadre du Lean Startup ?",
        options: ["Le chiffre d'affaires généré", "Tout ce qui apporte un bénéfice au client", "La complexité technique du code"],
        answer: 1
      },
      {
        question: "Quel est le principal danger de ne pas avoir d'objectif écrit selon Ziglar ?",
        options: ["Payer trop d'impôts", "Rester dans le flou et la généralité", "Perdre ses investisseurs"],
        answer: 1
      }
    ]
  },
  {
    id: '2',
    title: "Qui va s'en soucier ?",
    description: "Identifiez vos adopteurs précoces et le 'Job to be Done'.",
    file: '/formation/chapitre2.md',
    exercise: {
      questions: [
        "Où passe-t-il son temps en ligne et hors ligne ?",
        "Quel langage ou jargon utilise-t-il ?",
        "Qu'est-ce qu'il doit 'licencier' (arrêter d'utiliser) pour vous 'embaucher' ?"
      ],
      category: "Cible & Client"
    },
    quiz: [
      {
        question: "Pourquoi un 'Early Adopter' accepte-t-il un produit imparfait ?",
        options: ["Parce qu'il n'a pas beaucoup d'argent.", "Parce qu'il veut absolument résoudre un problème urgent.", "Parce qu'il aime le design minimaliste."],
        answer: 1
      },
      {
        question: "Quel est l'effet principal du 'Paradoxe du Choix' selon Barry Schwartz ?",
        options: ["Une augmentation massive des ventes.", "Une paralysie de la décision chez le consommateur.", "Une fidélité accrue à la marque."],
        answer: 1
      },
      {
        question: "Dans l'exemple de Clayton Christensen, quel était le 'job' du milk-shake du matin ?",
        options: ["Servir de dessert après le petit-déjeuner.", "Occuper le conducteur et le rassasier durant son trajet.", "Être la boisson la moins chère du menu."],
        answer: 1
      }
    ]
  },
  {
    id: '3',
    title: "Le Produit Minimum Viable (MVP)",
    description: "Apprenez à construire moins pour apprendre plus et à vous positionner.",
    file: '/formation/chapitre3.md',
    exercise: {
      questions: [
        "Quelle est la fonctionnalité unique sans laquelle votre produit n'a aucun sens ?",
        "Comment pouvez-vous tester cette valeur sans écrire une seule ligne de code complexe ?"
      ],
      category: "Produit & MVP"
    },
    quiz: [
      {
        question: "Quel est le but ultime de la boucle Build-Measure-Learn ?",
        options: ["Finir le produit le plus vite possible.", "Minimiser le temps total de passage dans la boucle pour apprendre vite.", "Dépenser tout le budget marketing."],
        answer: 1
      },
      {
        question: "Selon Ries & Trout, que doit faire un challenger qui n'est pas n°1 sur son marché ?",
        options: ["Prétendre qu'il est le n°1.", "Trouver une position inoccupée ou repositionner le leader.", "Baisser ses prix de 90%."],
        answer: 1
      },
      {
        question: "Qu'est-ce qu'un 'Concierge MVP' ?",
        options: ["Une application pour les hôtels de luxe.", "Fournir le service manuellement à quelques clients pour comprendre leurs besoins avant d'automatiser.", "Embaucher un réceptionniste pour votre startup."],
        answer: 1
      }
    ]
  },
  {
    id: '4',
    title: "Validation sur le Terrain",
    description: "Sortez de votre bureau, pratiquez le Genchi Gembutsu et mesurez le réel.",
    file: '/formation/chapitre4.md',
    exercise: {
      questions: [
        "Identifiez 5 personnes qui ne sont pas vos amis et qui ont le problème que vous voulez résoudre.",
        "Préparez une question ouverte qui commence par 'Racontez-moi la dernière fois que vous avez eu des difficultés avec...'",
        "Quel est l'indicateur unique (North Star Metric) qui prouvera que votre solution apporte de la valeur ?"
      ],
      category: "Validation Terrain"
    },
    quiz: [
      {
        question: "Que signifie 'Genchi Gembutsu' ?",
        options: ["Créer un design magnifique.", "Aller sur le terrain pour voir la réalité par soi-même.", "Automatiser tous les processus."],
        answer: 1
      },
      {
        question: "Qu'est-ce qu'une 'Vanity Metric' ?",
        options: ["Un indicateur qui flatte l'ego mais ne reflète pas la santé réelle du business.", "Le profit net de l'entreprise.", "Le coût d'acquisition client."],
        answer: 0
      },
      {
        question: "Pourquoi l'équipe de la tondeuse robotisée a-t-elle pivoté ?",
        options: ["Parce que la technologie ne marchait pas.", "Parce que le besoin client identifié initialement n'avait pas de valeur économique pour les acheteurs.", "Parce qu'ils préféraient l'agriculture."],
        answer: 1
      }
    ]
  },
  {
    id: '5',
    title: "La Vente (L'Art de l'Influence)",
    description: "Maîtrisez la vente Challenger, le SPIN selling et les principes de Cialdini.",
    file: '/formation/chapitre5.md',
    exercise: {
      questions: [
        "Quel est le 'problème invisible' que votre client ne voit pas encore ?",
        "Comment pouvez-vous lui 'enseigner' quelque chose de nouveau sur son propre business ?",
        "Quelle est l'implication financière ou émotionnelle s'il ne fait rien ?"
      ],
      category: "Vente & Influence"
    },
    quiz: [
      {
        question: "Quel est le profil de vendeur le plus performant selon 'The Challenger Sale' ?",
        options: ["Le bâtisseur de relations.", "Le loup solitaire.", "Le challenger."],
        answer: 2
      },
      {
        question: "Que signifie le 'I' dans la méthode SPIN ?",
        options: ["Innovation.", "Implication (des conséquences du problème).", "Investissement."],
        answer: 1
      },
      {
        question: "Quel principe de Cialdini utilisez-vous en montrant des témoignages clients ?",
        options: ["La rareté.", "La preuve sociale.", "La réciprocité."],
        answer: 1
      }
    ]
  },
  {
    id: '6',
    title: "Passer à l'Échelle",
    description: "Traversez le gouffre, trouvez vos 1000 fans et gardez le focus.",
    file: '/formation/chapitre6.md',
    exercise: {
      questions: [
        "Quel est votre segment 'Tête de Pont' (le plus petit marché possible à dominer) ?",
        "Comment allez-vous transformer vos 10 premiers clients en 'Vrais Fans' ?",
        "Quelle est la chose unique que vous allez arrêter de faire pour vous concentrer sur l'essentiel ?"
      ],
      category: "Échelle & Focus"
    },
    quiz: [
      {
        question: "Qu'est-ce que le 'Gouffre' selon Geoffrey Moore ?",
        options: ["Le manque de financement.", "La transition difficile entre les adopteurs précoces et la majorité.", "La faillite de l'entreprise."],
        answer: 1
      },
      {
        question: "Combien de 'Vrais Fans' sont nécessaires pour vivre de son activité selon Kevin Kelly ?",
        options: ["10 000.", "1 000.", "100."],
        answer: 1
      },
      {
        question: "Quel est le 'Concept de l'Hérisson' de Jim Collins ?",
        options: ["Se protéger des concurrents.", "Se concentrer sur l'intersection de la passion, de l'excellence et du moteur économique.", "Attaquer le marché par surprise."],
        answer: 1
      }
    ]
  }
];
