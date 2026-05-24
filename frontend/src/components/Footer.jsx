import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { siteApi } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    siteApi.getStats().then(res => setStats(res.data)).catch(() => {});
    siteApi.recordVisit().catch(() => {});
  }, []);

  const navLabels = {
    home: lang === 'zh' ? '首页' : 'Home',
    about: lang === 'zh' ? '关于' : 'About',
    projects: lang === 'zh' ? '项目' : 'Projects',
    blog: lang === 'zh' ? '博客' : 'Blog',
    contact: lang === 'zh' ? '联系' : 'Contact',
  };

  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      padding: '2rem',
      textAlign: 'center',
      borderTop: '1px solid var(--border)',
      fontSize: '0.85rem',
      color: 'var(--text-secondary)',
      marginTop: '3rem',
    }}>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{navLabels.home}</Link>
        <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{navLabels.about}</Link>
        <Link to="/projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{navLabels.projects}</Link>
        <Link to="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{navLabels.blog}</Link>
        <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{navLabels.contact}</Link>
      </div>
      {stats && (
        <div style={{ marginBottom: '0.75rem' }}>
          <span>{stats.totalPageViews.toLocaleString()} {lang === 'zh' ? '浏览量' : 'views'}</span>
          <span style={{ marginLeft: '1rem' }}>{stats.totalUniqueVisitors.toLocaleString()} {lang === 'zh' ? '访客' : 'visitors'}</span>
        </div>
      )}
      <div>{lang === 'zh' ? ' 2025 开发者杨风. 版权所有。' : ' 2025 Yang Feng. All rights reserved.'}</div>
    </footer>
  );
}
