/* src/lib/storage.js */
const NS = 'supra:v2';                 // <— versionne le stockage entre builds
export const K = {
  PAYLOAD: `${NS}:payload`,           // paquet complet prêt pour transmission
  READY:   `${NS}:scan_ready`,        // "1" quand prêt
};

export function savePayload(payload) {
  localStorage.setItem(K.PAYLOAD, JSON.stringify(payload));
  localStorage.setItem(K.READY, '1');
}

export function loadPayload() {
  const raw = localStorage.getItem(K.PAYLOAD);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isReady() {
  return localStorage.getItem(K.READY) === '1';
}

export function resetAll() {
  Object.values(K).forEach(k => localStorage.removeItem(k));
}

