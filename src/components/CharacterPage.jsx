import React from 'react';
import { ChevronRight, Moon, Zap, Sparkles } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import wikiData from '../data/wikiData.json';

export default function CharacterPage() {
  const { id, tab } = useParams();
  const navigate = useNavigate();

  const activeTab = tab || 'biography';

  const character = wikiData.characters.find((char) => char.id === id);

  if (!character) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Character Not Found</h2>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
          Return to Directory
        </button>
      </div>
    );
  }

  const getRelationName = (relId) => {
    const found = wikiData.characters.find((c) => c.id === relId);
    return found ? found.name : relId;
  };

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

  const renderListOrString = (val) => {
    if (Array.isArray(val)) {
      return val.map((item, idx) => (
        <div key={idx} style={{ marginBottom: idx < val.length - 1 ? '0.15rem' : 0 }}>
          {item}
        </div>
      ));
    }
    return val ?? '—';
  };

  const isDeceased = character.status?.toLowerCase() === 'deceased';

  return (
    <div className="character-page">
      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.83rem', color: 'var(--ink-faint)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>
          Wiki Directory
        </Link>
        <ChevronRight size={12} />
        <span>Characters</span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--rose)', fontWeight: 600 }}>{character.name}</span>
      </nav>

      {/* Header */}
      <header className="character-header">
        <h1 className="char-main-title">{character.name}</h1>
        <p className="char-subtitle">{character.title}</p>
      </header>

      {/* Body */}
      <div className="character-body-layout">
        {/* ── Right-aligned Infobox ── */}
        <aside className="wiki-infobox">
          <div className="infobox-header">
            <div className="infobox-title">{character.name}</div>
            <div className="infobox-subtitle">{character.title}</div>
          </div>

          <div className="infobox-image-container">
            <img
              src={character.image}
              alt={character.name}
              className="infobox-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300';
              }}
            />
          </div>

          {/* ── Section 1: Biographical Information ── */}
          <div className="infobox-section-title">Biographical Information</div>
          <table className="infobox-table">
            <tbody>
              {character.aliases?.length > 0 && (
                <tr>
                  <th>Aliases</th>
                  <td>{renderListOrString(character.aliases)}</td>
                </tr>
              )}
              <tr>
                <th>Gender</th>
                <td>{character.gender}</td>
              </tr>
              <tr>
                <th>Species</th>
                <td>{character.species}</td>
              </tr>
              <tr>
                <th>Affiliation</th>
                <td>{getAffiliationBadge(character.affiliation)}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td style={{
                  fontWeight: 700,
                  color: isDeceased ? 'var(--ink-faint)' : 'var(--green)',
                }}>
                  {character.status}
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── Section 2: Physical Description ── */}
          <div className="infobox-section-title">Physical Description</div>
          <table className="infobox-table">
            <tbody>
              <tr>
                <th>Hair Colour</th>
                <td>{renderListOrString(character.physicalDescription?.hairColour)}</td>
              </tr>
              <tr>
                <th>Eye Colour</th>
                <td>{renderListOrString(character.physicalDescription?.eyeColour)}</td>
              </tr>
              <tr>
                <th>Height</th>
                <td>{renderListOrString(character.physicalDescription?.height)}</td>
              </tr>
            </tbody>
          </table>
        </aside>

        {/* ── Left: reading content & tabs ── */}
        <section className="character-reading-content">
          <p style={{ fontSize: '1.05rem', lineHeight: '1.75', fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--ink-mid)', marginBottom: '1.5rem' }}>
            "{character.shortDescription}"
          </p>

          <div className="tabs-container">
            <div className="tabs-list">
              {['biography', 'abilities', 'relationships', 'trivia'].map((tabName) => (
                <button
                  key={tabName}
                  className={`tab-trigger ${activeTab === tabName ? 'active' : ''}`}
                  onClick={() => navigate(`/characters/${id}/${tabName}`)}
                >
                  {tabName === 'biography'      && 'Biography'}
                  {tabName === 'abilities'      && 'Abilities'}
                  {tabName === 'relationships'  && 'Relationships'}
                  {tabName === 'trivia'         && 'Trivia'}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'biography' && (
                <div style={{ animation: 'fadeIn 0.25s ease' }}>
                  <h2 style={{ marginTop: 0 }}>Overview</h2>
                  <p className="biography-text">{character.biography}</p>
                </div>
              )}

              {activeTab === 'abilities' && (
                <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {character.abilities?.magic?.length > 0 && (
                    <div>
                      <h3 style={{ borderBottom: '1.5px solid var(--border-mid)', paddingBottom: '0.4rem', marginBottom: '1rem', fontFamily: 'var(--font-headings)', color: 'var(--rose)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Magic</h3>
                      <div className="abilities-grid">
                        {character.abilities.magic.map((ability, idx) => (
                          <div key={idx} className="ability-card">
                            <div className="ability-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <div>
                                <h4 className="ability-name">
                                  {ability.name}
                                  {ability.altName && (
                                    <span style={{ display: 'block', fontStyle: 'italic', fontWeight: 'normal', fontSize: '0.85em', marginTop: '0.15rem', color: 'var(--ink-faint)' }}>
                                      {ability.altName}
                                    </span>
                                  )}
                                </h4>
                                {ability.category && (
                                  <span className="badge" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', marginTop: '0.35rem', display: 'inline-block' }}>
                                    {ability.category}
                                  </span>
                                )}
                              </div>
                              <Zap size={14} style={{ color: 'var(--violet)', flexShrink: 0, marginTop: '2px' }} />
                            </div>
                            <p className="ability-desc" style={{ marginTop: '0.6rem' }}>{ability.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {character.abilities?.divineBlessing?.length > 0 && (
                    <div>
                      <h3 style={{ borderBottom: '1.5px solid var(--border-mid)', paddingBottom: '0.4rem', marginBottom: '1rem', fontFamily: 'var(--font-headings)', color: 'var(--rose)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Divine Blessing</h3>
                      <div className="abilities-grid">
                        {character.abilities.divineBlessing.map((ability, idx) => (
                          <div key={idx} className="ability-card">
                            <div className="ability-header">
                              <h4 className="ability-name">
                                {ability.name}
                                {ability.altName && (
                                  <span style={{ display: 'block', fontStyle: 'italic', fontWeight: 'normal', fontSize: '0.85em', marginTop: '0.15rem', color: 'var(--ink-faint)' }}>
                                    {ability.altName}
                                  </span>
                                )}
                              </h4>
                              <Sparkles size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                            </div>
                            <p className="ability-desc">{ability.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'relationships' && (
                <div className="relationships-grid" style={{ animation: 'fadeIn 0.25s ease' }}>
                  {character.relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="relationship-card"
                      onClick={() => navigate(`/characters/${rel.characterId}/biography`)}
                      title={`Go to ${getRelationName(rel.characterId)}'s page`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="relationship-header">
                        <h4 className="relationship-name">{getRelationName(rel.characterId)}</h4>
                        <span className="badge badge-rose" style={{ fontSize: '0.62rem' }}>{rel.relationType}</span>
                      </div>
                      <p className="relationship-desc">{rel.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'trivia' && (
                <ul className="trivia-list" style={{ animation: 'fadeIn 0.25s ease' }}>
                  {character.trivia.map((triv, idx) => (
                    <li key={idx} className="trivia-item">{triv}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
