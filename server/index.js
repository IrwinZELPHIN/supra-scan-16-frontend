/* Backend Express : API /api/submit + envoi emails + Gemini + SPA fallback */
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = process.env.PORT || 10000;
const APP_PUBLIC_URL = process.env.APP_PUBLIC_URL || "http://localhost:" + PORT;

if (!process.env.SENDGRID_API_KEY) throw new Error("Missing SENDGRID_API_KEY");
if (!process.env.SENDGRID_FROM) throw new Error("Missing SENDGRID_FROM");
if (!process.env.EMAIL_QG) throw new Error("Missing EMAIL_QG");
if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Servir les fichiers statiques du build Vite
app.use(express.static(path.join(__dirname, "../dist")));

// Prompt d'analyse neurochimique complet selon spécifications
const ANALYST_PROMPT = `
## 1. RÔLE ET DIRECTIVES FONDAMENTALES

Tu incarnes un consortium d'experts de renommée mondiale, fusionnant les compétences d'un neuroscientifique, d'un médecin fonctionnel spécialisé en micronutrition et neuro-nutrition pour la performance, la santé et le bien-être, et d'un préparateur mental pour champions olympiques et du monde, et spécialiste en concentration, neurochimie et neuro-mouvemments et notamment en sommeil. Ton analyse doit être d'une profondeur et d'une clarté exceptionnelles.
Tes principes directeurs non-négociables sont :
* Pensée Systémique : Tu ne vois JAMAIS un score de manière isolée. Tu expliques COMMENT et POURQUOI les différents piliers (blocs) s'influencent mutuellement. Tu dois obligatoirement créer des ponts logiques (ex: "Le faible score du Pilier D est la cause racine du faible score du Pilier B").
* Cause Racine & Hiérarchisation : Tu identifies sans pitié ce qui est critique (la fondation qui s'effondre) et ce qui est secondaire (la conséquence). Ton plan d'action est structuré autour de cette hiérarchie.
* Analyse Contextualisée : Chaque élément de ton analyse doit être constamment ramené à l'objectif principal du client : {{discipline}}.
* Langage Puissant et Clair : Tu utilises un langage expert mais compréhensible, avec des métaphores fortes pour rendre les concepts accessibles. Ton but est d'éclairer, de responsabiliser et de motiver.
* Approche Narrative : Tu ne listes jamais de données. Tu racontes l'histoire neurochimique cohérente de la personne.

## 2. DONNÉES BRUTES DU CLIENT (Source de Vérité Absolue)

Tu dois accepter les données suivantes comme la vérité absolue. Base TOUTE ton analyse sur ces éléments.
* Date de l'Analyse : {{dateScan}}
* Nom du Client : {{nomClient}}
* Discipline / Domaine de Performance : {{discipline}}
* Neurotype Dominant : {{nomNeurotype}}
    * Caractéristique Principale : {{caracteristiqueNeurotype}}
    * Axe de Développement : {{axeDeveloppementNeurotype}}
* Analyse par Pilier :
    * Pilier A (Neurochimie Rapide) : Score: {{scoreBlocA}}/27 ({{pourcentageBlocA}}%), Interprétation: {{interpretationA}}, Alerte: {{alerteA}}
        * Sous-scores : Dopamine ({{pourcentageDopamine}}%), Sérotonine ({{pourcentageSerotonine}}%), Acétylcholine ({{pourcentageAcetylcholine}}%), GABA ({{pourcentageGABA}}%), Glutamate ({{pourcentageGlutamate}}%), Noradrénaline ({{pourcentageNoradrenaline}}%)
    * Pilier B (Neuromodulation Lente / Résilience) : Score: {{scoreBlocB}}/12 ({{pourcentageBlocB}}%), Interprétation: {{interpretationB}}, Alerte: {{alerteB}}
    * Pilier C (Neurohormonal) : Score: {{scoreBlocC}}/15 ({{pourcentageBlocC}}%), Interprétation: {{interpretationC}}, Alerte: {{alerteC}}
    * Pilier D (Support Métabolique / Fondations) : Score: {{scoreBlocD}}/15 ({{pourcentageBlocD}}%), Interprétation: {{interpretationD}}, Alerte: {{alerteD}}
    * Pilier E (Ondes Cérébrales / Synchronisation) : Score: {{scoreBlocE}}/15 ({{pourcentageBlocE}}%), Interprétation: {{interpretationE}}, Alerte: {{alerteE}}

## 3. STRUCTURE DU RAPPORT ET INSTRUCTIONS DE RÉDACTION (À SUIVRE À LA LETTRE)
Rédige le rapport en suivant scrupuleusement cette structure et ce formatage Markdown.

DOSSIER NEUROCHIMIQUE APPLIQUÉ – {{nomClient}}
Date de l'analyse : {{dateScan}} Objectif de performance déclaré : {{discipline}}

Synthèse Globale : Vision de l'Expert
Commence par un paragraphe d'ouverture qui capture l'essence du profil. Identifie et mets en exergue les deux alertes les plus critiques. Explique le lien de cause à effet entre elles (ex: "Votre faible support métabolique est la cause racine de votre manque de résilience"). Conclus en créant une métaphore puissante qui résume le profil (ex: "Le profil est celui d'une Formule 1 avec des pneus de vélo.").

Votre Neurotype Dominant : {{nomNeurotype}}
Présente ce Neurotype comme la force innée du client, son "super-pouvoir" naturel. Analyse ses implications dans le contexte spécifique de sa discipline. Identifie tout paradoxe ou conflit avec les autres scores (ex: "Un Neurotype GABA-Calme est un atout majeur, mais il est en conflit direct avec le score critique du Pilier B, indiquant que cette capacité est un mécanisme de défense et non un calme stable."). Si selon le contexte, tu t'aperçois qu'il est attrait à neurotype qui n'a pas été mentionné nulle part, crée-le et donne un nom spécifique, seulement si ses résultats ne correspondent à aucun neurotype.

Analyse Détaillée par Pilier Neurochimique
Pour chaque pilier de A à E, présente les informations comme suit :
* Pilier [Lettre] : [Nom du Pilier]
* Score : {{scoreBloc}} ({{pourcentageBloc}}%)
* Interprétation : {{interpretation}}
* Alerte : {{alerte}}
* Analyse de l'Expert : Ne répète pas les données. Crée des ponts logiques. Réponds à la question : "Qu'est-ce que ce score signifie concrètement pour {{nomClient}} et son objectif de {{discipline}} ?".
* Pour le dire simplement... (Obligatoire): Ajoute une phrase de vulgarisation avec une métaphore simple (ex: "En clair, votre Pilier D est comme les fondations d'une maison. Actuellement, elles sont fragiles, et toute la structure risque de trembler au moindre coup de vent.").

Plan d'Action Stratégique
Structure le plan d'action en trois piliers clairs, liés aux horizons de temps.
* PILIER 1 (Court Terme) : FONDATIONS - Stabilisation Urgente
    * Objectif : Corriger les déséquilibres critiques qui sapent l'ensemble du système et représentent un risque immédiat.
    * Action 1 (basée sur le score le plus bas)
    * Action 2 (basée sur le deuxième score le plus bas)
* PILIER 2 (Moyen Terme) : CORRECTION - Reconstruction de la Stabilité
    * Objectif : Une fois les urgences traitées, renforcer les systèmes de régulation émotionnelle, hormonale et de concentration.
    * Action 1 et Action 2
* PILIER 3 (Long Terme) : OPTIMISATION - Libération de la Haute Performance
    * Objectif : Capitaliser sur les forces naturelles (le Neurotype ou celui que tu as crée s'il ne correspond à aucun Neurotype mentionné) pour atteindre un niveau de performance et de fluidité supérieur.
    * Action 1 et Action 2

Conclusion de l'Expert & Projection
Termine par un paragraphe de conclusion puissant qui résume le potentiel à débloquer.
* Projection & Prévention : (Obligatoire) Basé sur les déséquilibres les plus critiques (ex: Pilier D et B très bas), décris les risques potentiels à long terme si rien n'est fait (ex: "Un support métabolique et une résilience chroniquement bas peuvent, sur le long terme, augmenter les risques de burnout, de troubles de l'humeur, ou d'inflammation chronique, sapant ainsi la longévité de votre carrière.").
* Vision Inspirante : Offre une vision de ce qui est possible une fois le plan d'action mis en œuvre.

MENTION LÉGALE IMPORTANTE
(Obligatoire : Tu dois inclure ce texte exact à la toute fin du rapport, sans modification.)

Avis de non-responsabilité : Cette analyse est un outil d'évaluation de la performance basé sur les réponses fournies et est destinée à des fins éducatives et d'optimisation du bien-être. Elle ne constitue en aucun cas un diagnostic, un avis ou un traitement médical. Les informations et recommandations proposées ne remplacent pas une consultation avec un professionnel de la santé qualifié. Il est de votre responsabilité de consulter un médecin ou un autre professionnel de santé pour toute question relative à votre état de santé.
`;

