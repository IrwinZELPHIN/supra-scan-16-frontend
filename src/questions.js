// SUPRA-CODE NEURO-PERFORMANCE™ - Questions du questionnaire
// 29 questions (Q0-Q28) réparties en blocs selon les spécifications

export const questions = [
  // Q0 - PROLOGUE (cas spécial)
  {
    id: 'Q0',
    bloc: 'PROLOGUE',
    titre: 'Objectif de Performance',
    texte: 'Quel domaine représente votre priorité actuelle de performance ?',
    options: [
      { label: 'A', texte: 'Performance intellectuelle (business, étude, création)' },
      { label: 'B', texte: 'Performance sportive / physique' },
      { label: 'C', texte: 'Performance émotionnelle / mentale (leadership, gestion stress)' },
      { label: 'D', texte: 'Performance globale (équilibre complet)' }
    ]
  },

  // Q1-Q9 - BLOC A (Neurochimie Rapide)
  {
    id: 'Q1',
    bloc: 'BLOC A',
    titre: 'Dopamine (Motivation, Drive, Focus)',
    texte: 'Vous sentez-vous souvent démotivé pour attaquer des projets importants ?',
    options: [
      { label: 'A', texte: 'Très souvent démotivé' },
      { label: 'B', texte: 'Parfois difficile à démarrer' },
      { label: 'C', texte: 'Plutôt motivé au quotidien' },
      { label: 'D', texte: 'Presque toujours dans l\'action' }
    ]
  },
  {
    id: 'Q2',
    bloc: 'BLOC A',
    titre: 'Dopamine (Motivation, Drive, Focus)',
    texte: 'Ressentez-vous une perte de plaisir même après des réussites ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q3',
    bloc: 'BLOC A',
    titre: 'Sérotonine (Stabilité Émotionnelle, Humeur)',
    texte: 'Vos humeurs varient-elles fortement selon les situations ?',
    options: [
      { label: 'A', texte: 'Très instables' },
      { label: 'B', texte: 'Moyennement stables' },
      { label: 'C', texte: 'Plutôt stables' },
      { label: 'D', texte: 'Très stables' }
    ]
  },
  {
    id: 'Q4',
    bloc: 'BLOC A',
    titre: 'Sérotonine (Stabilité Émotionnelle, Humeur)',
    texte: 'Avez-vous tendance à vous sentir anxieux sans raison apparente ?',
    options: [
      { label: 'A', texte: 'Très souvent anxieux' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q5',
    bloc: 'BLOC A',
    titre: 'Acétylcholine (Focus, Plasticité Cognitive)',
    texte: 'Vous arrive-t-il de perdre rapidement votre concentration ?',
    options: [
      { label: 'A', texte: 'Très fréquemment' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Presque jamais' }
    ]
  },
  {
    id: 'Q6',
    bloc: 'BLOC A',
    titre: 'Acétylcholine (Focus, Plasticité Cognitive)',
    texte: 'Avez-vous des difficultés à retenir des informations nouvelles ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Presque jamais' }
    ]
  },
  {
    id: 'Q7',
    bloc: 'BLOC A',
    titre: 'Noradrénaline (Éveil, Stress Adaptatif Rapide)',
    texte: 'Ressentez-vous des palpitations ou tensions face aux imprévus ?',
    options: [
      { label: 'A', texte: 'Très fréquemment' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q8',
    bloc: 'BLOC A',
    titre: 'GABA (Calme Interne)',
    texte: 'Avez-vous des difficultés à vous détendre après une journée active ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q9',
    bloc: 'BLOC A',
    titre: 'Glutamate (Apprentissage, Stimulation Cognitive)',
    texte: 'Votre cerveau "s\'emballe-t-il" mentalement (pensées qui tournent en boucle, hyperactivité cognitive) ?',
    options: [
      { label: 'A', texte: 'Très fréquemment' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },

  // Q10-Q13 - BLOC B (Neuromodulation Lente)
  {
    id: 'Q10',
    bloc: 'BLOC B',
    titre: 'Anandamide / Endorphines / Neuropeptide Y',
    texte: 'Ressentez-vous du plaisir à être en nature, à méditer ou à ralentir ?',
    options: [
      { label: 'A', texte: 'Très difficilement' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Souvent' },
      { label: 'D', texte: 'Très naturellement' }
    ]
  },
  {
    id: 'Q11',
    bloc: 'BLOC B',
    titre: 'Anandamide / Endorphines / Neuropeptide Y',
    texte: 'Votre capacité à résister au stress prolongé est :',
    options: [
      { label: 'A', texte: 'Très faible' },
      { label: 'B', texte: 'Faible' },
      { label: 'C', texte: 'Correcte' },
      { label: 'D', texte: 'Très forte' }
    ]
  },
  {
    id: 'Q12',
    bloc: 'BLOC B',
    titre: 'Anandamide / Endorphines / Neuropeptide Y',
    texte: 'Votre tolérance à la douleur (physique ou émotionnelle) est :',
    options: [
      { label: 'A', texte: 'Très faible' },
      { label: 'B', texte: 'Faible' },
      { label: 'C', texte: 'Bonne' },
      { label: 'D', texte: 'Très bonne' }
    ]
  },
  {
    id: 'Q13',
    bloc: 'BLOC B',
    titre: 'Anandamide / Endorphines / Neuropeptide Y',
    texte: 'Ressentez-vous une fatigue générale constante malgré le repos ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },

  // Q14-Q18 - BLOC C (Neurohormonal) - Note: Q19 sera dans BLOC D selon la répartition
  {
    id: 'Q14',
    bloc: 'BLOC C',
    titre: 'Cortisol / Mélatonine / Testostérone / Ocytocine / DHEA / Insuline',
    texte: 'Le matin, votre niveau d\'énergie est :',
    options: [
      { label: 'A', texte: 'Très bas' },
      { label: 'B', texte: 'Assez bas' },
      { label: 'C', texte: 'Correct' },
      { label: 'D', texte: 'Excellente énergie' }
    ]
  },
  {
    id: 'Q15',
    bloc: 'BLOC C',
    titre: 'Cortisol / Mélatonine / Testostérone / Ocytocine / DHEA / Insuline',
    texte: 'Votre qualité de sommeil est :',
    options: [
      { label: 'A', texte: 'Très mauvaise' },
      { label: 'B', texte: 'Moyenne' },
      { label: 'C', texte: 'Bonne' },
      { label: 'D', texte: 'Excellente' }
    ]
  },
  {
    id: 'Q16',
    bloc: 'BLOC C',
    titre: 'Cortisol / Mélatonine / Testostérone / Ocytocine / DHEA / Insuline',
    texte: 'Votre libido ou désir sexuel est :',
    options: [
      { label: 'A', texte: 'Très faible' },
      { label: 'B', texte: 'Faible' },
      { label: 'C', texte: 'Correct' },
      { label: 'D', texte: 'Très bon' }
    ]
  },
  {
    id: 'Q17',
    bloc: 'BLOC C',
    titre: 'Cortisol / Mélatonine / Testostérone / Ocytocine / DHEA / Insuline',
    texte: 'Vous sentez-vous naturellement en confiance avec les autres ?',
    options: [
      { label: 'A', texte: 'Très difficilement' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Plutôt bien' },
      { label: 'D', texte: 'Très facilement' }
    ]
  },
  {
    id: 'Q18',
    bloc: 'BLOC C',
    titre: 'Cortisol / Mélatonine / Testostérone / Ocytocine / DHEA / Insuline',
    texte: 'Avez-vous des variations d\'appétit fortes selon vos émotions ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q19',
    bloc: 'BLOC C',
    titre: 'Support Métabolique (Acides Aminés, Ions, Cofacteurs)',
    texte: 'Avez-vous des crampes musculaires, paupières qui sautent ou spasmes ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },

  // Q20-Q24 - BLOC D (Support Métabolique)
  {
    id: 'Q20',
    bloc: 'BLOC D',
    titre: 'Support Métabolique (Acides Aminés, Ions, Cofacteurs)',
    texte: 'Vos ongles ou cheveux sont-ils fragiles, cassants ou tombent facilement ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q21',
    bloc: 'BLOC D',
    titre: 'Support Métabolique (Acides Aminés, Ions, Cofacteurs)',
    texte: 'Avez-vous régulièrement des problèmes digestifs (lourdeurs, ballonnements) ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q22',
    bloc: 'BLOC D',
    titre: 'Support Métabolique (Acides Aminés, Ions, Cofacteurs)',
    texte: 'Supportez-vous mal la chaleur ou la déshydratation ?',
    options: [
      { label: 'A', texte: 'Très fréquemment' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q23',
    bloc: 'BLOC D',
    titre: 'Support Métabolique (Acides Aminés, Ions, Cofacteurs)',
    texte: 'Êtes-vous souvent sujet à des "vides mentaux" ou des absences cognitives momentanées ?',
    options: [
      { label: 'A', texte: 'Très souvent' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Rarement' },
      { label: 'D', texte: 'Jamais' }
    ]
  },
  {
    id: 'Q24',
    bloc: 'BLOC D',
    titre: 'Ondes Cérébrales',
    texte: 'Vous endormez-vous facilement et dormez-vous profondément ? (Delta)',
    options: [
      { label: 'A', texte: 'Très difficilement' },
      { label: 'B', texte: 'Parfois difficilement' },
      { label: 'C', texte: 'Correctement' },
      { label: 'D', texte: 'Très facilement' }
    ]
  },

  // Q25-Q28 - BLOC E (Ondes Cérébrales)
  {
    id: 'Q25',
    bloc: 'BLOC E',
    titre: 'Ondes Cérébrales',
    texte: 'Avez-vous des moments d\'inspiration créative (visualisations internes fortes) ? (Theta)',
    options: [
      { label: 'A', texte: 'Très rarement' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Souvent' },
      { label: 'D', texte: 'Très souvent' }
    ]
  },
  {
    id: 'Q26',
    bloc: 'BLOC E',
    titre: 'Ondes Cérébrales',
    texte: 'Pouvez-vous vous détendre rapidement en journée (calme mental rapide) ? (Alpha)',
    options: [
      { label: 'A', texte: 'Très difficilement' },
      { label: 'B', texte: 'Parfois difficilement' },
      { label: 'C', texte: 'Correctement' },
      { label: 'D', texte: 'Très facilement' }
    ]
  },
  {
    id: 'Q27',
    bloc: 'BLOC E',
    titre: 'Ondes Cérébrales',
    texte: 'Pouvez-vous rester concentré 60 minutes sur une tâche importante ? (Beta)',
    options: [
      { label: 'A', texte: 'Très difficilement' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Correctement' },
      { label: 'D', texte: 'Très facilement' }
    ]
  },
  {
    id: 'Q28',
    bloc: 'BLOC E',
    titre: 'Ondes Cérébrales',
    texte: 'Avez-vous des pics de lucidité où tout devient clair et logique ? (Gamma)',
    options: [
      { label: 'A', texte: 'Très rarement' },
      { label: 'B', texte: 'Parfois' },
      { label: 'C', texte: 'Souvent' },
      { label: 'D', texte: 'Très souvent' }
    ]
  }
];

