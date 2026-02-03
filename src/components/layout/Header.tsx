import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '../icons';
import './Header.css';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Browse' }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <h2 className="header-title">{title}</h2>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme.mode === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </button>
    </header>
  );
}
