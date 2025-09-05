import React, { useState } from "react";
import { supraScanService } from "@/services/supraScanService";

export default function QG() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuth = () => {
    if (!adminKey.trim()) {
      setError("Veuillez saisir la clé admin");
      return;
    }

    setLoading(true);
    setError(null);

    supraScanService
      .listReports(adminKey)
      .then((data) => {
        setItems(data.items || []);
        setAuthenticated(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur auth QG:", err);
        setError("Accès refusé. Vérifiez votre clé admin.");
        setAuthenticated(false);
        setLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (report) => {
    if (report.md) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Analysé
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-400">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        En cours
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header QG */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#F5EFE6]">QG — Centre de Contrôle</h1>
                <p className="text-sm text-gray-400">Surveillance des rapports SUPRA-CODE</p>
              </div>
            </div>
            
            {authenticated && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs font-medium text-green-400">AUTHENTIFIÉ</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Authentification */}
        {!authenticated && (
          <section className="max-w-md mx-auto">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-[#F5EFE6] mb-4 text-center">
                Authentification Requise
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Clé d'Accès Admin
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full rounded-lg bg-gray-800 border border-gray-600 px-4 py-3 text-white
                             focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                    placeholder="Saisir la clé admin pour accéder aux rapports"
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleAuth}
                  disabled={loading || !adminKey.trim()}
                  className="w-full rounded-lg px-4 py-3 font-semibold transition-colors
                           bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-400
                           disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Authentification...
                    </span>
                  ) : (
                    "ACCÉDER AU QG"
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Liste des rapports */}
        {authenticated && (
          <section className="space-y-6">
            
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Rapports</p>
                    <p className="text-2xl font-bold text-[#F5EFE6]">{items.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Analysés</p>
                    <p className="text-2xl font-bold text-green-400">
                      {items.filter(r => r.md).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">En Attente</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {items.filter(r => !r.md).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des rapports */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#F5EFE6] flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Rapports Récents
              </h2>
              
              {items.length === 0 ? (
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 text-center">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400">Aucun rapport disponible</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {items
                    .sort((a, b) => new Date(b.createdAt || b.dateScan) - new Date(a.createdAt || a.dateScan))
                    .map((report) => (
                    <div key={report.id} className="bg-gray-900 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#F5EFE6]">
                              {report.operator?.prenom} {report.operator?.nom}
                            </h3>
                            {getStatusBadge(report)}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-400">
                            <p>📧 {report.operator?.email}</p>
                            <p>🎯 {report.operator?.discipline}</p>
                            <p>📅 {formatDate(report.createdAt || report.dateScan)}</p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          {report.scoreGlobal && (
                            <div className="text-2xl font-bold text-red-400">
                              {report.scoreGlobal}%
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            Token: {report.publicToken?.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                      
                      {report.summary && (
                        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {report.summary}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

