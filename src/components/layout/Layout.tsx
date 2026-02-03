import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/browse')) return 'Browse';
  if (pathname.startsWith('/search')) return 'Search';
  if (pathname.startsWith('/library')) return 'Library';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/album')) return 'Album';
  if (pathname.startsWith('/artist')) return 'Artist';
  if (pathname.startsWith('/playlist')) return 'Playlist';
  return 'Musify';
};

export default function Layout({ children, title }: LayoutProps) {
  const location = useLocation();
  const pageTitle = title || getPageTitle(location.pathname);

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Header title={pageTitle} />
        <main className="layout-content">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
