import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const translations = {
  en: { brand: 'WombTo18', register: 'Register', dashboard: 'Dashboard', login: 'Login', logout: 'Logout' },
  hi: { brand: 'वॉम्बटू18', register: 'पंजीकरण', dashboard: 'डैशबोर्ड', login: 'लॉगिन', logout: 'लॉगआउट' },
};

export default function Navbar() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[lang];
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${location.pathname === to ? 'text-primary-700 font-semibold' : 'text-gray-500 hover:text-primary-600'}`}
    >
      {label}
    </Link>
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{t.brand}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('/', 'Home')}
            {user && user.role !== 'admin' && navLink('/dashboard', t.dashboard)}
            {user && user.role === 'admin' && navLink('/admin', 'Admin')}
            {!user && navLink('/register', t.register)}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition"
            >
              {lang === 'en' ? '🌐 हिंदी' : '🌐 EN'}
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">{user.name}</span>
                <button onClick={handleLogout} className="text-sm text-red-500 font-semibold hover:underline">
                  {t.logout}
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition shadow-sm">
                {t.login}
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 pt-2 space-y-2">
          {navLink('/', 'Home')}
          {user && user.role !== 'admin' && navLink('/dashboard', t.dashboard)}
          {user && user.role === 'admin' && navLink('/admin', 'Admin')}
          {!user && navLink('/register', t.register)}
          {user ? (
            <>
              <span className="block text-sm text-gray-600 px-3 py-1">{user.name}</span>
              <button onClick={handleLogout} className="block w-full text-left text-sm text-red-500 font-semibold px-3 py-1">{t.logout}</button>
            </>
          ) : (
            <Link to="/login" className="block btn-primary text-sm text-center">{t.login}</Link>
          )}
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-50">
            {lang === 'en' ? '🌐 हिंदी' : '🌐 English'}
          </button>
        </div>
      )}
    </nav>
  );
}
