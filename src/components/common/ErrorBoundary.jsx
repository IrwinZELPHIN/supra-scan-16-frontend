import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Optionnel : log vers Sentry / QG
    // console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-4">Petit incident technique</h1>
            <p className="opacity-80 mb-6">
              Une erreur est survenue. L'équipe QG a été notifiée et corrige le tir.
              Vous pouvez rafraîchir la page ou revenir plus tard.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

