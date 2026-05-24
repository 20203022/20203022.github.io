import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

const skills = [
  { name: 'Java', level: 90 },
  { name: 'Spring Boot', level: 85 },
  { name: 'React', level: 88 },
  { name: 'JavaScript', level: 85 },
  { name: 'TypeScript', level: 75 },
  { name: 'MySQL', level: 82 },
  { name: 'Docker', level: 70 },
  { name: 'Git', level: 88 },
];

export default function About() {
  const { lang } = useLanguage();

  const aiTools = lang === 'zh'
    ? [
        { name: 'Claude Code', desc: '日常主力 AI 编程助手，深度集成开发工作流' },
        { name: 'Codex', desc: 'OpenAI 编码智能体，擅长复杂逻辑生成' },
        { name: 'Trae', desc: '字节跳动 AI IDE，高效代码补全与重构' },
        { name: 'OpenClaw', desc: '自动化工作流编排，多工具链协同' },
        { name: 'KimiClaw', desc: '长上下文理解，大规模代码库分析' },
      ]
    : [
        { name: 'Claude Code', desc: 'Primary AI coding assistant, deeply integrated dev workflow' },
        { name: 'Codex', desc: 'OpenAI coding agent, excels at complex logic generation' },
        { name: 'Trae', desc: 'ByteDance AI IDE, efficient code completion and refactoring' },
        { name: 'OpenClaw', desc: 'Automated workflow orchestration, multi-tool chain collaboration' },
        { name: 'KimiClaw', desc: 'Long-context understanding, large-scale codebase analysis' },
      ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <ScrollReveal>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          {lang === 'zh' ? '关于' : 'About'} <span style={{ color: 'var(--accent)' }}>{lang === 'zh' ? '我' : 'Me'}</span>
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="card" style={{ padding: '2.5rem', margin: '3rem 0' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            {lang === 'zh'
              ? '我是杨风，毕业于江西科技师范大学计算机科学与技术专业，现居浙江义乌。我热爱 Vibe Coding，擅长使用 AI 编程工具高效构建高质量的 Web 应用。我相信 AI 与开发的深度融合将重塑软件工程的未来。'
              : "I'm Yang Feng, a Computer Science graduate from Jiangxi Science and Technology Normal University, now living in Yiwu, Zhejiang. I'm passionate about Vibe Coding and proficient in leveraging AI tools to efficiently build high-quality web applications. I believe the deep integration of AI and development will reshape the future of software engineering."
            }
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{lang === 'zh' ? '技术技能' : 'Tech Skills'}</h2>
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          {skills.map((skill, i) => (
            <div key={skill.name} style={{ marginBottom: i < skills.length - 1 ? '1.2rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 500 }}>{skill.name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{skill.level}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--card-bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${skill.level}%`,
                  background: 'var(--accent)', borderRadius: 3,
                  transition: 'width 1s ease-out',
                }} />
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.45}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{lang === 'zh' ? 'AI 编程工具' : 'AI Dev Tools'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {aiTools.map(tool => (
            <div className="card" key={tool.name} style={{ padding: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.4rem', color: 'var(--accent)' }}>{tool.name}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
