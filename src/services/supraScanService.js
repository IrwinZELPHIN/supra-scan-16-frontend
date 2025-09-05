/**
 * Service principal pour SUPRA-CODE NEURO-PERFORMANCE™
 * Gère les interactions avec Firebase et les Cloud Functions
 */

import { db } from './firebase';

class SupraScanService {
  constructor() {
    this.functionsURL = import.meta.env.VITE_FUNCTIONS_URL || 'https://us-central1-supra-scan-app.cloudfunctions.net';
    this.adminKey = import.meta.env.VITE_ADMIN_KEY || 'nWpOn75JdE4qElhGtk6db3eBvjIWUvMo';
  }

  /**
   * Soumet les données de l'opérateur et ses réponses
   * @param {Object} data - { operator, answers, meta }
   * @returns {Promise<Object>} Résultat de la soumission
   */
  async submitOperatorReport(data) {
    try {
      // Validation des données
      if (!data.operator?.email || !data.answers) {
        throw new Error('Données opérateur ou réponses manquantes');
      }

      const response = await fetch(`${this.functionsURL}/submitOperatorReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur soumission rapport:', error);
      throw error;
    }
  }

  /**
   * Récupère un rapport public par token
   * @param {string} token - Token d'accès public
   * @returns {Promise<Object>} Données du rapport
   */
  async getPublicReport(token) {
    try {
      if (!token) {
        throw new Error('Token manquant');
      }

      const response = await fetch(`${this.functionsURL}/getPublicReport?token=${encodeURIComponent(token)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur récupération rapport public:', error);
      throw error;
    }
  }

  /**
   * Récupère la liste des rapports (admin)
   * @param {string} adminKey - Clé admin
   * @returns {Promise<Object>} Liste des rapports
   */
  async listReports(adminKey) {
    try {
      if (!adminKey) {
        throw new Error('Clé admin manquante');
      }

      const response = await fetch(`${this.functionsURL}/listReports`, {
        method: 'GET',
        headers: {
          'X-Admin-Key': adminKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur récupération rapports:', error);
      throw error;
    }
  }

  /**
   * Active l'accès complet (future fonctionnalité)
   * @param {string} activationKey - Clé d'activation
   * @param {string} reportId - ID du rapport
   * @returns {Promise<Object>} Résultat de l'activation
   */
  async activateFullAccess(activationKey, reportId) {
    try {
      const response = await fetch(`${this.functionsURL}/activateFullAccess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activationKey, reportId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur activation accès complet:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde les réponses du questionnaire
   * @param {Object} answers - Réponses du questionnaire
   */
  saveAnswers(answers) {
    try {
      localStorage.setItem('supra_scan_answers', JSON.stringify(answers));
    } catch (error) {
      console.error('Erreur sauvegarde réponses:', error);
    }
  }

  /**
   * Récupère les réponses sauvegardées
   * @returns {Object} Réponses du questionnaire
   */
  loadAnswers() {
    try {
      const saved = localStorage.getItem('supra_scan_answers');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Erreur chargement réponses:', error);
      return {};
    }
  }

  /**
   * Efface les réponses sauvegardées
   */
  clearAnswers() {
    try {
      localStorage.removeItem('supra_scan_answers');
    } catch (error) {
      console.error('Erreur effacement réponses:', error);
    }
  }

  /**
   * Sauvegarde les données de l'opérateur
   * @param {Object} operator - Données de l'opérateur
   */
  saveOperator(operator) {
    try {
      localStorage.setItem('supra_scan_operator', JSON.stringify(operator));
    } catch (error) {
      console.error('Erreur sauvegarde opérateur:', error);
    }
  }

  /**
   * Récupère les données de l'opérateur sauvegardées
   * @returns {Object} Données de l'opérateur
   */
  loadOperator() {
    try {
      const saved = localStorage.getItem('supra_scan_operator');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Erreur chargement opérateur:', error);
      return null;
    }
  }

  /**
   * Efface les données de l'opérateur
   */
  clearOperator() {
    try {
      localStorage.removeItem('supra_scan_operator');
    } catch (error) {
      console.error('Erreur effacement opérateur:', error);
    }
  }
}

export const supraScanService = new SupraScanService();

