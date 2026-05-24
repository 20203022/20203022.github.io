import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function Timeline() {
  const { lang } = useLanguage();

  const timeline = lang === 'zh'
    ? [
        { year: '2026', title: '高级开发工程师', desc: '负责 SaaS 平台的前端架构设计。' },
        { year: '2024', title: '全栈开发工程师', desc: '使用 Spring Boot 和 React 构建微服务。' },
        { year: '2022', title: '初级开发工程师', desc: '开始职业生涯，构建 Web 应用程序。' },
        { year: '2020', title: '开始编程', desc: '写下了第一行代码，从此爱上了编程。' },
      ]
    : [
        { year: '2026', title: 'Senior Developer', desc: 'Leading frontend architecture for a SaaS platform.' },
        { year: '2024', title: 'Full-stack Developer', desc: 'Built microservices with Spring Boot and React.' },
        { year: '2022', title: 'Junior Developer', desc: 'Started career building web applications.' },
        { year: '2020', title: 'Started Coding', desc: 'Wrote my first line of code and fell in love with programming.' },
      ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <ScrollReveal>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
          {lang === 'zh' ? '我的' : 'My'} <span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '历程' : 'Journey'}</span>
        </h1>
      </ScrollReveal>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 2, background: 'var(--accent)', opacity: 0.3, transform: 'translateX(-50%)',
        }} />

        {timeline.map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.15}>
            <div style={{
              display: 'flex', alignItems: 'center', marginBottom: '3rem',
              flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
            }}>
              <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left', paddingRight: i % 2 === 0 ? '3rem' : 0, paddingLeft: i % 2 === 1 ? '3rem' : 0 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>{item.year}</span>
                <h3 style={{ margin: '0.3rem 0' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>{item.desc}</p>
              </div>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)', zIndex: 1, flexShrink: 0,
              }} />
              <div style={{ flex: 1 }} />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
