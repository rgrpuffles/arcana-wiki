import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Search,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import wikiData from '../data/wikiData.json';

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const matchedCharacters = wikiData.characters
      .filter(
        (char) =>
          char.name.toLowerCase().includes(query.toLowerCase()) ||
          char.affiliation.toLowerCase().includes(query.toLowerCase()) ||
          char.species.toLowerCase().includes(query.toLowerCase()),
      )
      .map((char) => ({ ...char, type: 'character' }));

    setSearchResults(matchedCharacters);
  };

  const handleSearchResultClick = (item) => {
    navigate(`/characters/${item.id}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  // Helper: is the given path the current active route?
  const isActive = (path) => location.pathname === path;
  const isCharActive = (id) => location.pathname.startsWith(`/characters/${id}`);
  const isCharactersActive = location.pathname.startsWith('/characters');

  return (
    <aside className="sidebar">
      {/* Header / Logo */}
      <div className="sidebar-header">
        <Link to="/characters" className="logo-container">
          <Compass className="logo-icon" size={22} />
          <span className="logo-text">Arcana Wiki</span>
        </Link>
      </div>

      {/* Search */}
      <div className="sidebar-controls">
        <div className="search-container" ref={searchRef}>
          <div className="search-bar">
            <Search className="search-icon" size={15} />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
            />
          </div>

          {isSearchFocused && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="search-result-item"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <div className="result-name">{result.name}</div>
                  <div className="result-meta">
                    Character · {result.affiliation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {/* Characters */}
          <li className="nav-section">
            <Link
              to="/characters"
              className="section-title"
              style={{
                textDecoration: 'none',
                display: 'block',
                cursor: 'pointer',
                color: isCharactersActive ? 'var(--rose)' : 'var(--ink-ghost)',
                transition: 'color var(--speed)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--rose)'}
              onMouseLeave={(e) => e.target.style.color = isCharactersActive ? 'var(--rose)' : 'var(--ink-ghost)'}
            >
              Characters
            </Link>
            <ul className="sub-nav-list">
              {wikiData.characters.map((char) => {
                const statusColor =
                  char.status === 'Alive'    ? 'var(--green)' :
                  char.status === 'Deceased' ? 'var(--ink-ghost)' :
                                               'var(--rose)';
                const active = isCharActive(char.id);
                return (
                  <li key={char.id}>
                    <button
                      className={`sub-nav-item ${active ? 'active' : ''}`}
                      onClick={() => navigate(`/characters/${char.id}`)}
                      style={active ? { color: statusColor } : undefined}
                    >
                      <span
                        className="status-dot"
                        style={{
                          backgroundColor: statusColor,
                          boxShadow: `0 0 5px ${statusColor}`,
                        }}
                      />
                      <span className="sub-nav-label">{char.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>


        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-content">
          <Sparkles size={13} className="accent-gold-text" />
          <span>Fanon Codex v1.0</span>
        </div>
      </div>
    </aside>
  );
}
