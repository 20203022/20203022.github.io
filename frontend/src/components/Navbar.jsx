import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const t = (key) => {
    const nav = {
      home: lang === 'zh' ? '首页' : 'Home',
      about: lang === 'zh' ? '关于' : 'About',
      projects: lang === 'zh' ? '项目' : 'Projects',
      timeline: lang === 'zh' ? '经历' : 'Timeline',
      blog: lang === 'zh' ? '博客' : 'Blog',
      contact: lang === 'zh' ? '联系' : 'Contact',
    };
    return nav[key] || key;
  };

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/about', label: t('about') },
    { path: '/projects', label: t('projects') },
    { path: '/timeline', label: t('timeline') },
    { path: '/blog', label: t('blog') },
    { path: '/contact', label: t('contact') },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '0.6rem 2rem' : '1rem 2rem',
        background: scrolled
          ? theme === 'dark' ? 'rgba(10,10,20,0.9)' : 'rgba(255,255,255,0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: scrolled ? '1px solid ' + (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)') : 'none',
      }}
    >
      <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 700, textDecoration: 'none', color: 'var(--text)' }}>
        {'<Dev />'}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: 'none',
              color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: location.pathname === item.path ? 600 : 400,
              fontSize: '0.95rem',
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            {item.label}
            {location.pathname === item.path && (
              <span style={{
                position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
              }} />
            )}
          </Link>
        ))}

        <button onClick={toggleLang} style={{
          ...iconBtnStyle, fontSize: '0.8rem', fontWeight: 600,
          fontFamily: 'inherit', minWidth: 28,
        }} title={lang === 'en' ? '切换到中文' : 'Switch to English'}>
          {lang === 'en' ? '中' : 'EN'}
        </button>

        <button onClick={toggleTheme} style={iconBtnStyle}>
          {theme === 'dark' ? '☀' : '☽'}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user.role === 'ADMIN' && (
              <Link to="/admin" style={{ ...iconBtnStyle, textDecoration: 'none', fontSize: '0.85rem' }}>
                {lang === 'zh' ? '管理' : 'Admin'}
              </Link>
            )}
            <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 500, fontSize: '0.9rem' }}>
              {user.username}
            </Link>
            <button onClick={logout} style={{ ...iconBtnStyle, fontSize: '0.85rem' }}>
              {lang === 'zh' ? '退出' : 'Logout'}
            </button>
          </div>
        ) : (
          <Link to="/login" style={{
            padding: '0.4rem 1.2rem',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 20,
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}>
            {lang === 'zh' ? '登录' : 'Login'}
          </Link>
        )}
      </div>
    </nav>
  );
}

const iconBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.1rem',
  color: 'var(--text)',
  padding: '0.25rem',
};
