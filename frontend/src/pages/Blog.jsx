import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleApi } from '../api';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function Blog() {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    setLoading(true);
    const req = search
      ? articleApi.search(search, page, 10)
      : articleApi.getList(page, 10, tag || undefined);
    req.then(res => {
      const data = res.data;
      setArticles(prev => page === 0 ? data.content : [...prev, ...data.content]);
      setHasMore(!data.last);
      setLoading(false);
    });
  }, [page, search, tag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setArticles([]);
    setLoading(true);
    articleApi.search(search, 0, 10).then(res => {
      setArticles(res.data.content);
      setHasMore(!res.data.last);
      setLoading(false);
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <ScrollReveal>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '博客' : 'Blog'}</span>
        </h1>
      </ScrollReveal>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
            style={{
              padding: '0.6rem 1rem', borderRadius: 20, border: '1px solid var(--border)',
              background: 'var(--card-bg)', color: 'var(--text)', width: 220, fontSize: '0.9rem',
            }}
          />
          <button type="submit" style={{
            padding: '0.6rem 1.2rem', borderRadius: 20, border: 'none',
            background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontSize: '0.9rem',
          }}>{lang === 'zh' ? '搜索' : 'Search'}</button>
        </form>
        {['', 'Java', 'React', 'Spring', 'DevOps'].map(t => (
          <button key={t} onClick={() => { setTag(t); setPage(0); setArticles([]); }}
            style={{
              padding: '0.5rem 1rem', borderRadius: 20,
              border: tag === t ? 'none' : '1px solid var(--border)',
              background: tag === t ? 'var(--accent)' : 'var(--card-bg)',
              color: tag === t ? '#fff' : 'var(--text)',
              cursor: 'pointer', fontSize: '0.85rem',
            }}>
            {t || (lang === 'zh' ? '全部' : 'All')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'zh' ? '加载中...' : 'Loading...'}</div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'zh' ? '未找到文章' : 'No articles found'}</div>
      ) : (
        articles.map((a, i) => (
          <ScrollReveal key={a.id} delay={i * 0.08}>
            <Link to={`/blog/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                {a.coverImage && (
                  <img src={a.coverImage} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {a.pinned && <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{lang === 'zh' ? ' 置顶' : ' Pinned'}</span>}
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{a.title}</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{a.summary}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>{a.author?.username}</span>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    <span>{a.viewCount} {lang === 'zh' ? '阅读' : 'views'}</span>
                    <span>{a.likeCount} {lang === 'zh' ? '赞' : 'likes'}</span>
                    <span>{a.commentCount} {lang === 'zh' ? '评论' : 'comments'}</span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))
      )}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => setPage(p => p + 1)} style={{
            padding: '0.7rem 2rem', background: 'var(--card-bg)', color: 'var(--text)',
            border: '1px solid var(--border)', borderRadius: 25, cursor: 'pointer', fontWeight: 500,
          }}>{lang === 'zh' ? '加载更多' : 'Load More'}</button>
        </div>
      )}
    </div>
  );
}
