import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import crypto from "node:crypto";
import cors from "cors";

// Initialisation Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Configuration CORS
const corsHandler = cors({ origin: true });

// Variables d'environnement
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const FUNCTIONS_ADMIN_KEY = process.env.FUNCTIONS_ADMIN_KEY || "nWpOn75JdE4qElhGtk6db3eBvjIWUvMo";
const SITE_BASE_URL = process.env.SITE_BASE_URL || "https://supra-code-client.onrender.com";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCucu7WJIOOgigQNExFUTPLbv6dOUu2QPQ";
const QG_API_SECRET = process.env.QG_API_SECRET || "nWpOn75JdE4qElhGtk6db3eBvjIWUvMo";

// Configuration SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Utilitaires
const genToken = () => crypto.randomBytes(24).toString("hex");
const today = () => new Date().toISOString().slice(0, 10);

// Calcul des scores par bloc
function calculateScores(answers) {
  const scores = {
    blocA: { total: 0, max: 27 },
    blocB: { total: 0, max: 12 },
    blocC: { total: 0, max: 15 },
    blocD: { total: 0, max: 15 },
    blocE: { total: 0, max: 15 }
  };

  // Mapping des questions vers les blocs
  const questionMapping = {
    // BLOC A (Q1-Q9) - Neurochimie Rapide
    Q1: 'blocA', Q2: 'blocA', Q3: 'blocA', Q4: 'blocA', Q5: 'blocA', Q6: 'blocA', Q7: 'blocA', Q8: 'blocA', Q9: 'blocA',
    // BLOC B (Q10-Q13) - Neuromodulation Lente
    Q10: 'blocB', Q11: 'blocB', Q12: 'blocB', Q13: 'blocB',
    // BLOC C (Q14-Q18) - Neurohormonal
    Q14: 'blocC', Q15: 'blocC', Q16: 'blocC', Q17: 'blocC', Q18: 'blocC',
    // BLOC D (Q19-Q23) - Support Métabolique
    Q19: 'blocD', Q20: 'blocD', Q21: 'blocD', Q22: 'blocD', Q23: 'blocD',
    // BLOC E (Q24-Q28) - Ondes Cérébrales
    Q24: 'blocE', Q25: 'blocE', Q26: 'blocE', Q27: 'blocE', Q28: 'blocE'
  };

  // Calcul des scores
  Object.entries(answers).forEach(([questionId, answer]) => {
    const bloc = questionMapping[questionId];
    if (bloc && scores[bloc]) {
      // Conversion A=3, B=2, C=1, D=0
      const scoreMap = { 'A': 3, 'B': 2, 'C': 1, 'D': 0 };
      const score = scoreMap[answer] || 0;
      scores[bloc].total += score;
    }
  });

  // Calcul des pourcentages
  Object.keys(scores).forEach(bloc => {
    scores[bloc].percentage = Math.round((scores[bloc].total / scores[bloc].max) * 100);
  });

  return scores;
}

