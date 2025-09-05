import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const Identification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    sexe: '',
    dateNaissance: '',
    email: '',
    telephone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log('handleInputChange:', { name, value });
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('Nouveau formData:', newData);
      return newData;
    });
    
    // Effacer l'erreur si l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    // SEXE DEVIENT OPTIONNEL - plus de validation obligatoire
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise';
    
    // CONTACT FLEXIBLE : email OU téléphone (au moins un)
    const hasEmail = formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const hasPhone = formData.telephone.trim();
    
    if (!hasEmail && !hasPhone) {
      newErrors.contact = 'Renseignez un email ou un téléphone';
    } else {
      if (formData.email.trim() && !hasEmail) {
        newErrors.email = 'Format d\'email invalide';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Données du formulaire avant validation:', formData);
    
    if (!validateForm()) {
      console.log('Validation échouée, erreurs:', errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulation d'envoi et navigation vers le questionnaire
    setTimeout(() => {
      console.log('Données utilisateur validées:', formData);
      
      // Sauvegarder les données utilisateur pour le questionnaire
      try {
        // Adapter les données au format attendu par le nouveau système de transmission
        const identity = {
          firstName: formData.prenom,
          lastName: formData.nom,
          gender: formData.sexe,
          dob: formData.dateNaissance,
          email: formData.email,
          phone: formData.telephone,
          objective: "Performance générale" // Valeur par défaut
        };
        
        console.log('Identity sauvegardée:', identity);
        localStorage.setItem('supracode_identity', JSON.stringify(identity));
        localStorage.setItem('supra_user_data', JSON.stringify(formData)); // Garder pour compatibilité
        
        // Navigation vers le questionnaire
        navigate('/questionnaire');
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde des données utilisateur:', error);
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="supra-container fade-in">
      <div className="text-center max-w-2xl mx-auto">
        {/* Titre */}
        <h1 className="supra-title">
          Identification de l'Opérateur
        </h1>
        
        {/* Texte de réassurance */}
        <p className="supra-text mb-8">
          Vos informations sont confidentielles et essentielles pour calibrer 
          votre analyse et vous transmettre votre rapport personnel.
        </p>
        
        {/* Formulaire */}
        <form className="supra-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prénom */}
            <div>
              <label className="supra-label">Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className={`supra-input ${errors.prenom ? 'border-red-500' : ''}`}
                placeholder="Votre prénom"
              />
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
            </div>
            
            {/* Nom */}
            <div>
              <label className="supra-label">Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className={`supra-input ${errors.nom ? 'border-red-500' : ''}`}
                placeholder="Votre nom"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sexe - OPTIONNEL */}
            <div>
              <label className="supra-label">Sexe (optionnel)</label>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleInputChange}
                className="supra-input"
              >
                <option value="">Sélectionner</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            
            {/* Date de naissance */}
            <div>
              <label className="supra-label">Date de Naissance *</label>
              <input
                type="text"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                placeholder="JJ/MM/AAAA (ex: 15/03/1990)"
                pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                className={`supra-input ${errors.dateNaissance ? 'border-red-500' : ''}`}
                title="Saisissez votre date de naissance au format JJ/MM/AAAA"
              />
              {errors.dateNaissance && <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>}
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label className="supra-label">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`supra-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="votre.email@exemple.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          {/* Téléphone */}
          <div>
            <label className="supra-label">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              className={`supra-input ${errors.telephone ? 'border-red-500' : ''}`}
              placeholder="+33 1 23 45 67 89"
            />
            {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
          </div>
          
          {/* Erreur contact globale */}
          {errors.contact && (
            <div className="text-center">
              <p className="text-red-500 text-sm">{errors.contact}</p>
            </div>
          )}
          
          {/* Trait rouge élégant au-dessus du bouton */}
          <div className="flex justify-center mt-8 mb-6">
            <div className="w-24 h-1 bg-red-500 rounded-full"></div>
          </div>
          
          {/* Bouton principal */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'VALIDATION...' : 'VALIDER & COMMENCER L\'ANALYSE'}
          </button>
        </form>
        
        {/* Élément décoratif */}
        <div className="mt-8 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Identification;

