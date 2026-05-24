import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typewriter from '../components/Typewriter';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { lang } = useLanguage();

  const texts = lang === 'zh'
    ? ['Vibe Coding 爱好者', '精通 Claude Code / Trae / Cursor', 'AI 驱动的高效开发', '追求简洁优雅的代码']
    : ['Vibe Coding enthusiast', 'Claude Code / Trae / Cursor', 'AI-powered development', 'I love clean code'];

  const whatIDo = lang === 'zh'
    ? [
        { icon: '', title: '前端开发', desc: 'React、Vue、TypeScript、CSS-in-JS、动画效果' },
        { icon: '', title: '后端开发', desc: 'Spring Boot、Node.js、REST API、微服务架构' },
        { icon: '', title: 'DevOps', desc: 'Docker、CI/CD、Nginx、云部署' },
      ]
    : [
        { icon: '', title: 'Frontend', desc: 'React, Vue, TypeScript, CSS-in-JS, animations' },
        { icon: '', title: 'Backend', desc: 'Spring Boot, Node.js, REST APIs, microservices' },
        { icon: '', title: 'DevOps', desc: 'Docker, CI/CD, Nginx, cloud deployment' },
      ];

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section */}
      <section style={heroStyle}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ textAlign: 'center' }}
        >
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
            {lang === 'zh' ? '你好，我是' : "Hi, I'm"} <span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '开发者杨风' : 'Yang Feng'}</span>
          </h1>
          <p style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: 'var(--text-secondary)', margin: '1rem 0', minHeight: '2.5rem' }}>
            <Typewriter texts={texts} />
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/projects" style={btnPrimary}>{lang === 'zh' ? '查看项目' : 'View Projects'}</Link>
            <Link to="/contact" style={btnOutline}>{lang === 'zh' ? '联系我' : 'Get in Touch'}</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}
        >
          <div style={{ animation: 'bounce 2s infinite', fontSize: '1.5rem', opacity: 0.6 }}>↓</div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' }}>
        <ScrollReveal>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>
            {lang === 'zh' ? '我擅长的' : 'What I '}<span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '领域' : 'Do'}</span>
          </h2>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {whatIDo.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.15}>
              <div className="card-glass" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <ScrollReveal>
          <h2 style={{ fontSize: '2rem' }}>
            {lang === 'zh' ? '一起' : "Let's work"} <span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '合作' : 'together'}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
            {lang === 'zh' ? '我目前正在寻找新的机会' : "I'm currently open to new opportunities"}
          </p>
          <Link to="/contact" style={btnPrimary}>{lang === 'zh' ? '打个招呼' : 'Say Hello'}</Link>
        </ScrollReveal>
      </section>
    </div>
  );
}

const heroStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: '2rem',
};

const btnPrimary = {
  padding: '0.75rem 2rem',
  background: 'var(--accent)',
  color: '#fff',
  borderRadius: 30,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  border: 'none',
  cursor: 'pointer',
};

const btnOutline = {
  padding: '0.75rem 2rem',
  background: 'transparent',
  color: 'var(--accent)',
  borderRadius: 30,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  border: '2px solid var(--accent)',
  cursor: 'pointer',
};
