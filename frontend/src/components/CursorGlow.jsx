import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CursorGlow() {
  const { theme } = useTheme();
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    let raf;
    let mouseX = -200, mouseY = -200;
    let currentX = -200, currentY = -200;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: theme === 'dark'
          ? 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.02) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'translate(-250px, -250px)',
        willChange: 'transform',
      }}
    />
  );
}
