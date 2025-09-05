import { Outlet, Link } from "react-router-dom";
import logo from "@/assets/logo.png"; // ✅ alias @

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="w-full flex items-center justify-start p-4">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity duration-300">
          <img 
            src={logo} 
            alt="SUPRA-CODE NEURO-PERFORMANCE™" 
            className="h-10 w-10 object-contain" 
          />
        </Link>
      </header>
      <main className="px-4">
        <Outlet />
      </main>
    </div>
  );
}