// Fonctions helper pour les interprétations et alertes
function getInterpretation(pilier, percentage) {
  const interpretations = {
    A: {
      excellent: "Neurochimie rapide optimale - Motivation, focus et stabilité émotionnelle au top",
      bon: "Bon équilibre neurochimique avec quelques axes d'amélioration",
      moyen: "Déséquilibres modérés nécessitant une attention particulière",
      faible: "Déséquilibres significatifs impactant motivation et concentration"
    },
    B: {
      excellent: "Résilience exceptionnelle - Capacité d'adaptation et récupération optimales",
      bon: "Bonne capacité de résilience avec marge de progression",
      moyen: "Résilience modérée nécessitant un renforcement",
      faible: "Fragilité face au stress et difficultés de récupération"
    },
    C: {
      excellent: "Équilibre hormonal optimal - Énergie et régulation parfaites",
      bon: "Bon équilibre hormonal avec quelques fluctuations",
      moyen: "Déséquilibres hormonaux modérés à surveiller",
      faible: "Déséquilibres hormonaux significatifs impactant l'énergie"
    },
    D: {
      excellent: "Fondations métaboliques solides - Support énergétique optimal",
      bon: "Bonnes bases métaboliques avec optimisations possibles",
      moyen: "Support métabolique insuffisant nécessitant des ajustements",
      faible: "Fondations métaboliques fragiles compromettant la performance"
    },
    E: {
      excellent: "Synchronisation cérébrale parfaite - États de flow accessibles",
      bon: "Bonne cohérence des ondes cérébrales avec potentiel d'amélioration",
      moyen: "Synchronisation modérée nécessitant un travail spécifique",
      faible: "Désynchronisation impactant focus et performance cognitive"
    }
  };

  const niveau = percentage >= 80 ? 'excellent' : 
                percentage >= 60 ? 'bon' : 
                percentage >= 40 ? 'moyen' : 'faible';
  
  return interpretations[pilier]?.[niveau] || "Analyse en cours";
}

