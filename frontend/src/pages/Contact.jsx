import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <ScrollReveal>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          {lang === 'zh' ? '' : 'Get in '}<span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '联系我' : 'Touch'}</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          {lang === 'zh' ? '有问题或想一起合作吗？' : 'Have a question or want to work together?'}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="card-glass" style={{ padding: '2.5rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}> </div>
              <h3>{lang === 'zh' ? '消息已发送！' : 'Message Sent!'}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{lang === 'zh' ? '感谢您的来信，我会尽快回复。' : "Thanks for reaching out. I'll get back to you soon."}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>{lang === 'zh' ? '姓名' : 'Name'}</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  placeholder={lang === 'zh' ? '请输入姓名' : 'Your name'}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>{lang === 'zh' ? '邮箱' : 'Email'}</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  placeholder="your@email.com"
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>{lang === 'zh' ? '留言' : 'Message'}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={lang === 'zh' ? '请输入留言...' : 'Your message...'}
                />
              </div>
              <button type="submit" style={{
                width: '100%', padding: '0.8rem', background: 'var(--accent)',
                color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontWeight: 600, fontSize: '1rem',
              }}>{lang === 'zh' ? '发送消息' : 'Send Message'}</button>
            </form>
          )}
        </div>
      </ScrollReveal>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
        {[
          { icon: ' ', label: lang === 'zh' ? '邮箱' : 'Email', value: '3317987382@qq.com' },
          { icon: '', label: lang === 'zh' ? '电话' : 'Phone', value: '18079528907' },
          { icon: '', label: lang === 'zh' ? '所在地' : 'Location', value: lang === 'zh' ? '浙江义乌' : 'Yiwu, Zhejiang' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.value}</div>
          </div>
        ))}
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
