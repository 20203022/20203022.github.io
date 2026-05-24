import { useState, useEffect } from 'react';
import { adminApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/'); return; }
    loadTab();
  }, [tab, user]);

  const loadTab = () => {
    setLoading(true);
    const loader = tab === 'users' ? adminApi.getUsers()
      : tab === 'articles' ? adminApi.getArticles()
      : tab === 'projects' ? adminApi.getProjects()
      : null;

    if (loader) {
      loader.then(res => {
        if (tab === 'users') setUsers(res.data.content || []);
        if (tab === 'articles') setArticles(res.data.content || []);
        if (tab === 'projects') setProjects(res.data.content || []);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

  const toggleUser = async (id) => { await adminApi.toggleUser(id); loadTab(); };
  const deleteUser = async (id) => { if (confirm(lang === 'zh' ? '确定删除此用户？' : 'Delete this user?')) { await adminApi.deleteUser(id); loadTab(); } };

  const tabLabels = {
    users: lang === 'zh' ? '用户' : 'users',
    articles: lang === 'zh' ? '文章' : 'articles',
    projects: lang === 'zh' ? '项目' : 'projects',
    config: lang === 'zh' ? '配置' : 'config',
  };

  const headers = lang === 'zh'
    ? { users: ['ID','用户名','邮箱','角色','状态','操作'], articles: ['ID','标题','作者','状态','创建时间'], projects: ['ID','标题','作者','状态','创建时间'] }
    : { users: ['ID','Username','Email','Role','Enabled','Actions'], articles: ['ID','Title','Author','Status','Created'], projects: ['ID','Title','Author','Status','Created'] };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        {lang === 'zh' ? '管理' : 'Admin'} <span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '后台' : 'Dashboard'}</span>
      </h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {Object.entries(tabLabels).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '0.5rem 1.2rem', borderRadius: 20, border: tab === key ? 'none' : '1px solid var(--border)',
            background: tab === key ? 'var(--accent)' : 'var(--card-bg)',
            color: tab === key ? '#fff' : 'var(--text)', cursor: 'pointer', textTransform: 'capitalize',
          }}>{label}</button>
        ))}
      </div>

      {loading ? <p style={{ color: 'var(--text-secondary)' }}>{lang === 'zh' ? '加载中...' : 'Loading...'}</p> : (
        <>
          {tab === 'users' && (
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={tableStyle}>
                <thead><tr>{headers.users.map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={tdStyle}>{u.id}</td>
                      <td style={tdStyle}>{u.username}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>{u.role}</td>
                      <td style={tdStyle}>{u.enabled ? '✅' : '❌'}</td>
                      <td style={tdStyle}>
                        <button onClick={() => toggleUser(u.id)} style={actionBtn}>{u.enabled ? (lang === 'zh' ? '禁用' : 'Disable') : (lang === 'zh' ? '启用' : 'Enable')}</button>
                        <button onClick={() => deleteUser(u.id)} style={{ ...actionBtn, color: '#f44' }}>{lang === 'zh' ? '删除' : 'Delete'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'articles' && (
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={tableStyle}>
                <thead><tr>{headers.articles.map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id}>
                      <td style={tdStyle}>{a.id}</td>
                      <td style={tdStyle}>{a.title}</td>
                      <td style={tdStyle}>{a.author?.username}</td>
                      <td style={tdStyle}>{a.status}</td>
                      <td style={tdStyle}>{new Date(a.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'projects' && (
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={tableStyle}>
                <thead><tr>{headers.projects.map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td style={tdStyle}>{p.id}</td>
                      <td style={tdStyle}>{p.title}</td>
                      <td style={tdStyle}>{p.author?.username}</td>
                      <td style={tdStyle}>{p.status}</td>
                      <td style={tdStyle}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'config' && (
            <div className="card" style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{lang === 'zh' ? '站点配置 - 通过数据库或 API 编辑' : 'Site configuration - edit in database or through API'}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' };
const tdStyle = { padding: '0.6rem 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' };
const actionBtn = { background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '0.25rem 0.5rem', cursor: 'pointer', marginRight: '0.5rem', color: 'var(--text)', fontSize: '0.8rem' };
