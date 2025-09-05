# INSTRUCTIONS DE DÉPLOIEMENT RENDER

## 🎯 CONFIGURATION RENDER EXACTE

### **1. Paramètres de Service**
- **Name** : `supra-code-client`
- **Environment** : `Node`
- **Region** : `Frankfurt (EU Central)`
- **Branch** : `main`

### **2. Paramètres de Build**
- **Root Directory** : **LAISSER VIDE** (très important !)
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`

### **3. Variables d'Environnement (OBLIGATOIRES)**

#### Backend - SendGrid
```
SENDGRID_API_KEY = SG.votre_clé_sendgrid
SENDGRID_FROM = votre@email.com
EMAIL_QG = qg@votre-domaine.com
```

#### Backend - Google Gemini AI
```
GEMINI_API_KEY = votre_clé_gemini
```

#### Frontend - Firebase
```
VITE_FIREBASE_API_KEY = votre_clé_firebase
VITE_FIREBASE_AUTH_DOMAIN = votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = votre-projet-id
VITE_FIREBASE_STORAGE_BUCKET = votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789
VITE_FIREBASE_APP_ID = 1:123456789:web:abcdef
```

#### Configuration générale
```
NODE_ENV = production
PORT = 10000
APP_PUBLIC_URL = https://supra-code-client.onrender.com
```

## 🚀 ÉTAPES DE DÉPLOIEMENT

### **ÉTAPE 1 : Préparer le repository GitHub**
1. Remplacer le contenu de votre repository par le contenu du dossier `render-ready`
2. Commit et push :
   ```bash
   git add .
   git commit -m "Fix: Structure pour Render + corrections transmission"
   git push origin main
   ```

### **ÉTAPE 2 : Configurer Render**
1. Aller sur render.com
2. Sélectionner votre service `supra-code-client`
3. Aller dans **Settings**
4. Modifier :
   - **Root Directory** : VIDER le champ (laisser vide)
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`

### **ÉTAPE 3 : Ajouter les variables d'environnement**
1. Aller dans **Environment**
2. Ajouter TOUTES les variables listées ci-dessus
3. Sauvegarder

### **ÉTAPE 4 : Déclencher le déploiement**
1. Aller dans **Deploys**
2. Cliquer sur **Deploy latest commit**
3. Attendre la fin du build (5-10 minutes)

### **ÉTAPE 5 : Vérifier le déploiement**
1. Vérifier que le build se termine sans erreur
2. Vérifier que le serveur démarre
3. Tester l'application sur `supra-code-client.onrender.com`

## 🔍 VÉRIFICATIONS POST-DÉPLOIEMENT

### **Logs à vérifier :**
- Build logs : Pas d'erreur de compilation
- Runtime logs : "Server listening on :10000"
- Pas d'erreur de variables d'environnement manquantes

### **Tests à effectuer :**
1. Page d'accueil charge correctement
2. Formulaire d'identification fonctionne
3. Questionnaire se déroule normalement
4. Transmission envoie les emails (vérifier votre boîte email)

## 🚨 EN CAS DE PROBLÈME

### **Si le build échoue :**
- Vérifier que `package.json` est à la racine
- Vérifier que toutes les dépendances sont installées

### **Si le serveur ne démarre pas :**
- Vérifier les variables d'environnement
- Vérifier les logs d'erreur

### **Si la transmission échoue :**
- Vérifier les clés API SendGrid et Gemini
- Vérifier les logs du serveur

## ✅ RÉSULTAT ATTENDU

Après ces étapes, votre application sera 100% fonctionnelle avec :
- ✅ Déploiement automatique depuis GitHub
- ✅ Transmission des résultats par email
- ✅ Analyse IA avec Gemini
- ✅ Interface utilisateur complète