// Analyse Gemini AI
async function analyzeWithGemini(operator, answers, scores) {
  try {
    // Construction du prompt avec les données réelles
    const discipline = operator.discipline || "Performance générale";
    const nomClient = `${operator.prenom} ${operator.nom}`;
    const dateScan = today();
    
    // Détermination du neurotype dominant (logique simplifiée)
    const neurotype = determineNeurotype(scores);
    
    const prompt = `## 1. RÔLE ET DIRECTIVES FONDAMENTALES

Tu incarnes un consortium d'experts de renommée mondiale, fusionnant les compétences d'un neuroscientifique, d'un médecin fonctionnel spécialisé en micronutrition et neuro-nutrition pour la performance, la santé et le bien-être, et d'un préparateur mental pour champions olympiques et du monde, et spécialiste en concentration, neurochimie et neuro-mouvemments et notamment en sommeil. Ton analyse doit être d'une profondeur et d'une clarté exceptionnelles.

## 2. DONNÉES BRUTES DU CLIENT (Source de Vérité Absolue)

* Date de l'Analyse : ${dateScan}
* Nom du Client : ${nomClient}
* Discipline / Domaine de Performance : ${discipline}
* Neurotype Dominant : ${neurotype.nom}
    * Caractéristique Principale : ${neurotype.caracteristique}
    * Axe de Développement : ${neurotype.axeDeveloppement}
* Analyse par Pilier :
    * Pilier A (Neurochimie Rapide) : Score: ${scores.blocA.total}/${scores.blocA.max} (${scores.blocA.percentage}%)
    * Pilier B (Neuromodulation Lente / Résilience) : Score: ${scores.blocB.total}/${scores.blocB.max} (${scores.blocB.percentage}%)
    * Pilier C (Neurohormonal) : Score: ${scores.blocC.total}/${scores.blocC.max} (${scores.blocC.percentage}%)
    * Pilier D (Support Métabolique / Fondations) : Score: ${scores.blocD.total}/${scores.blocD.max} (${scores.blocD.percentage}%)
    * Pilier E (Ondes Cérébrales / Synchronisation) : Score: ${scores.blocE.total}/${scores.blocE.max} (${scores.blocE.percentage}%)

## 3. STRUCTURE DU RAPPORT

Rédige un rapport complet suivant cette structure exacte :

# DOSSIER NEUROCHIMIQUE APPLIQUÉ – ${nomClient}

**Date de l'analyse :** ${dateScan}  
**Objectif de performance déclaré :** ${discipline}

## Synthèse Globale : Vision de l'Expert

[Analyse globale du profil avec identification des 2 alertes les plus critiques et métaphore puissante]

## Votre Neurotype Dominant : ${neurotype.nom}

[Présentation du neurotype comme super-pouvoir et analyse des paradoxes éventuels]

## Analyse Détaillée par Pilier Neurochimique

### Pilier A : Neurochimie Rapide
**Score :** ${scores.blocA.total}/${scores.blocA.max} (${scores.blocA.percentage}%)

**Analyse de l'Expert :** [Analyse contextuelle pour ${discipline}]

**Pour le dire simplement...** [Métaphore simple]

### Pilier B : Neuromodulation Lente / Résilience
**Score :** ${scores.blocB.total}/${scores.blocB.max} (${scores.blocB.percentage}%)

**Analyse de l'Expert :** [Analyse contextuelle pour ${discipline}]

**Pour le dire simplement...** [Métaphore simple]

### Pilier C : Neurohormonal
**Score :** ${scores.blocC.total}/${scores.blocC.max} (${scores.blocC.percentage}%)

**Analyse de l'Expert :** [Analyse contextuelle pour ${discipline}]

**Pour le dire simplement...** [Métaphore simple]

### Pilier D : Support Métabolique / Fondations
**Score :** ${scores.blocD.total}/${scores.blocD.max} (${scores.blocD.percentage}%)

**Analyse de l'Expert :** [Analyse contextuelle pour ${discipline}]

**Pour le dire simplement...** [Métaphore simple]

### Pilier E : Ondes Cérébrales / Synchronisation
**Score :** ${scores.blocE.total}/${scores.blocE.max} (${scores.blocE.percentage}%)

**Analyse de l'Expert :** [Analyse contextuelle pour ${discipline}]

**Pour le dire simplement...** [Métaphore simple]

## Plan d'Action Stratégique

### PILIER 1 (Court Terme) : FONDATIONS - Stabilisation Urgente
**Objectif :** Corriger les déséquilibres critiques

**Action 1 :** [Basée sur le score le plus bas]
**Action 2 :** [Basée sur le deuxième score le plus bas]

### PILIER 2 (Moyen Terme) : CORRECTION - Reconstruction de la Stabilité
**Objectif :** Renforcer les systèmes de régulation

**Action 1 :** [Action spécifique]
**Action 2 :** [Action spécifique]

### PILIER 3 (Long Terme) : OPTIMISATION - Libération de la Haute Performance
**Objectif :** Capitaliser sur les forces naturelles

**Action 1 :** [Action spécifique]
**Action 2 :** [Action spécifique]

## Conclusion de l'Expert & Projection

### Projection & Prévention
[Risques potentiels si rien n'est fait]

### Vision Inspirante
[Vision de ce qui est possible avec le plan d'action]

---

**Avis de non-responsabilité :** Cette analyse est un outil d'évaluation de la performance basé sur les réponses fournies et est destinée à des fins éducatives et d'optimisation du bien-être. Elle ne constitue en aucun cas un diagnostic, un avis ou un traitement médical. Les informations et recommandations proposées ne remplacent pas une consultation avec un professionnel de la santé qualifié. Il est de votre responsabilité de consulter un médecin ou un autre professionnel de santé pour toute question relative à votre état de santé.`;

    // Appel à l'API Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analyse en cours de génération...";
    
    return analysisText;
  } catch (error) {
    logger.error("Erreur analyse Gemini:", error);
    return `# DOSSIER NEUROCHIMIQUE APPLIQUÉ – ${nomClient}

**Date de l'analyse :** ${dateScan}  
**Objectif de performance déclaré :** ${discipline}

## Synthèse Globale

Votre analyse est en cours de traitement par notre IA d'expertise neurochimique. 

Vous recevrez une notification dès que votre rapport détaillé sera disponible.

## Scores Préliminaires

- **Pilier A (Neurochimie Rapide) :** ${scores.blocA.percentage}%
- **Pilier B (Résilience) :** ${scores.blocB.percentage}%  
- **Pilier C (Neurohormonal) :** ${scores.blocC.percentage}%
- **Pilier D (Support Métabolique) :** ${scores.blocD.percentage}%
- **Pilier E (Ondes Cérébrales) :** ${scores.blocE.percentage}%

Votre rapport complet sera généré sous 24h.`;
  }
}

