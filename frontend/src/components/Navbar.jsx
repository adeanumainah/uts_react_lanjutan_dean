import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20' 
        : 'bg-gradient-to-r from-amber-900/90 via-stone-800/90 to-emerald-900/90'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/home" className="flex items-center space-x-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
              scrolled ? 'bg-gradient-to-br from-amber-600 to-stone-600' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className={`font-bold text-lg transition-colors duration-300 ${
              scrolled ? 'text-stone-800' : 'text-white'
            }`}>
              EduManage
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/home"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group ${
                isActive('/home')
                  ? scrolled 
                    ? 'text-amber-700 bg-amber-50' 
                    : 'text-white bg-white/20'
                  : scrolled 
                    ? 'text-stone-600 hover:text-amber-700 hover:bg-amber-50' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Beranda</span>
              {isActive('/home') && (
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                  scrolled ? 'bg-amber-600' : 'bg-white'
                }`}></span>
              )}
            </Link>

            <Link
              to="/mahasiswa"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group ${
                isActive('/mahasiswa')
                  ? scrolled 
                    ? 'text-amber-700 bg-amber-50' 
                    : 'text-white bg-white/20'
                  : scrolled 
                    ? 'text-stone-600 hover:text-amber-700 hover:bg-amber-50' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Data Mahasiswa</span>
              {isActive('/mahasiswa') && (
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                  scrolled ? 'bg-amber-600' : 'bg-white'
                }`}></span>
              )}
            </Link>

            {/* Divider */}
            <div className={`h-6 w-px mx-2 ${
              scrolled ? 'bg-stone-200' : 'bg-white/20'
            }`}></div>

            {/* User Menu and Logout */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                scrolled ? 'bg-stone-100' : 'bg-white/10'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  scrolled ? 'bg-amber-600' : 'bg-white/20'
                }`}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span className={`text-sm font-medium ${
                  scrolled ? 'text-stone-700' : 'text-white'
                }`}>
                  Admin
                </span>
              </div>

              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-all duration-200 group relative ${
                  scrolled 
                    ? 'hover:bg-red-50 text-stone-600 hover:text-red-600' 
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-stone-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Keluar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;