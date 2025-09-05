import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supraScanService } from "@/services/supraScanService";

export default function EspaceOperateur() {
  const [params] = useSearchParams();
  const token = params.get("t");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Lien invalide ou expiré.");
      setLoading(false);
      return;
    }

    supraScanService
      .getPublicReport(token)
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement rapport:", err);
        setError("Impossible de charger votre rapport. Le lien est peut-être expiré.");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Spinner de chargement */}
          <div className="mx-auto w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg animate-pulse">Chargement de votre Espace Opérateur...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-xl text-center space-y-6">
          {/* Icône d'erreur */}
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-red-400">Accès Indisponible</h1>
          <p className="text-gray-300">{error}</p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold
                     bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header de l'espace */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F5EFE6]">Espace Opérateur</h1>
              <p className="text-sm text-gray-400">
                Rapport généré le {report?.dateScan || "..."}
              </p>
            </div>
            
            {/* Badge de statut */}
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-red-400">NIVEAU 1 ACTIF</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Carte d'identité opérateur */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#F5EFE6]">
                {report?.operator?.prenom} {report?.operator?.nom}
              </h2>
              <p className="text-gray-300">
                Discipline : <span className="font-medium text-red-400">{report?.operator?.discipline}</span>
              </p>
              {report?.neurotype && (
                <p className="text-gray-300">
                  Neurotype : <span className="font-medium text-blue-400">{report.neurotype}</span>
                </p>
              )}
            </div>
            
            {/* Score global si disponible */}
            {report?.scoreGlobal && (
              <div className="text-right">
                <div className="text-3xl font-bold text-red-400">{report.scoreGlobal}%</div>
                <div className="text-sm text-gray-400">Score Global</div>
              </div>
            )}
          </div>
        </section>

        {/* Synthèse exécutive */}
        <section className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-[#F5EFE6] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Synthèse Exécutive
          </h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              {report?.summary || "Votre rapport détaillé est en cours de génération par notre IA d'analyse neurochimique. Vous recevrez une notification dès qu'il sera disponible."}
            </p>
          </div>
        </section>

        {/* Rapport détaillé Markdown */}
        {report?.md && (
          <section className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-[#F5EFE6] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
              Dossier Neurochimique Complet
            </h2>
            
            <article className="prose prose-invert max-w-none">
              <div 
                className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                style={{ 
                  lineHeight: '1.7',
                  fontSize: '16px'
                }}
              >
                {report.md}
              </div>
            </article>
          </section>
        )}

        {/* Scores détaillés si disponibles */}
        {report?.scores && (
          <section className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-[#F5EFE6] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
              Analyse par Piliers
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(report.scores).map(([pilier, data]) => (
                <div key={pilier} className="bg-gray-800 rounded-xl p-4 border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#F5EFE6]">{pilier}</h3>
                    <span className="text-lg font-bold text-red-400">{data.pourcentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.pourcentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{data.interpretation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions recommandées */}
        <section className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-2xl p-6 border border-red-500/20">
          <h2 className="text-xl font-semibold text-[#F5EFE6] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Prochaines Étapes
          </h2>
          
          <div className="space-y-3">
            <p className="text-gray-300">
              Votre analyse de Niveau 1 est maintenant disponible. Pour débloquer votre potentiel complet :
            </p>
            
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Consultez votre rapport détaillé ci-dessus
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Implémentez les recommandations prioritaires
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Surveillez votre boîte e-mail pour les prochaines étapes
              </li>
            </ul>
          </div>
        </section>

        {/* Footer sécurisé */}
        <footer className="text-center py-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Accès sécurisé • Données chiffrées • SUPRA-CODE NEURO-PERFORMANCE™
          </p>
        </footer>
      </main>
    </div>
  );
}

