export default function Dashboard() {
  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-2 opacity-80">Page interne de test (avec Header + petit logo).</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-supra-red">Analyse Neuro</h3>
          <p className="text-supra-beige mt-2">Votre profil neurochimique</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-supra-red">Performance</h3>
          <p className="text-supra-beige mt-2">Métriques de concentration</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-supra-red">Optimisation</h3>
          <p className="text-supra-beige mt-2">Recommandations personnalisées</p>
        </div>
      </div>
    </div>
  );
}

