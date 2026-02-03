import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import { LibraryProvider } from './context/LibraryContext';
import Layout from './components/layout/Layout';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Library from './pages/Library';
import Settings from './pages/Settings';
import AlbumDetail from './pages/AlbumDetail';
import ArtistDetail from './pages/ArtistDetail';
import PlaylistDetail from './pages/PlaylistDetail';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <LibraryProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/browse" replace />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/album/:id" element={<AlbumDetail />} />
                <Route path="/artist/:id" element={<ArtistDetail />} />
                <Route path="/playlist/:id" element={<PlaylistDetail />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </LibraryProvider>
      </PlayerProvider>
    </ThemeProvider>
  );
};

export default App;
