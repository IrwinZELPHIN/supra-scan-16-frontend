export function normalizeProfile(raw = {}) {
  const gender =
    raw.gender ?? raw.sexe ?? raw.sex ?? null; // rétrocompat champs
  const email =
    raw.email ?? raw.mail ?? null;             // rétrocompat champs
  const phone =
    raw.phone ?? raw.telephone ?? raw.tel ?? null;

  return {
    ...raw,
    gender: gender || null,
    email: email || null,
    phone: phone || null,
  };
}

export function normalizeAnswers(rawAnswers) {
  // Accepte answers | responses | reponses
  const a = rawAnswers?.answers ?? rawAnswers?.responses ?? rawAnswers?.reponses ?? rawAnswers;
  return Array.isArray(a) ? a : [];
}

