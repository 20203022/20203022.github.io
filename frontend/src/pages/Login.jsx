import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { lang } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = isRegister
        ? await authApi.register(form)
        : await authApi.login({ username: form.username, password: form.password });
      login(res.data.token, res.data.username, res.data.role, res.data.userId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || (lang === 'zh' ? '操作失败，请重试' : 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', zIndex: 1,
    }}>
      <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 1.5rem' }}>
          {isRegister ? (lang === 'zh' ? '创建账户' : 'Create Account') : (lang === 'zh' ? '欢迎回来' : 'Welcome Back')}
        </h2>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(255,0,0,0.1)', borderRadius: 8, marginBottom: '1rem', color: '#f44', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>{lang === 'zh' ? '用户名' : 'Username'}</label>
            <input
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              style={inputStyle}
              placeholder={lang === 'zh' ? '请输入用户名' : 'Enter username'}
            />
          </div>

          {isRegister && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>{lang === 'zh' ? '邮箱' : 'Email'}</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
                placeholder={lang === 'zh' ? '请输入邮箱' : 'Enter email'}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>{lang === 'zh' ? '密码' : 'Password'}</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={inputStyle}
              placeholder={lang === 'zh' ? '请输入密码' : 'Enter password'}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem',
              background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontSize: '1rem', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (lang === 'zh' ? '请稍候...' : 'Please wait...') : isRegister ? (lang === 'zh' ? '注册' : 'Sign Up') : (lang === 'zh' ? '登录' : 'Sign In')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isRegister
            ? (lang === 'zh' ? '已有账户？' : 'Already have an account?')
            : (lang === 'zh' ? '还没有账户？' : "Don't have an account?")}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
          >
            {isRegister ? (lang === 'zh' ? '登录' : 'Sign In') : (lang === 'zh' ? '注册' : 'Sign Up')}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem 1rem',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--card-bg)',
  color: 'var(--text)',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
};