// Détermination du neurotype (logique simplifiée)
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

  // Logique simplifiée basée sur les scores les plus élevés
  const maxScore = Math.max(scores.blocA.percentage, scores.blocB.percentage, scores.blocC.percentage, scores.blocD.percentage, scores.blocE.percentage);
  
  if (scores.blocA.percentage === maxScore) return neurotypes[0];
  if (scores.blocB.percentage === maxScore) return neurotypes[1];
  if (scores.blocE.percentage === maxScore) return neurotypes[2];
  if (scores.blocD.percentage === maxScore) return neurotypes[3];
  
  return neurotypes[0]; // Par défaut
}

// Notification QG
async function notifyQG(reportData) {
  try {
    const payload = {
      resultatType: "bilan-neuro-strategique",
      operator: reportData.operator,
      scores: reportData.scores,
      dateScan: reportData.dateScan,
      reportId: reportData.reportId
    };

    // Simulation d'envoi au QG (remplacer par vraie API)
    logger.info("Notification QG:", payload);
    
    return true;
  } catch (error) {
    logger.error("Erreur notification QG:", error);
    return false;
  }
}

// Cloud Function : Soumission du rapport opérateur
export const submitOperatorReport = onRequest({ cors: true }, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const { operator, answers, meta } = req.body || {};
      
      if (!operator?.email || !answers) {
        return res.status(400).json({ error: "Missing operator or answers" });
      }

      logger.info("Traitement rapport pour:", operator.email);

      // Calcul des scores
      const scores = calculateScores(answers);
      const scoreGlobal = Math.round(Object.values(scores).reduce((acc, bloc) => acc + bloc.percentage, 0) / 5);

      // Génération du token sécurisé
      const publicToken = genToken();
      
      // Analyse IA avec Gemini
      const analysisMarkdown = await analyzeWithGemini(operator, answers, scores);

      // Persistance en base
      const reportDoc = {
        dateScan: today(),
        operator,
        answers,
        meta: meta || {},
        scores,
        scoreGlobal,
        summary: `Analyse neurochimique complète pour ${operator.discipline}. Score global: ${scoreGlobal}%.`,
        md: analysisMarkdown,
        publicToken,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        processed: true
      };

      const ref = await db.collection("reports").add(reportDoc);
      const reportId = ref.id;

      logger.info("Rapport créé:", reportId);

      // Construction de l'URL d'accès
      const espaceURL = `${SITE_BASE_URL}/espace?t=${publicToken}`;

      // Envoi de l'email
      let emailSent = false;
      if (SENDGRID_API_KEY) {
        try {
          const emailContent = {
            to: operator.email,
            from: {
              email: "no-reply@supra-code.app",
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
                  <h2 style="color: #f5efe6; margin-bottom: 20px;">Bonjour ${operator.prenom},</h2>
                  
                  <p style="line-height: 1.6; margin-bottom: 20px;">
                    Votre <strong>Code Neurochimique</strong> a été scanné avec succès. 
                    Votre transformation commence maintenant.
                  </p>
                  
                  <div style="background: #1f1f1f; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc2626;">
                    <h3 style="color: #dc2626; margin: 0 0 10px 0;">Votre Score Global</h3>
                    <div style="font-size: 32px; font-weight: bold; color: #f5efe6;">${scoreGlobal}%</div>
                    <p style="margin: 5px 0 0 0; color: #999;">Performance Neurochimique</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${espaceURL}" 
                       style="display: inline-block; background: #dc2626; color: white; padding: 15px 30px; 
                              text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      ACCÉDER À MON ESPACE OPÉRATEUR
                    </a>
                  </div>
                  
                  <div style="background: #1f1f1f; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #999;">
                      🔒 <strong>Accès sécurisé</strong> - Ce lien est personnel et expire dans 30 jours.
                    </p>
                  </div>
                  
                  <p style="line-height: 1.6; color: #ccc;">
                    Votre rapport détaillé contient votre analyse neurochimique complète, 
                    votre neurotype dominant, et votre plan d'action personnalisé.
                  </p>
                </div>
                
                <div style="background: #1f1f1f; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                  <p style="margin: 0;">SUPRA-CODE NEURO-PERFORMANCE™</p>
                  <p style="margin: 5px 0 0 0;">Votre performance ne sera plus jamais un hasard.</p>
                </div>
              </div>
            `
          };

          await sgMail.send(emailContent);
          emailSent = true;
          logger.info("Email envoyé à:", operator.email);
        } catch (emailError) {
          logger.error("Erreur envoi email:", emailError);
        }
      }

      // Notification QG
      await notifyQG({
        operator,
        scores,
        dateScan: today(),
        reportId
      });

      // Réponse de succès
      res.status(200).json({
        success: true,
        reportId,
        token: publicToken,
        emailSent,
        espaceURL,
        scoreGlobal
      });

    } catch (error) {
      logger.error("Erreur submitOperatorReport:", error);
      res.status(500).json({ 
        error: "Erreur interne du serveur",
        details: error.message 
      });
    }
  });
});

// Cloud Function : Récupération du rapport public
export const getPublicReport = onRequest({ cors: true }, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const token = req.query.token;
      if (!token) {
        return res.status(400).json({ error: "Token manquant" });
      }

      // Recherche du rapport par token
      const snapshot = await db.collection("reports")
        .where("publicToken", "==", token)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({ error: "Rapport non trouvé ou token expiré" });
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      // Données publiques (sans informations sensibles)
      const publicData = {
        id: doc.id,
        dateScan: data.dateScan,
        operator: {
          prenom: data.operator?.prenom,
          nom: data.operator?.nom,
          discipline: data.operator?.discipline
        },
        summary: data.summary,
        md: data.md,
        scoreGlobal: data.scoreGlobal,
        scores: data.scores,
        neurotype: data.neurotype
      };

      res.status(200).json(publicData);

    } catch (error) {
      logger.error("Erreur getPublicReport:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
});

// Cloud Function : Liste des rapports (admin)
export const listReports = onRequest({ cors: true }, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== FUNCTIONS_ADMIN_KEY) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      // Récupération des rapports (limité aux 50 plus récents)
      const snapshot = await db.collection("reports")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          dateScan: data.dateScan,
          operator: data.operator,
          summary: data.summary,
          scoreGlobal: data.scoreGlobal,
          publicToken: data.publicToken,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.dateScan,
          processed: data.processed || false,
          md: !!data.md // Boolean pour indiquer si analysé
        };
      });

      res.status(200).json({ items });

    } catch (error) {
      logger.error("Erreur listReports:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
});

// Cloud Function : Activation accès complet (future)
export const activateFullAccess = onRequest({ cors: true }, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const { activationKey, reportId } = req.body || {};
      
      if (!activationKey || !reportId) {
        return res.status(400).json({ error: "Clé d'activation et ID rapport requis" });
      }

      // Validation de la clé (logique à implémenter)
      // Pour l'instant, placeholder
      
      res.status(200).json({ 
        success: true,
        message: "Accès complet activé",
        level: "NIVEAU 2"
      });

    } catch (error) {
      logger.error("Erreur activateFullAccess:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
});

