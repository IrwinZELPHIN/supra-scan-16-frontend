import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ErrorBoundary from '@/components/common/ErrorBoundary'

// ✅ Correction : utiliser App.css pour Tailwind v4
import './App.css'

// Composants
import Layout from '@/components/layout/Layout'
import Accueil from '@/components/screens/Accueil'
import Identification from '@/components/screens/Identification'
import Dashboard from '@/components/screens/Dashboard'
import Questionnaire from '@/components/screens/Questionnaire'
import Transmission from '@/components/screens/Transmission'
import EspaceOperateur from '@/components/screens/EspaceOperateur'
import QG from '@/components/screens/QG'

// Forcer les attributs au niveau <html> côté client
document.documentElement.setAttribute('lang', 'fr')
document.documentElement.setAttribute('translate', 'no')
document.documentElement.classList.add('notranslate')

// Configuration des routes
const router = createBrowserRouter([
  // Route d'accueil SANS Layout (pas de Header)
  { path: "/", element: <Accueil /> },
  
  // Routes AVEC Layout (Header + Outlet)
  {
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/identification", element: <Identification /> },
      { path: "/questionnaire", element: <Questionnaire /> },
      { path: "/transmission", element: <Transmission /> },
      { path: "/espace", element: <EspaceOperateur /> },
      { path: "/qg", element: <QG /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
