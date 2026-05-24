import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectApi } from '../api';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
  const { lang } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    projectApi.getList(page, 9).then(res => {
      const data = res.data;
      setProjects(prev => page === 0 ? data.content : [...prev, ...data.content]);
      setHasMore(!data.last);
      setLoading(false);
    });
  }, [page]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <ScrollReveal>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          {lang === 'zh' ? '我的' : 'My'} <span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '项目' : 'Projects'}</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          {lang === 'zh' ? '我构建和参与的作品' : "Things I've built and contributed to"}
        </p>
      </ScrollReveal>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'zh' ? '加载中...' : 'Loading...'}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {projects.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.08}>
              <Link to={`/projects/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ overflow: 'hidden', height: '100%' }}>
                  <div style={{
                    height: 160,
                    background: p.coverImage ? `url(${p.coverImage}) center/cover` : 'linear-gradient(135deg, var(--accent), #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', color: '#fff',
                  }}>
                    {!p.coverImage && p.title[0]}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem' }}>{p.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                      {p.summary}
                    </p>
                    {p.tags && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {p.tags.split(',').slice(0, 4).map(tag => (
                          <span key={tag} style={tagStyle}>{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>{p.likeCount} {lang === 'zh' ? '赞' : 'likes'}</span>
                      <span>{p.commentCount} {lang === 'zh' ? '评论' : 'comments'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button onClick={() => setPage(p => p + 1)} style={loadMoreBtn}>
            {lang === 'zh' ? '加载更多' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

const tagStyle = {
  padding: '0.2rem 0.6rem',
  background: 'var(--card-bg)',
  borderRadius: 12,
  fontSize: '0.8rem',
  color: 'var(--accent)',
};

const loadMoreBtn = {
  padding: '0.7rem 2rem',
  background: 'var(--card-bg)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 25,
  cursor: 'pointer',
  fontWeight: 500,
};
