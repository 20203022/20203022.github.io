import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articleApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';

export default function Profile() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', summary: '', content: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadArticles();
  }, [user]);

  const loadArticles = () => {
    setLoading(true);
    articleApi.getMine(0, 50).then(res => {
      setArticles(res.data.content || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ title: '', summary: '', content: '', tags: '' });
    setEditing(null);
    setError('');
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (a) => {
    setForm({ title: a.title, summary: a.summary || '', content: a.content || '', tags: a.tags || '' });
    setEditing(a.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      if (editing) {
        await articleApi.update(editing, { title: form.title, summary: form.summary, content: form.content, tags: form.tags });
      } else {
        await articleApi.create({ title: form.title, summary: form.summary, content: form.content, tags: form.tags });
      }
      setShowForm(false);
      resetForm();
      loadArticles();
    } catch (err) {
      setError(err.response?.data?.error || (lang === 'zh' ? '操作失败' : 'Failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(lang === 'zh' ? '确定删除此文章？' : 'Delete this article?')) return;
    await articleApi.delete(id);
    loadArticles();
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '6rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <ScrollReveal>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {lang === 'zh' ? '个人中心' : 'Profile'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {user.username} {lang === 'zh' ? '，欢迎回来' : ', welcome back'}
        </p>
      </ScrollReveal>

      {/* Create / Edit form */}
      {showForm && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem' }}>
            {editing ? (lang === 'zh' ? '编辑文章' : 'Edit Article') : (lang === 'zh' ? '发布新文章' : 'New Article')}
          </h3>
          {error && <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,0,0,0.1)', borderRadius: 8, marginBottom: '1rem', color: '#f44', fontSize: '0.9rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>{lang === 'zh' ? '标题' : 'Title'} *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder={lang === 'zh' ? '请输入文章标题' : 'Enter article title'}
                style={inputStyle} maxLength={200} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>{lang === 'zh' ? '摘要' : 'Summary'}</label>
              <input value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                placeholder={lang === 'zh' ? '简短描述（可选）' : 'Brief description (optional)'}
                style={inputStyle} maxLength={500} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>{lang === 'zh' ? '正文' : 'Content'} *</label>
              <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder={lang === 'zh' ? '支持 Markdown 格式...' : 'Markdown supported...'}
                rows={12}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>{lang === 'zh' ? '标签' : 'Tags'}</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder={lang === 'zh' ? '用逗号分隔，如：Java, React' : 'Comma separated, e.g. Java, React'}
                style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={submitting} style={{
                padding: '0.6rem 2rem', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 20, cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 600, opacity: submitting ? 0.7 : 1,
              }}>
                {submitting ? (lang === 'zh' ? '提交中...' : 'Saving...') : (lang === 'zh' ? '发布' : 'Publish')}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} style={{
                padding: '0.6rem 1.5rem', background: 'var(--card-bg)', color: 'var(--text)',
                border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer',
              }}>
                {lang === 'zh' ? '取消' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button onClick={openCreate} style={{
          padding: '0.7rem 1.8rem', background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 25, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
          marginBottom: '2rem',
        }}>
          + {lang === 'zh' ? '发布新文章' : 'New Article'}
        </button>
      )}

      {/* My Articles */}
      <h3 style={{ marginBottom: '1rem' }}>{lang === 'zh' ? '我的文章' : 'My Articles'} ({articles.length})</h3>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>{lang === 'zh' ? '加载中...' : 'Loading...'}</p>
      ) : articles.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>{lang === 'zh' ? '还没有发布文章' : 'No articles yet'}</p>
      ) : (
        articles.map(a => (
          <div key={a.id} className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to={`/blog/${a.id}`} style={{ fontWeight: 600, color: 'var(--text)', textDecoration: 'none', fontSize: '1rem' }}>
                  {a.title}
                </Link>
                <span style={{
                  fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 10,
                  background: a.status === 'PUBLISHED' ? 'rgba(0,200,100,0.15)' : 'rgba(255,200,0,0.15)',
                  color: a.status === 'PUBLISHED' ? '#0a8' : '#c90',
                }}>{a.status === 'PUBLISHED' ? (lang === 'zh' ? '已发布' : 'Published') : (lang === 'zh' ? '草稿' : 'Draft')}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {new Date(a.createdAt).toLocaleDateString()} · {a.likeCount} {lang === 'zh' ? '赞' : 'likes'} · {a.commentCount} {lang === 'zh' ? '评论' : 'comments'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
              <button onClick={() => openEdit(a)} style={actionBtn}>{lang === 'zh' ? '编辑' : 'Edit'}</button>
              <button onClick={() => handleDelete(a.id)} style={{ ...actionBtn, color: '#f44' }}>{lang === 'zh' ? '删除' : 'Delete'}</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 1rem',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--card-bg)',
  color: 'var(--text)',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
};

const actionBtn = {
  background: 'none',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '0.3rem 0.75rem',
  cursor: 'pointer',
  color: 'var(--text)',
  fontSize: '0.8rem',
};
