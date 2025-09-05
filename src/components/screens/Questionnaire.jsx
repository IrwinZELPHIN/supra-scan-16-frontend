import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supraScanService } from "@/services/supraScanService";
import { questions } from '../../questions.js';
import { savePayload } from '@/lib/storage';
import { normalizeProfile } from '@/lib/normalize';
import { EXPECTED_ANSWERS } from '@/config/constants';

const Questionnaire = () => {
  // Navigation
  const navigate = useNavigate();
  
  // États principaux
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [startTime] = useState(Date.now());

  // Clé de persistance
  const STORAGE_KEY = 'supra_answers_v1';

  // Filtrage sécurisé des questions
  const safeQuestions = useMemo(() => {
    return questions.filter(q => q && q.id && q.texte && q.options && Array.isArray(q.options));
  }, []);

  // Question actuelle avec protection renforcée
  const currentQuestion = safeQuestions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === safeQuestions.length - 1;
  const isLastRealQuestion = currentIndex === safeQuestions.length - 1; // Q28 est la dernière vraie question
  const showFinalPage = currentIndex >= safeQuestions.length; // Page finale après Q28
  
  // Protection contre les questions undefined avec logging détaillé
  if (!currentQuestion && !showFinalPage) {
    console.error('Question undefined à l\'index:', currentIndex);
    console.error('Questions disponibles:', safeQuestions.length);
    console.error('Questions brutes:', questions.length);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur de chargement</h2>
          <p className="text-gray-300 mb-4">Question non trouvée (index: {currentIndex})</p>
          <button 
            onClick={() => setCurrentIndex(0)}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  // Calcul des blocs ordonnés (sans Q0) avec protection
  const orderedBlocks = useMemo(() => {
    const blocs = safeQuestions
      .filter(q => q && q.id !== 'Q0')
      .map(q => q.bloc)
      .filter(bloc => bloc); // Filtrer les blocs undefined
    return Array.from(new Set(blocs));
  }, [safeQuestions]);

  // Détection de fin de bloc avec protection
  const isEndOfBloc = useMemo(() => {
    if (isLast || !currentQuestion || currentQuestion.id === 'Q0' || showFinalPage) return false;
    const nextQuestion = safeQuestions[currentIndex + 1];
    return nextQuestion && nextQuestion.bloc && currentQuestion.bloc !== nextQuestion.bloc;
  }, [currentIndex, currentQuestion, isLast, showFinalPage, safeQuestions]);

  // Progression basée sur les questions sécurisées
  const progress = Math.round(((currentIndex + 1) / safeQuestions.length) * 100);

  // Chargement initial et persistance
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedAnswers = JSON.parse(saved);
        setAnswers(savedAnswers);
        // Note: On commence toujours à Q0, même s'il y a des réponses sauvées
        // L'utilisateur peut naviguer avec Précédent/Suivant s'il le souhaite
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des réponses:', error);
    }
  }, []);

  // Mise à jour de la sélection actuelle
  useEffect(() => {
    if (currentQuestion && currentQuestion.id) {
      setSelectedOption(answers[currentQuestion.id] || '');
    }
  }, [currentIndex, answers, currentQuestion]);

  // Sauvegarde des réponses
  const saveAnswers = (newAnswers) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
      
      // Sauvegarder aussi dans le format attendu par le nouveau système de transmission
      const answersList = Object.keys(newAnswers)
        .filter(key => key !== 'Q0') // Q0 est contexte, pas analysé par l'IA
        .sort((a, b) => {
          const numA = parseInt(a.replace('Q', ''));
          const numB = parseInt(b.replace('Q', ''));
          return numA - numB;
        })
        .map(key => newAnswers[key]);
      
      if (answersList.length > 0) {
        localStorage.setItem('supracode_answers', JSON.stringify({ list: answersList }));
      }
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde:', error);
    }
  };

  // Sélection d'une option avec protection renforcée
  const handleOptionSelect = (option) => {
    if (!currentQuestion || !currentQuestion.id || !option) {
      console.warn('Tentative de sélection d\'option invalide:', { currentQuestion, option });
      return;
    }
    setSelectedOption(option);
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);
    saveAnswers(newAnswers);
  };

  // Navigation suivante
  const handleNext = () => {
    if (!selectedOption && !showFinalPage) return;

    // Sauvegarder IMMÉDIATEMENT la réponse actuelle (sauf si on est sur la page finale)
    if (!showFinalPage && currentQuestion && currentQuestion.id) {
      const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
      setAnswers(newAnswers);
      saveAnswers(newAnswers);
    }

    // Vérifier si c'est la fin d'un bloc (hors Q0)
    if (isEndOfBloc && !showFinalPage && currentQuestion) {
      const currentBloc = currentQuestion.bloc;
      const blocIndex = orderedBlocks.indexOf(currentBloc) + 1;
      
      setTransitionMessage(
        `${currentBloc} — ANALYSÉ ✓\nNIVEAU D'ACCÈS ${blocIndex}/5 VALIDÉ`
      );
      setShowTransition(true);
      
      setTimeout(() => {
        setShowTransition(false);
        setCurrentIndex(prev => prev + 1);
      }, 2500);
    } else if (isLastRealQuestion && !showFinalPage) {
      // Dernière vraie question (Q28) → aller à la page finale
      setCurrentIndex(safeQuestions.length); // Index au-delà des questions = page finale
    } else if (showFinalPage) {
      // Page finale → terminer le questionnaire
      setTransitionMessage("Questionnaire terminé ✓\nAnalyse en cours...");
      setShowTransition(true);
      
      setTimeout(() => {
        // Utiliser toutes les réponses sauvegardées
        const allAnswers = answers;
        
        // Récupérer les données d'identification
        const identity = JSON.parse(localStorage.getItem('supracode_identity') || '{}');
        
        // Créer le tableau des réponses (Q1-Q28 seulement, Q0 = contexte)
        const answerArray = Object.keys(allAnswers)
          .filter(key => key !== 'Q0') // Q0 est contexte, pas analysé par l'IA
          .sort((a, b) => {
            const numA = parseInt(a.replace('Q', ''));
            const numB = parseInt(b.replace('Q', ''));
            return numA - numB;
          })
          .map(key => allAnswers[key]);
        
        // VÉRIFICATION STRICTE : exactement 28 réponses (Q1 à Q28)
        if (answerArray.length !== 28) {
          alert(`Questionnaire incomplet : ${answerArray.length}/28 réponses. Veuillez recommencer.`);
          navigate('/');
          return;
        }
        
        // Normaliser le profil
        const profile = normalizeProfile({
          prenom: identity.firstName || '',
          nom: identity.lastName || '',
          sexe: identity.gender || '',
          birthDate: identity.dob || '',
          email: identity.email || '',
          telephone: identity.phone || ''
        });
        
        // Vérifier qu'il y a au moins un contact
        if (!profile.email && !profile.phone) {
          alert('Veuillez renseigner un e-mail ou un téléphone avant de terminer.');
          navigate('/identification');
          return;
        }
        
        // Créer le payload unifié
        const payload = {
          profile,
          objectif: allAnswers['Q0'] || identity.objective || 'Performance générale', // Q0 comme contexte
          answers: answerArray, // 28 réponses Q1-Q28 pour l'IA
          scores: {}, // À calculer si nécessaire
          timestamp: new Date().toISOString(),
          clientId: (crypto?.randomUUID?.() ?? String(Date.now())),
          appVersion: 'supra:v2'
        };
        
        // Sauvegarder le payload unifié
        savePayload(payload);
        
        // Navigation vers Transmission
        navigate('/transmission');
      }, 2500);
    } else {
      // Navigation normale
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Navigation précédente
  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Réinitialisation (optionnel)
  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir recommencer le questionnaire ?')) {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers({});
      setCurrentIndex(0);
      setSelectedOption('');
    }
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (selectedOption && !showTransition) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption, showTransition]);

  // Si on est sur la page finale (après Q28)
  if (showFinalPage) {
    return (
      <section translate="no" className="notranslate min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Barre de progression complète */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">
                Questionnaire terminé
              </span>
              <span className="text-sm font-medium text-gray-300">
                100%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full transition-all duration-300" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Message de fin */}
          <div className="bg-gray-900 rounded-2xl p-12 border border-gray-700 shadow-2xl">
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Questionnaire Terminé
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Toutes vos réponses ont été enregistrées avec succès.
              <br />
              Prêt pour l'analyse de votre profil neuro-performance ?
            </p>
            
            {/* Bouton Terminer */}
            <button
              onClick={handleNext}
              className="px-12 py-4 rounded-xl font-bold text-xl bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Lancer l'Analyse →
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Overlay de transition
  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="text-center text-white">
          {transitionMessage.split('\n').map((line, index) => (
            <div
              key={index}
              className={`${
                index === 0 
                  ? 'text-4xl md:text-5xl font-bold mb-4' 
                  : 'text-2xl md:text-3xl font-semibold text-red-400'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section translate="no" className="notranslate min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Question {currentIndex + 1} / {safeQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Carte de question */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          {/* Bloc et titre (pas affiché pour Q0) */}
          {currentQuestion && currentQuestion.id !== 'Q0' && (
            <div className="mb-6">
              <div className="text-sm font-medium text-red-400 mb-2">
                {currentQuestion.bloc}
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
                {currentQuestion.titre}
              </h2>
            </div>
          )}

          {/* Question principale */}
          <h1 className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
            {currentQuestion ? currentQuestion.texte : 'Chargement...'}
          </h1>

          {/* Options */}
          <div translate="no" className="notranslate space-y-4 mb-8">
            {currentQuestion && currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.map((option) => {
              // Protection supplémentaire pour chaque option
              if (!option || !option.label || !option.texte) {
                console.warn('Option invalide détectée:', option);
                return null;
              }
              
              return (
                <button
                  key={option.label}
                  onClick={() => handleOptionSelect(option.label)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedOption === option.label
                      ? 'border-red-500 bg-red-500/10 text-white'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-750 text-gray-200'
                  }`}
                  aria-pressed={selectedOption === option.label}
                  role="radio"
                >
                  <div className="flex items-start gap-3">
                    <span
                      translate="no"
                      className="notranslate font-bold text-red-400 mt-1"
                    >
                      {option.label}—
                    </span>
                    <span className="flex-1">
                      {option.texte}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Boutons de navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirst}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isFirst
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800'
              }`}
            >
              ← Précédent
            </button>

            <div className="flex gap-4">
              {/* Bouton reset (optionnel) */}
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl font-semibold bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-all duration-200 text-sm"
                title="Recommencer le questionnaire"
              >
                ⟲ Reset
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 ${
                  selectedOption
                    ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLastRealQuestion ? 'Terminer →' : 'Suivant →'}
              </button>
            </div>
          </div>
        </div>

        {/* Indicateur de sauvegarde */}
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-500">
            ✓ Réponses sauvegardées automatiquement
          </span>
        </div>
      </div>
    </section>
  );
};

export default Questionnaire;

