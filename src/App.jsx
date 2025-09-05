import { useState } from 'react';
import Accueil from './components/screens/Accueil.jsx';
import Identification from './components/screens/Identification.jsx';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('accueil');
  const [userData, setUserData] = useState(null);

  const handleScreenChange = (screen, data = null) => {
    if (data) {
      setUserData(data);
    }
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'accueil':
        return (
          <Accueil 
            onNext={() => handleScreenChange('identification')} 
          />
        );
      
      case 'identification':
        return (
          <Identification 
            onNext={(data) => handleScreenChange('questionnaire', data)}
            onPrevious={() => handleScreenChange('accueil')}
          />
        );
      
      default:
        return (
          <div className="supra-container">
            <h1 className="supra-title">Écran en développement</h1>
            <p className="supra-text">
              Cet écran sera disponible dans la prochaine phase de développement.
            </p>
            <button 
              className="supra-button"
              onClick={() => handleScreenChange('accueil')}
            >
              Retour à l'accueil
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
      
      {/* Debug info (à supprimer en production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded text-xs">
          Écran actuel: {currentScreen}
          {userData && <div>Utilisateur: {userData.prenom} {userData.nom}</div>}
        </div>
      )}
    </div>
  );
}

export default App;