function getAlerte(pilier, percentage) {
  if (percentage >= 70) return "Aucune alerte - Performance satisfaisante";
  if (percentage >= 50) return "Attention - Optimisation recommandée";
  if (percentage >= 30) return "Alerte modérée - Action corrective nécessaire";
  return "Alerte critique - Intervention urgente requise";
}

function calculateSubScore(neurotransmitter, answers) {
  // Mapping des questions par neurotransmetteur (selon le fichier questions.js)
  const mapping = {
    dopamine: [0, 1], // Q1, Q2 (indices 0,1 dans le tableau answers)
    serotonine: [2, 3], // Q3, Q4
    acetylcholine: [4, 5], // Q5, Q6
    noradrenaline: [6, 7], // Q7, Q8
    gaba: [8] // Q9 (une seule question)
  };

  const questionIndices = mapping[neurotransmetter] || [];
  if (questionIndices.length === 0) return 0;

  const scoreMap = { A: 0, B: 1, C: 2, D: 3 };
  let total = 0;
  let maxPossible = questionIndices.length * 3;

  questionIndices.forEach(index => {
    if (answers[index]) {
      total += scoreMap[answers[index]] || 0;
    }
  });

  return Math.round((total / maxPossible) * 100);
}

function computeScores(answers) {
  const scores = {
    blocA: { total: 0, max: 27 }, // 9 questions × 3 points max
    blocB: { total: 0, max: 12 }, // 4 questions × 3 points max
    blocC: { total: 0, max: 15 }, // 5 questions × 3 points max
    blocD: { total: 0, max: 15 }, // 5 questions × 3 points max
    blocE: { total: 0, max: 15 }  // 5 questions × 3 points max
  };

  // Mapping des questions vers les blocs (Q0 = contexte, Q1-Q28 = analyse)
  const questionMapping = {
    // BLOC A (Q1-Q9) - Neurochimie Rapide (9 questions)
    Q1: 'blocA', Q2: 'blocA', Q3: 'blocA', Q4: 'blocA', Q5: 'blocA', Q6: 'blocA', Q7: 'blocA', Q8: 'blocA', Q9: 'blocA',
    // BLOC B (Q10-Q13) - Neuromodulation Lente (4 questions)
    Q10: 'blocB', Q11: 'blocB', Q12: 'blocB', Q13: 'blocB',
    // BLOC C (Q14-Q18) - Neurohormonal (5 questions)
    Q14: 'blocC', Q15: 'blocC', Q16: 'blocC', Q17: 'blocC', Q18: 'blocC',
    // BLOC D (Q19-Q23) - Support Métabolique (5 questions)
    Q19: 'blocD', Q20: 'blocD', Q21: 'blocD', Q22: 'blocD', Q23: 'blocD',
    // BLOC E (Q24-Q28) - Ondes Cérébrales (5 questions)
    Q24: 'blocE', Q25: 'blocE', Q26: 'blocE', Q27: 'blocE', Q28: 'blocE'
  };

  // Calcul des scores par réponse (A=0, B=1, C=2, D=3)
  const scoreMap = { A: 0, B: 1, C: 2, D: 3 };
  
  answers.forEach((answer, index) => {
    const questionId = `Q${index + 1}`;
    const bloc = questionMapping[questionId];
    if (bloc && scores[bloc]) {
      scores[bloc].total += scoreMap[answer] || 0;
    }
  });

  // Calcul des pourcentages
  Object.keys(scores).forEach(bloc => {
    scores[bloc].percentage = Math.round((scores[bloc].total / scores[bloc].max) * 100);
  });

  return scores;
}

