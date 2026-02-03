import { NavLink } from 'react-router-dom';
import { HomeIcon, SearchIcon, LibraryIcon, SettingsIcon } from '../icons';
import './Sidebar.css';

const navItems = [
  { path: '/browse', label: 'Browse', icon: HomeIcon },
  { path: '/search', label: 'Search', icon: SearchIcon },
  { path: '/library', label: 'Library', icon: LibraryIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Musify</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
