import React, { useState, useMemo } from 'react';
import { Layers3, Search, Moon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import wikiData from '../data/wikiData.json';
import { publicUrl } from '../utils/publicUrl';

export default function CharacterList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('banner');
  const navigate = useNavigate();
  const groupingOptions = [
    { value: 'banner', label: 'Banner' },
    { value: 'faction', label: 'Faction' },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const filteredCharacters = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return wikiData.characters.filter((char) => {
      return (
        char.name?.toLowerCase().includes(query) ||
        char.faction?.toLowerCase().includes(query) ||
        char.banner?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const groupedCharacters = useMemo(() => {
    const grouped = filteredCharacters.reduce((acc, char) => {
      const rawGroupValue = char[groupBy];
      const key = typeof rawGroupValue === 'string' && rawGroupValue.trim()
        ? rawGroupValue.trim()
        : 'Unknown';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(char);
      return acc;
    }, {});

    const compareGroupNames = (a, b) => {
      if (groupBy === 'faction') {
        if (a === 'Independent' && b !== 'Independent') return 1;
        if (b === 'Independent' && a !== 'Independent') return -1;
      }

      return a.localeCompare(b);
    };

    return Object.keys(grouped)
      .sort(compareGroupNames)
      .map((faction) => ({
        faction,
        characters: grouped[faction].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [filteredCharacters, groupBy]);

  const sectionTitleStyle = groupBy === 'banner'
    ? { textTransform: 'none', letterSpacing: '0.01em' }
    : undefined;

  const getFactionBadge = (faction) => {
    switch (faction) {
      case 'Weatheria':
        return <span className="badge badge-blue badge-faction"><span className="badge-icon"><Moon size={10} /></span>Weatheria</span>;
      case 'Independent':
        return <span className="badge badge-violet badge-faction"><span className="badge-icon"><Sparkles size={10} /></span>Independent</span>;
      default:
        return <span className="badge badge-faction"><span className="badge-icon"><Moon size={10} /></span>{faction}</span>;
    }
  };

  const getFactionHeaderIcon = (faction) => {
    switch (faction) {
      case 'Weatheria':
        return <Moon size={12} />;
      case 'Independent':
        return <Sparkles size={12} />;
      default:
        return <Moon size={12} />;
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Characters</h1>
      </div>

      {/* Search and grouping controls */}
      <div className="character-list-header search-controls-panel">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="group-controls">
          <label className="control-label control-label-icon" htmlFor="group-by-select" aria-label="Group by">
            <span className="visually-hidden">Group by</span>
            <Layers3 size={14} aria-hidden="true" />
          </label>
          <select
            id="group-by-select"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="btn"
            style={{ padding: '0.42rem 1.2rem 0.42rem 0.7rem' }}
          >
            {groupingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Character Grid */}
      {filteredCharacters.length > 0 ? (
        <div className="character-faction-sections">
          {groupedCharacters.map(({ faction, characters }) => (
            <section key={faction} className="character-faction-section">
              <div className="character-faction-header">
                <h2>
                  <span className="character-faction-header-icon" aria-hidden="true">
                    {groupBy === 'banner' ? <Sparkles size={12} /> : getFactionHeaderIcon(faction)}
                  </span>
                  <span style={sectionTitleStyle}>{faction}</span>
                </h2>
              </div>
              <div className="character-grid">
                {characters.map((char) => (
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
                      <span className="card-title">{char.banner}</span>
                      {getFactionBadge(char.faction)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--ink-faint)' }}>No characters match your search.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
            onClick={() => {
              setSearchQuery('');
            }}
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
}
