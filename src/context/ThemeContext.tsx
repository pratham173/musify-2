import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeMode } from '../types';
import { indexedDBService } from '../services/indexedDB';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    mode: 'dark',
    accentColor: '#007AFF',
  });

  // Load theme from IndexedDB on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await indexedDBService.getSetting('theme');
        if (savedTheme) {
          setTheme(savedTheme);
          document.body.setAttribute('data-theme', savedTheme.mode);
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const mode = prefersDark ? 'dark' : 'light';
          setTheme({ mode, accentColor: '#007AFF' });
          document.body.setAttribute('data-theme', mode);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Save theme to IndexedDB when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await indexedDBService.saveSetting('theme', theme);
        document.body.setAttribute('data-theme', theme.mode);
        
        // Update CSS custom property for accent color
        document.documentElement.style.setProperty('--color-accent', theme.accentColor);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    };

    saveTheme();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  const setAccentColor = (color: string) => {
    setTheme(prev => ({
      ...prev,
      accentColor: color,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
