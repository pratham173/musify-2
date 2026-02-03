import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

const ACCENT_COLORS = [
  { id: 'blue', color: '#007AFF', name: 'Blue' },
  { id: 'purple', color: '#AF52DE', name: 'Purple' },
  { id: 'pink', color: '#FF2D55', name: 'Pink' },
  { id: 'orange', color: '#FF9500', name: 'Orange' },
  { id: 'green', color: '#34C759', name: 'Green' },
];

const Settings: React.FC = () => {
  const { theme, toggleTheme, setAccentColor } = useTheme();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="settings">
      {/* Appearance Section */}
      <section className="settings-section">
        <h3 className="settings-section-title">Appearance</h3>
        
        <div className="settings-item">
          <div className="settings-item-info">
            <span className="settings-item-label">Dark Mode</span>
            <span className="settings-item-description">
              Switch between light and dark themes
            </span>
          </div>
          <button
            className={`settings-toggle ${theme.mode === 'dark' ? 'active' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <span className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-item-info">
            <span className="settings-item-label">Accent Color</span>
            <span className="settings-item-description">
              Choose your preferred accent color
            </span>
          </div>
          <div className="settings-colors">
            {ACCENT_COLORS.map((accent) => (
              <button
                key={accent.id}
                className={`settings-color-btn ${theme.accentColor === accent.color ? 'active' : ''}`}
                style={{ backgroundColor: accent.color }}
                onClick={() => setAccentColor(accent.color)}
                aria-label={accent.name}
                title={accent.name}
              >
                {theme.accentColor === accent.color && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Section */}
      <section className="settings-section">
        <h3 className="settings-section-title">Storage</h3>
        
        <div className="settings-item">
          <div className="settings-item-info">
            <span className="settings-item-label">Clear Cache</span>
            <span className="settings-item-description">
              Clear cached data to free up space
            </span>
          </div>
          <button
            className="settings-action-btn"
            onClick={() => {
              if (window.confirm('Clear all cached data? This won\'t affect your library.')) {
                // Clear cache logic
                window.location.reload();
              }
            }}
          >
            Clear
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-item-info">
            <span className="settings-item-label">Clear All Data</span>
            <span className="settings-item-description">
              Delete all local data including playlists and downloads
            </span>
          </div>
          <button
            className="settings-action-btn settings-action-danger"
            onClick={() => {
              if (window.confirm('Delete all local data? This action cannot be undone.')) {
                indexedDB.deleteDatabase('musicflow-db');
                window.location.reload();
              }
            }}
          >
            Delete
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="settings-section">
        <h3 className="settings-section-title">About</h3>
        
        <div
          className="settings-item settings-item-clickable"
          onClick={() => setShowAbout(true)}
        >
          <div className="settings-item-info">
            <span className="settings-item-label">About Musify</span>
            <span className="settings-item-description">
              Version 1.2.0
            </span>
          </div>
          <span className="settings-item-arrow">›</span>
        </div>
      </section>

      {/* About Modal */}
      {showAbout && (
        <div className="settings-modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h3>Musify</h3>
              <button
                className="settings-modal-close"
                onClick={() => setShowAbout(false)}
              >
                ✕
              </button>
            </div>
            <div className="settings-modal-content">
              <div className="settings-about-logo">🎵</div>
              <p className="settings-about-version">Version 1.2.0</p>
              <p className="settings-about-description">
                A modern music streaming app with support for online streaming,
                local uploads, and offline downloads.
              </p>
              <div className="settings-about-features">
                <h4>Features:</h4>
                <ul>
                  <li>🎧 Stream music from Jamendo</li>
                  <li>📁 Upload your own music</li>
                  <li>📥 Download for offline listening</li>
                  <li>📋 Create and manage playlists</li>
                  <li>🌙 Dark and light themes</li>
                </ul>
              </div>
              <p className="settings-about-credits">
                Powered by Jamendo API
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
