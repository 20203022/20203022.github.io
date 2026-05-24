import { useState, useEffect, useRef } from 'react';

export default function Typewriter({ texts, speed = 80, pause = 2000, deleteSpeed = 40 }) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const current = texts[index];
    let timeout;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), deleteSpeed);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }

    setDisplayed(current.substring(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, texts, speed, pause, deleteSpeed]);

  return (
    <span ref={ref}>
      {displayed}
      <span style={{ animation: 'blink 0.7s infinite', fontWeight: 100 }}>|</span>
    </span>
  );
}
