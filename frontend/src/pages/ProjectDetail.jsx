import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectApi, commentApi, likeApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi.getById(id).then(res => {
      setProject(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert(lang === 'zh' ? '请登录后点赞' : 'Please login to like');
    const res = await likeApi.toggle('PROJECT', project.id);
    setProject(p => ({ ...p, likedByCurrentUser: res.data.liked, likeCount: res.data.likeCount }));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>{lang === 'zh' ? '加载中...' : 'Loading...'}</div>;
  if (!project) return <div style={{ textAlign: 'center', padding: '10rem' }}>{lang === 'zh' ? '未找到项目' : 'Project not found'}</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <Link to="/projects" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
        {lang === 'zh' ? '← 返回项目列表' : '← Back to Projects'}
      </Link>

      {project.coverImage && (
        <img src={project.coverImage} alt={project.title}
          style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12, marginTop: '1.5rem' }} />
      )}

      <h1 style={{ fontSize: '2.2rem', marginTop: '1.5rem' }}>{project.title}</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{lang === 'zh' ? '作者' : 'By'} {project.author?.username}</span>
        <button onClick={handleLike} style={{
          background: project.likedByCurrentUser ? 'var(--accent)' : 'transparent',
          color: project.likedByCurrentUser ? '#fff' : 'var(--accent)',
          border: '1px solid var(--accent)',
          borderRadius: 20,
          padding: '0.3rem 1rem',
          cursor: 'pointer',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          {project.likedByCurrentUser ? '♥' : '♡'} {project.likeCount}
        </button>
      </div>

      {project.tags && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
          {project.tags.split(',').map(t => (
            <span key={t} style={{ padding: '0.25rem 0.75rem', background: 'var(--card-bg)', borderRadius: 15, fontSize: '0.85rem' }}>{t.trim()}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0' }}>
        {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '在线演示' : 'Live Demo'}</a>}
        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>GitHub</a>}
      </div>

      <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>{children}</code>
              );
            },
          }}
        >
          {project.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