function determineNeurotype(scores) {
  const neurotypes = [
    {
      nom: "ALPHA-PERFORMER",
      caracteristique: "Excellence sous pression avec neurochimie rapide optimisée",
      axeDeveloppement: "Maintenir l'équilibre énergétique sur la durée"
    },
    {
      nom: "STRATEGIST-CALM",
      caracteristique: "Résilience exceptionnelle et vision long terme",
      axeDeveloppement: "Optimiser la réactivité et l'adaptabilité rapide"
    },
    {
      nom: "CREATIVE-FLOW",
      caracteristique: "Synchronisation cérébrale et créativité intuitive",
      axeDeveloppement: "Structurer l'énergie pour une performance constante"
    },
    {
      nom: "ENDURANCE-MASTER",
      caracteristique: "Support métabolique robuste et récupération optimale",
      axeDeveloppement: "Développer l'agilité neurochimique"
    }
  ];

  // Logique basée sur les scores les plus élevés
  const maxScore = Math.max(
    scores.blocA.percentage, 
    scores.blocB.percentage, 
    scores.blocC.percentage, 
    scores.blocD.percentage, 
    scores.blocE.percentage
  );
  
  if (scores.blocA.percentage === maxScore) return neurotypes[0];
  if (scores.blocB.percentage === maxScore) return neurotypes[1];
  if (scores.blocE.percentage === maxScore) return neurotypes[2];
  if (scores.blocD.percentage === maxScore) return neurotypes[3];
  
  return neurotypes[0]; // Par défaut
}

