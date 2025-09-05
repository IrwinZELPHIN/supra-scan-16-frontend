import React, { useEffect, useState } from 'react';
import { loadPayload, isReady, resetAll } from '@/lib/storage';

export default function Transmission() {
  const [status, setStatus] = useState('loading'); // loading | sending | ok | error
  const [err, setErr] = useState('');

  useEffect(() => {
    const payload = loadPayload();

    if (!isReady() || !payload) {
      setErr('Données manquantes (payload inexistant).');
      setStatus('error');
      return;
    }

    // Garde-fous minimaux
    if (!payload?.profile?.email || !Array.isArray(payload?.answers) || payload.answers.length < 29) {
      setErr('Données incomplètes (profil ou réponses manquants).');
      setStatus('error');
      return;
    }

    // --- ENVOI AU BACKEND / EMAIL / IA ---
    setStatus('sending');
    console.log("DONNÉES ENVOYÉES (New) :", payload);
    fetch('/api/transmit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      setStatus('ok');
      // resetAll(); // ← Optionnel : nettoyer après envoi réussi
    })
    .catch(e => {
      console.error('Transmission error:', e);
      setErr(e.message || 'Erreur réseau / serveur.');
      setStatus('error');
    });
  }, []);

  if (status === 'loading' || status === 'sending') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-600/10 grid place-items-center">
            <div className="h-8 w-8 rounded-full bg-red-600 animate-pulse" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">Transmission...</h1>
          <p className="text-neutral-300">Analyse terminée. Transmission de votre Code Neurochimique au QG en cours…</p>
          <p className="mt-4 text-sm text-neutral-500">
            Vos résultats sont en route vers votre Espace Opérateur personnel.
            Un e-mail contenant votre rapport détaillé vient de vous être
            envoyé. C'est là que votre transformation commence réellement.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'ok') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-600/10 grid place-items-center">
            <div className="h-8 w-8 rounded-full bg-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">NIVEAU 1 ATTEINT : PRISE DE CONSCIENCE</h2>
          <p className="text-neutral-300 mb-4">Votre Code a été scanné avec succès.</p>
          <p className="text-sm text-neutral-500">
            Un e-mail sécurisé vient de vous être envoyé. C'est là que votre transformation commence réellement.
          </p>
        </div>
      </div>
    );
  }

  // error
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-600/10 grid place-items-center">
          <div className="h-8 w-8 rounded-full bg-red-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">TRANSMISSION INTERROMPUE</h2>
        <p className="text-neutral-300 mb-6">{err} Merci de recommencer le scan.</p>
        <button 
          onClick={() => { resetAll(); window.location.href = '/'; }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          ← Revenir à l'accueil
        </button>
      </div>
    </div>
  );
}

