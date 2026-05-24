import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: 3,
      width: `${progress}%`,
      background: 'linear-gradient(90deg, var(--accent), #6366f1, #a855f7)',
      zIndex: 1001,
      transition: 'width 0.1s linear',
      borderRadius: '0 2px 2px 0',
    }} />
  );
}