app.post("/api/transmit", async (req, res) => {
  try {
    const payload = req.body;
    
    // Validation basique
    if (!payload?.profile?.email || !Array.isArray(payload?.answers) || payload.answers.length < 29) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }
    
    console.log('Payload reçu:', {
      email: payload.profile.email,
      answersCount: payload.answers.length,
      timestamp: payload.timestamp
    });
    
    // Adapter le payload au format attendu par l'API existante
    const adaptedPayload = {
      identity: {
        firstName: payload.profile.prenom,
        lastName: payload.profile.nom,
        email: payload.profile.email,
        objective: payload.objectif
      },
      answers: payload.answers,
      meta: {
        dateScan: payload.timestamp,
        appVersion: payload.appVersion
      }
    };
    
    // Réutiliser la logique existante de /api/submit
    const scores = computeScores(adaptedPayload.answers);
    const neurotype = determineNeurotype(scores);
    const scoreGlobal = Math.round(
      Object.values(scores).reduce((acc, bloc) => acc + bloc.percentage, 0) / 5
    );

    // Construire le prompt pour Gemini avec variables de template
    const dateScan = new Date().toLocaleDateString('fr-FR');
    const nomClient = `${adaptedPayload.identity.firstName} ${adaptedPayload.identity.lastName}`;
    const discipline = adaptedPayload.identity.objective || "Performance générale";
    
    // Remplacer les variables de template dans le prompt
    const prompt = ANALYST_PROMPT
      .replace(/\{\{dateScan\}\}/g, dateScan)
      .replace(/\{\{nomClient\}\}/g, nomClient)
      .replace(/\{\{discipline\}\}/g, discipline)
      .replace(/\{\{nomNeurotype\}\}/g, neurotype.nom)
      .replace(/\{\{caracteristiqueNeurotype\}\}/g, neurotype.caracteristique)
      .replace(/\{\{axeDeveloppementNeurotype\}\}/g, neurotype.axeDeveloppement)
      .replace(/\{\{scoreBlocA\}\}/g, scores.blocA.total)
      .replace(/\{\{pourcentageBlocA\}\}/g, scores.blocA.percentage)
      .replace(/\{\{scoreBlocB\}\}/g, scores.blocB.total)
      .replace(/\{\{pourcentageBlocB\}\}/g, scores.blocB.percentage)
      .replace(/\{\{scoreBlocC\}\}/g, scores.blocC.total)
      .replace(/\{\{pourcentageBlocC\}\}/g, scores.blocC.percentage)
      .replace(/\{\{scoreBlocD\}\}/g, scores.blocD.total)
      .replace(/\{\{pourcentageBlocD\}\}/g, scores.blocD.percentage)
      .replace(/\{\{scoreBlocE\}\}/g, scores.blocE.total)
      .replace(/\{\{pourcentageBlocE\}\}/g, scores.blocE.percentage)
      // Ajouter les interprétations et alertes (à définir selon la logique métier)
      .replace(/\{\{interpretationA\}\}/g, getInterpretation('A', scores.blocA.percentage))
      .replace(/\{\{alerteA\}\}/g, getAlerte('A', scores.blocA.percentage))
      .replace(/\{\{interpretationB\}\}/g, getInterpretation('B', scores.blocB.percentage))
      .replace(/\{\{alerteB\}\}/g, getAlerte('B', scores.blocB.percentage))
      .replace(/\{\{interpretationC\}\}/g, getInterpretation('C', scores.blocC.percentage))
      .replace(/\{\{alerteC\}\}/g, getAlerte('C', scores.blocC.percentage))
      .replace(/\{\{interpretationD\}\}/g, getInterpretation('D', scores.blocD.percentage))
      .replace(/\{\{alerteD\}\}/g, getAlerte('D', scores.blocD.percentage))
      .replace(/\{\{interpretationE\}\}/g, getInterpretation('E', scores.blocE.percentage))
      .replace(/\{\{alerteE\}\}/g, getAlerte('E', scores.blocE.percentage))
      // Sous-scores pour le Pilier A (à calculer selon la logique métier)
      .replace(/\{\{pourcentageDopamine\}\}/g, calculateSubScore('dopamine', adaptedPayload.answers))
      .replace(/\{\{pourcentageSerotonine\}\}/g, calculateSubScore('serotonine', adaptedPayload.answers))
      .replace(/\{\{pourcentageAcetylcholine\}\}/g, calculateSubScore('acetylcholine', adaptedPayload.answers))
      .replace(/\{\{pourcentageGABA\}\}/g, calculateSubScore('gaba', adaptedPayload.answers))
      .replace(/\{\{pourcentageGlutamate\}\}/g, calculateSubScore('glutamate', adaptedPayload.answers))
      .replace(/\{\{pourcentageNoradrenaline\}\}/g, calculateSubScore('noradrenaline', adaptedPayload.answers));

    console.log("Génération du rapport avec Gemini (prompt complet)...");
    const result = await model.generateContent([{ text: prompt }]);
    const aiText = result?.response?.text?.() || "Rapport en cours de génération...";

    // E-mails
    const from = process.env.SENDGRID_FROM;
    const HQ = process.env.EMAIL_QG;

    console.log("Envoi des emails...");

    // Email Client
    await sgMail.send({
      to: adaptedPayload.identity.email,
      from: {
        email: from,
        name: "SUPRA-CODE NEURO-PERFORMANCE™"
      },
      subject: "🧠 Votre Code Neurochimique est prêt - Accès Niveau 1",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff;">
          <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">NIVEAU 1 ATTEINT</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">PRISE DE CONSCIENCE</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #f5efe6; margin-bottom: 20px;">Bonjour ${adaptedPayload.identity.firstName},</h2>
            
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Votre <strong>Code Neurochimique</strong> a été scanné avec succès. 
              Votre transformation commence maintenant.
            </p>
            
            <div style="background: #1f1f1f; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">Votre Score Global</h3>
              <div style="font-size: 32px; font-weight: bold; color: #f5efe6;">${scoreGlobal}%</div>
              <p style="margin: 5px 0 0 0; color: #999;">Performance Neurochimique</p>
            </div>
            
            <div style="background: #1f1f1f; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">Votre Neurotype</h3>
              <div style="font-size: 18px; font-weight: bold; color: #f5efe6;">${neurotype.nom}</div>
              <p style="margin: 5px 0 0 0; color: #999;">${neurotype.caracteristique}</p>
            </div>
            
            <div style="background: #1f1f1f; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #dc2626; margin: 0 0 10px 0;">Votre Rapport Complet</h4>
              <div style="max-height: 300px; overflow-y: auto; font-size: 14px; line-height: 1.5; color: #ccc;">
                <pre style="white-space: pre-wrap; margin: 0;">${aiText}</pre>
              </div>
            </div>
            
            <p style="line-height: 1.6; color: #ccc;">
              Ce rapport contient votre analyse neurochimique complète, 
              votre neurotype dominant, et votre plan d'action personnalisé.
            </p>
          </div>
          
          <div style="background: #1f1f1f; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">SUPRA-CODE NEURO-PERFORMANCE™</p>
            <p style="margin: 5px 0 0 0;">Votre performance ne sera plus jamais un hasard.</p>
          </div>
        </div>
      `
    });

    // Email QG
    await sgMail.send({
      to: HQ,
      from: {
        email: from,
        name: "SUPRA-CODE NEURO-PERFORMANCE™"
      },
      subject: "Nouveau scan Supra-Code — Transmission QG",
      text: `
Client: ${adaptedPayload.identity.firstName} ${adaptedPayload.identity.lastName} <${adaptedPayload.identity.email}>
Discipline: ${adaptedPayload.identity.objective || "N/A"}
Date: ${dateScan}
Score Global: ${scoreGlobal}%
Neurotype: ${neurotype.nom}

Scores détaillés:
- Pilier A (Neurochimie Rapide): ${scores.blocA.percentage}%
- Pilier B (Neuromodulation Lente): ${scores.blocB.percentage}%
- Pilier C (Neurohormonal): ${scores.blocC.percentage}%
- Pilier D (Support Métabolique): ${scores.blocD.percentage}%
- Pilier E (Ondes Cérébrales): ${scores.blocE.percentage}%

Réponses (29): ${adaptedPayload.answers.join(", ")}

Rapport complet:
${aiText}
      `
    });

    console.log("Emails envoyés avec succès");
    
    res.json({ 
      success: true, 
      message: 'Transmission réussie',
      scoreGlobal,
      neurotype: neurotype.nom
    });
    
  } catch (error) {
    console.error('Erreur transmission:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post("/api/submit", async (req, res) => {
  try {
    const { identity, answers, meta } = req.body || {};
    
    if (
      !identity ||
      !identity.firstName ||
      !identity.lastName ||
      !identity.email ||
      !Array.isArray(answers) ||
      answers.length !== 29
    ) {
      return res.status(400).send("Payload incomplet.");
    }

    console.log("Traitement du scan pour:", identity.email);

    // 1) Calcul des scores
    const scores = computeScores(answers);
    const neurotype = determineNeurotype(scores);
    const scoreGlobal = Math.round(
      Object.values(scores).reduce((acc, bloc) => acc + bloc.percentage, 0) / 5
    );

    // 2) Construire le prompt pour Gemini avec variables de template
    const dateScan = new Date().toLocaleDateString('fr-FR');
    const nomClient = `${identity.firstName} ${identity.lastName}`;
    const discipline = identity.objective || "Performance générale";
    
    // Remplacer les variables de template dans le prompt
    const prompt = ANALYST_PROMPT
      .replace(/\{\{dateScan\}\}/g, dateScan)
      .replace(/\{\{nomClient\}\}/g, nomClient)
      .replace(/\{\{discipline\}\}/g, discipline)
      .replace(/\{\{nomNeurotype\}\}/g, neurotype.nom)
      .replace(/\{\{caracteristiqueNeurotype\}\}/g, neurotype.caracteristique)
      .replace(/\{\{axeDeveloppementNeurotype\}\}/g, neurotype.axeDeveloppement)
      .replace(/\{\{scoreBlocA\}\}/g, scores.blocA.total)
      .replace(/\{\{pourcentageBlocA\}\}/g, scores.blocA.percentage)
      .replace(/\{\{scoreBlocB\}\}/g, scores.blocB.total)
      .replace(/\{\{pourcentageBlocB\}\}/g, scores.blocB.percentage)
      .replace(/\{\{scoreBlocC\}\}/g, scores.blocC.total)
      .replace(/\{\{pourcentageBlocC\}\}/g, scores.blocC.percentage)
      .replace(/\{\{scoreBlocD\}\}/g, scores.blocD.total)
      .replace(/\{\{pourcentageBlocD\}\}/g, scores.blocD.percentage)
      .replace(/\{\{scoreBlocE\}\}/g, scores.blocE.total)
      .replace(/\{\{pourcentageBlocE\}\}/g, scores.blocE.percentage)
      // Ajouter les interprétations et alertes
      .replace(/\{\{interpretationA\}\}/g, getInterpretation('A', scores.blocA.percentage))
      .replace(/\{\{alerteA\}\}/g, getAlerte('A', scores.blocA.percentage))
      .replace(/\{\{interpretationB\}\}/g, getInterpretation('B', scores.blocB.percentage))
      .replace(/\{\{alerteB\}\}/g, getAlerte('B', scores.blocB.percentage))
      .replace(/\{\{interpretationC\}\}/g, getInterpretation('C', scores.blocC.percentage))
      .replace(/\{\{alerteC\}\}/g, getAlerte('C', scores.blocC.percentage))
      .replace(/\{\{interpretationD\}\}/g, getInterpretation('D', scores.blocD.percentage))
      .replace(/\{\{alerteD\}\}/g, getAlerte('D', scores.blocD.percentage))
      .replace(/\{\{interpretationE\}\}/g, getInterpretation('E', scores.blocE.percentage))
      .replace(/\{\{alerteE\}\}/g, getAlerte('E', scores.blocE.percentage))
      // Sous-scores pour le Pilier A
      .replace(/\{\{pourcentageDopamine\}\}/g, calculateSubScore('dopamine', answers))
      .replace(/\{\{pourcentageSerotonine\}\}/g, calculateSubScore('serotonine', answers))
      .replace(/\{\{pourcentageAcetylcholine\}\}/g, calculateSubScore('acetylcholine', answers))
      .replace(/\{\{pourcentageGABA\}\}/g, calculateSubScore('gaba', answers))
      .replace(/\{\{pourcentageGlutamate\}\}/g, calculateSubScore('glutamate', answers))
      .replace(/\{\{pourcentageNoradrenaline\}\}/g, calculateSubScore('noradrenaline', answers));

    // 3) Appel Gemini
    console.log("Génération du rapport avec Gemini...");
    const result = await model.generateContent([{ text: prompt }]);
    const aiText = result?.response?.text?.() || "Rapport en cours de génération...";

    // 4) E-mails
    const from = process.env.SENDGRID_FROM;
    const HQ = process.env.EMAIL_QG;

    console.log("Envoi des emails...");

    // Email Client
    await sgMail.send({
      to: identity.email,
      from: {
        email: from,
        name: "SUPRA-CODE NEURO-PERFORMANCE™"
      },
      subject: "🧠 Votre Code Neurochimique est prêt - Accès Niveau 1",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff;">
          <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">NIVEAU 1 ATTEINT</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">PRISE DE CONSCIENCE</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #f5efe6; margin-bottom: 20px;">Bonjour ${identity.firstName},</h2>
            
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Votre <strong>Code Neurochimique</strong> a été scanné avec succès. 
              Votre transformation commence maintenant.
            </p>
            
            <div style="background: #1f1f1f; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">Votre Score Global</h3>
              <div style="font-size: 32px; font-weight: bold; color: #f5efe6;">${scoreGlobal}%</div>
              <p style="margin: 5px 0 0 0; color: #999;">Performance Neurochimique</p>
            </div>
            
            <div style="background: #1f1f1f; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">Votre Neurotype</h3>
              <div style="font-size: 18px; font-weight: bold; color: #f5efe6;">${neurotype.nom}</div>
              <p style="margin: 5px 0 0 0; color: #999;">${neurotype.caracteristique}</p>
            </div>
            
            <div style="background: #1f1f1f; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #dc2626; margin: 0 0 10px 0;">Votre Rapport Complet</h4>
              <div style="max-height: 300px; overflow-y: auto; font-size: 14px; line-height: 1.5; color: #ccc;">
                <pre style="white-space: pre-wrap; margin: 0;">${aiText}</pre>
              </div>
            </div>
            
            <p style="line-height: 1.6; color: #ccc;">
              Ce rapport contient votre analyse neurochimique complète, 
              votre neurotype dominant, et votre plan d'action personnalisé.
            </p>
          </div>
          
          <div style="background: #1f1f1f; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">SUPRA-CODE NEURO-PERFORMANCE™</p>
            <p style="margin: 5px 0 0 0;">Votre performance ne sera plus jamais un hasard.</p>
          </div>
        </div>
      `
    });

    // Email QG
    await sgMail.send({
      to: HQ,
      from: {
        email: from,
        name: "SUPRA-CODE NEURO-PERFORMANCE™"
      },
      subject: "Nouveau scan Supra-Code — Transmission QG",
      text: `
Client: ${identity.firstName} ${identity.lastName} <${identity.email}>
Discipline: ${identity.objective || "N/A"}
Date: ${dateScan}
Score Global: ${scoreGlobal}%
Neurotype: ${neurotype.nom}

Scores détaillés:
- Pilier A (Neurochimie Rapide): ${scores.blocA.percentage}%
- Pilier B (Neuromodulation Lente): ${scores.blocB.percentage}%
- Pilier C (Neurohormonal): ${scores.blocC.percentage}%
- Pilier D (Support Métabolique): ${scores.blocD.percentage}%
- Pilier E (Ondes Cérébrales): ${scores.blocE.percentage}%

Réponses (29): ${answers.join(", ")}

Rapport complet:
${aiText}
      `
    });

    console.log("Emails envoyés avec succès");

    return res.json({ 
      ok: true, 
      deliveredAt: new Date().toISOString(), 
      url: APP_PUBLIC_URL,
      scoreGlobal,
      neurotype: neurotype.nom
    });

  } catch (err) {
    console.error("API /api/transmit error:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({ 
      error: "Erreur serveur", 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Servir le build Vite pour toutes les autres routes
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../dist", "index.html")));

app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});

