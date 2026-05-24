import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { articleApi, commentApi, likeApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articleApi.getById(id).then(res => {
      setArticle(res.data);
      setLoading(false);
    });
    loadComments();
  }, [id]);

  const loadComments = () => {
    commentApi.getByTarget('ARTICLE', id, 0).then(res => setComments(res.data.content || []));
  };

  const handleLike = async () => {
    if (!user) return alert(lang === 'zh' ? '请登录后点赞' : 'Please login to like');
    const res = await likeApi.toggle('ARTICLE', article.id);
    setArticle(p => ({ ...p, likedByCurrentUser: res.data.liked, likeCount: res.data.likeCount }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert(lang === 'zh' ? '请登录后评论' : 'Please login to comment');
    if (!commentText.trim()) return;
    await commentApi.create({ content: commentText, targetType: 'ARTICLE', targetId: Number(id) });
    setCommentText('');
    loadComments();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>{lang === 'zh' ? '加载中...' : 'Loading...'}</div>;
  if (!article) return <div style={{ textAlign: 'center', padding: '10rem' }}>{lang === 'zh' ? '未找到文章' : 'Article not found'}</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <Link to="/blog" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
        {lang === 'zh' ? '← 返回博客' : '← Back to Blog'}
      </Link>

      {article.coverImage && (
        <img src={article.coverImage} alt={article.title}
          style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12, marginTop: '1.5rem' }} />
      )}

      <h1 style={{ fontSize: '2.2rem', marginTop: '1.5rem' }}>{article.title}</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{lang === 'zh' ? '作者' : 'By'} {article.author?.username}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{new Date(article.createdAt).toLocaleDateString()}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{article.viewCount} {lang === 'zh' ? '阅读' : 'views'}</span>
        <button onClick={handleLike} style={{
          background: article.likedByCurrentUser ? 'var(--accent)' : 'transparent',
          color: article.likedByCurrentUser ? '#fff' : 'var(--accent)',
          border: '1px solid var(--accent)', borderRadius: 20, padding: '0.3rem 1rem', cursor: 'pointer', fontWeight: 500,
        }}>
          {article.likedByCurrentUser ? '♥' : '♡'} {article.likeCount}
        </button>
      </div>

      {article.tags && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
          {article.tags.split(',').map(t => (
            <span key={t} style={{ padding: '0.25rem 0.75rem', background: 'var(--card-bg)', borderRadius: 15, fontSize: '0.85rem' }}>{t.trim()}</span>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: '2rem', margin: '2rem 0' }}>
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
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Comments */}
      <div style={{ marginTop: '3rem' }}>
        <h3>{lang === 'zh' ? '评论' : 'Comments'} ({article.commentCount})</h3>
        {user ? (
          <form onSubmit={handleComment} style={{ margin: '1.5rem 0' }}>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder={lang === 'zh' ? '写评论...' : 'Write a comment...'}
              rows={3}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--card-bg)',
                color: 'var(--text)', resize: 'vertical', fontSize: '0.95rem',
              }}
            />
            <button type="submit" style={{
              marginTop: '0.5rem', padding: '0.5rem 1.5rem',
              background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 20, cursor: 'pointer', fontWeight: 500,
            }}>{lang === 'zh' ? '提交' : 'Submit'}</button>
          </form>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>
            <Link to="/login" style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '登录' : 'Login'}</Link>{lang === 'zh' ? '后发表评论' : ' to leave a comment.'}
          </p>
        )}

        {comments.map(c => (
          <div key={c.id} style={{
            padding: '1rem', marginBottom: '0.75rem', background: 'var(--card-bg)',
            borderRadius: 8, border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>{c.user?.username}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
