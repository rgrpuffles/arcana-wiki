import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CharacterList from './components/CharacterList';
import CharacterPage from './components/CharacterPage';
import { Menu, X, Compass, ArrowLeft } from 'lucide-react';
import './App.css';

// Detail routes need a "Back" button
const DETAIL_PATHS = ['/characters/'];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isDetailPage = DETAIL_PATHS.some(p => location.pathname.startsWith(p));

  return (
    <div className="app-container">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="mobile-logo" onClick={() => navigate('/characters')}>
          <Compass className="logo-icon" size={18} />
          <span>Arcana Wiki</span>
        </div>
        <div style={{ width: 38 }} />
      </header>

      {/* Sidebar */}
      <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={mobileOpen ? 'mobile-open' : ''}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="main-content">
        {isDetailPage && (
          <div style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
            <button
              className="btn"
              onClick={() => navigate('/characters')}
              style={{ padding: '0.38rem 0.85rem', fontSize: '0.8rem' }}
            >
              <ArrowLeft size={13} /> Back to Directory
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/characters" replace />} />
          <Route path="/characters" element={<CharacterList />} />
          <Route path="/characters/:id" element={<CharacterPage />} />
          <Route path="/characters/:id/:tab" element={<CharacterPage />} />
          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/characters" replace />} />
        </Routes>
      </main>
    </div>
  );
}
