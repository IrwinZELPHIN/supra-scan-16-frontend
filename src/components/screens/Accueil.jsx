import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function Accueil() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* Logo centré animé */}
      <img
        src={logo}
        alt="SUPRA-CODE NEURO-PERFORMANCE™"
        className="w-32 sm:w-40 md:w-48 animate-supra mb-8"
      />

      {/* Titre élégant */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-8">
        Bienvenue, Opérateur.
      </h1>

      {/* Texte d'introduction élégant et espacé */}
      <div className="max-w-4xl text-center space-y-6 mb-12">
        <p className="text-lg md:text-xl leading-relaxed opacity-90">
          Vous êtes sur le point d'accéder à votre tableau de bord interne.
        </p>
        <p className="text-lg md:text-xl leading-relaxed opacity-90">
          Le <span className="font-semibold text-red-400">SUPRA-CODE NEURO-PERFORMANCE™</span> n'est pas un test.
        </p>
        <p className="text-lg md:text-xl leading-relaxed opacity-90">
          C'est un miroir qui décode le langage de vos neurones pour révéler votre Code Neurochimique unique.
        </p>
        <p className="text-lg md:text-xl leading-relaxed opacity-90">
          Comprendre ce code, c'est apprendre à piloter votre concentration, votre énergie et votre calme avec la précision d'un pilote d'élite.
        </p>
        <p className="text-xl md:text-2xl font-semibold text-red-300">
          Votre performance ne sera plus jamais un hasard.
        </p>
        <p className="text-lg md:text-xl leading-relaxed opacity-90 mt-8">
          Prêt à initier le protocole ?
        </p>
      </div>

      {/* Trait rouge élégant au-dessus du bouton */}
      <div className="w-24 h-1 bg-red-500 mb-6 rounded-full"></div>

      {/* Bouton CTA élégant */}
      <Link
        to="/identification"
        className="inline-flex items-center justify-center rounded-xl px-8 py-4 font-bold text-lg
                   bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all duration-300
                   shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        INITIER MON SUPRA-CODE
      </Link>
    </main>
  );
}

