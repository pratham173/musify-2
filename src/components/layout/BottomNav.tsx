import { NavLink } from 'react-router-dom';
import { HomeIcon, SearchIcon, LibraryIcon, SettingsIcon } from '../icons';
import './BottomNav.css';

const navItems = [
  { path: '/browse', label: 'Browse', icon: HomeIcon },
  { path: '/search', label: 'Search', icon: SearchIcon },
  { path: '/library', label: 'Library', icon: LibraryIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
