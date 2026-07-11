import React, { useState, useMemo } from 'react';
import { Search, Filter, Moon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import wikiData from '../data/wikiData.json';
import { publicUrl } from '../utils/publicUrl';

export default function CharacterList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaction, setSelectedFaction] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const navigate = useNavigate();

  // Unique affiliations
  const factions = useMemo(() => {
    const list = new Set(wikiData.characters.map((c) => c.affiliation));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter & sort
  const filteredAndSortedCharacters = useMemo(() => {
    let result = wikiData.characters.filter((char) => {
      const matchesSearch =
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.species.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaction =
        selectedFaction === 'All' || char.affiliation === selectedFaction;
      return matchesSearch && matchesFaction;
    });

    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'age-asc') return (parseInt(a.age) || 9999) - (parseInt(b.age) || 9999);
      if (sortBy === 'age-desc') return (parseInt(b.age) || 0) - (parseInt(a.age) || 0);
      return 0;
    });

    return result;
  }, [searchQuery, selectedFaction, sortBy]);

  const getAffiliationBadge = (affiliation) => {
    switch (affiliation) {
      case 'Weatheria':
        return <span className="badge badge-green"><Moon size={10} style={{ marginRight: 4 }} />Weatheria</span>;
      case 'Independent':
        return <span className="badge badge-violet"><Sparkles size={10} style={{ marginRight: 4 }} />Independent</span>;
      default:
        return <span className="badge"><Moon size={10} style={{ marginRight: 4 }} />{affiliation}</span>;
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Characters</h1>
      </div>

      {/* Filter controls */}
      <div className="character-list-header glass-panel">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by name, species…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} style={{ color: 'var(--ink-ghost)' }} />
            <select
              value={selectedFaction}
              onChange={(e) => setSelectedFaction(e.target.value)}
              className="btn"
              style={{ padding: '0.42rem 1.2rem 0.42rem 0.7rem' }}
            >
              {factions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="btn"
            style={{ padding: '0.42rem 1.2rem 0.42rem 0.7rem' }}
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="age-asc">Age (Youngest first)</option>
            <option value="age-desc">Age (Oldest first)</option>
          </select>
        </div>
      </div>

      {/* Character Grid */}
      {filteredAndSortedCharacters.length > 0 ? (
        <div className="character-grid">
          {filteredAndSortedCharacters.map((char) => (
            <div
              key={char.id}
              className="character-card"
              onClick={() => navigate(`/characters/${char.id}`)}
            >
              <div className="card-img-container">
                <img
                  src={publicUrl(char.image)}
                  alt={char.name}
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300';
                  }}
                />
              </div>
              <div className="card-content">
                <h3 className="card-name">{char.name}</h3>
                <span className="card-title">{char.title}</span>
                <p className="card-desc">{char.shortDescription}</p>
                <div className="card-footer">
                  {getAffiliationBadge(char.affiliation)}
                  <span>Age: {char.age.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--ink-faint)' }}>No characters match your search filters.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
            onClick={() => {
              setSearchQuery('');
              setSelectedFaction('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
