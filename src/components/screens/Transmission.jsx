import { useEffect, useState } from 'react';
import { loadPayload, isReady, resetAll } from '@/lib/storage';
import { normalizeProfile, normalizeAnswers } from '@/lib/normalize';
import { EXPECTED_ANSWERS } from '@/config/constants';

export default function Transmission() {
  const [status, setStatus] = useState('loading');
  const [err, setErr] = useState('');

  useEffect(() => {
    const raw = loadPayload();
    if (!isReady() || !raw) {
      setErr('Données manquantes (payload inexistant).');
      setStatus('error');
      return;
    }

    const profile = normalizeProfile(raw.profile);
    const answers = normalizeAnswers(raw.answers);

    const hasContact = !!(profile.email || profile.phone);
    const hasAnswers = Array.isArray(answers) && answers.length >= EXPECTED_ANSWERS;

    if (!hasContact || !hasAnswers) {
      const reasons = [
        !hasContact ? 'contact (email ou téléphone) manquant' : null,
        !hasAnswers ? `réponses ${answers.length}/${EXPECTED_ANSWERS}` : null
      ].filter(Boolean).join(' + ');
      setErr(`Données incomplètes (${reasons}).`);
      setStatus('error');
      return;
    }

    setStatus('sending');
    
    // Utiliser l'URL du backend depuis les variables d'environnement
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://supra-scan-16-backend.onrender.com';
    
    // Créer le payload final
    const payload = { ...raw, profile, answers };
    
    // Log clair du payload avant l'envoi
    console.log('Payload envoyé à /api/transmit :', payload);
    
    fetch(`${apiUrl}/api/transmit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(async (r) => {
      if (!r.ok) {
        let detail = '';
        try { 
          detail = await r.text(); 
        } catch {}
        throw new Error(`HTTP ${r.status} — ${detail}`);
      }
      return r.text();
    })
    .then(() => {
      setStatus('ok');
      // resetAll(); // Optionnel après succès
    })
    .catch(e => {
      console.error('Transmission error ->', e);
      setErr(e.message || 'Erreur réseau / serveur.');
      setStatus('error');
    });
  }, []);

  if (status === 'loading' || status === 'sending') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-4">Questionnaire terminé ✓</h2>
          <p className="text-lg">Analyse en cours...</p>
        </div>
      </div>
    );
  }

  if (status === 'ok') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-2xl px-6">
          <h2 className="text-3xl font-bold mb-6 text-green-400">NIVEAU 1 ATTEINT : PRISE DE CONSCIENCE</h2>
          <p className="text-lg mb-4">Votre Code a été scanné avec succès.</p>
          <p className="text-lg">Un e-mail sécurisé vient de vous être envoyé. C'est là que votre transformation commence réellement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-2xl px-6">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠</span>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-red-400">TRANSMISSION INTERROMPUE</h2>
        <p className="text-lg mb-6">{err} Merci de recommencer le scan.</p>
        <button 
          onClick={() => { resetAll(); location.href = '/'; }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          ← Revenir à l'accueil
        </button>
        <pre className="text-xs opacity-60 mt-6 text-left bg-gray-900 p-4 rounded">
          {JSON.stringify({
            ready: isReady(),
            payloadExists: !!loadPayload()
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

