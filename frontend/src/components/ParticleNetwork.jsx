import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const SHAPES = {
  zh: ['杨风', '<Dev/>', '全栈', 'AI'],
  en: ['Dev', '< />', 'Full', 'AI'],
};

const TYPEWRITER_TEXTS = {
  zh: ['你好世界', '杨风', '全栈开发', 'Vibe Coding', 'Claude Code'],
  en: ['Hello World', 'Yang Feng', 'Full Stack', 'Vibe Coding', 'Claude Code'],
};

const MODES = 22;
const MODE_DURATION = 900; // ~15s at 60fps

function getTextPixels(text, width, height) {
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d');
  const fontSize = Math.min(width / (text.length * 0.7), height * 0.5);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${fontSize}px "PingFang SC","Microsoft YaHei","Helvetica Neue",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (imgData.data[(y * width + x) * 4 + 3] > 128) pixels.push({ x, y });
    }
  }
  return pixels;
}

function buildTextTargets(text, count, w, h) {
  const pixels = getTextPixels(text, w, h);
  const targets = [];
  const step = Math.max(1, Math.floor(pixels.length / count));
  for (let i = 0; i < pixels.length && targets.length < count; i += step) {
    targets.push(pixels[i]);
  }
  return targets;
}

// Build a grid of character-level targets for typewriter
function buildCharTargets(char, count, w, h, cx, cy, cw, ch) {
  const off = document.createElement('canvas');
  off.width = cw;
  off.height = ch;
  const ctx = off.getContext('2d');
  const fontSize = Math.min(cw * 0.9, ch * 0.9);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${fontSize}px "PingFang SC","Microsoft YaHei","Helvetica Neue",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, cw / 2, ch / 2);
  const imgData = ctx.getImageData(0, 0, cw, ch);
  const pixels = [];
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      if (imgData.data[(y * cw + x) * 4 + 3] > 128) pixels.push({ x: cx + x, y: cy + y });
    }
  }
  const targets = [];
  const step = Math.max(1, Math.floor(pixels.length / count));
  for (let i = 0; i < pixels.length && targets.length < count; i += step) {
    targets.push(pixels[i]);
  }
  return targets;
}

export default function ParticleNetwork() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const targetsRef = useRef([]);
  const pulsesRef = useRef([]);
  const typeRef = useRef({ text: '', charIdx: 0, timer: 0 });
  const mouseRef = useRef({ x: -1000, y: -1000, down: false });
  const animRef = useRef(null);
  const modeRef = useRef(0);
  const timerRef = useRef(0);
  const timeRef = useRef(0);
  const transitionRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const { theme } = useTheme();
  const { lang } = useLanguage();

  const initParticles = useCallback((width, height) => {
    dimsRef.current = { w: width, h: height };
    const count = Math.min(600, Math.max(250, Math.floor((width * height) / 2000)));
    const hueBase = Math.random() * 360;
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0, vy: 0,
      r: Math.random() * 2.5 + 1.5,
      hue: (hueBase + i * 3) % 360,
      baseX: 0, baseY: 0,
      life: 0,
      angle: Math.random() * Math.PI * 2,
      orbit: 0,
      nucleus: 0,
      burst: 0,
      burstVx: 0, burstVy: 0,
      state: Math.random() > 0.5 ? 1 : 0, // for reaction-diffusion
      gridCol: 0, gridRow: 0, // for elastic web
      restX: 0, restY: 0, // for elastic web
    }));

    const texts = SHAPES[lang] || SHAPES.en;
    targetsRef.current = buildTextTargets(texts[0], count, width, height);
  }, [lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initParticles(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const onDown = () => { mouseRef.current.down = true; };
    const onUp = () => { mouseRef.current.down = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const isDark = theme === 'dark';

    const animate = () => {
      const t = timeRef.current++;
      const particles = particlesRef.current;
      const pulses = pulsesRef.current;
      const { w, h } = dimsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const md = mouseRef.current.down;

      const currentMode = modeRef.current;
      const useTrail = currentMode === 0 || currentMode === 2 || currentMode === 5 || currentMode === 7 || currentMode === 9 || currentMode === 12 || currentMode === 13 || currentMode === 16 || currentMode === 18 || currentMode === 20;
      if (useTrail) {
        ctx.fillStyle = isDark ? 'rgba(5,5,15,0.08)' : 'rgba(248,250,255,0.08)';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      // Mode switch — random, never same as current
      timerRef.current++;
      if (timerRef.current > MODE_DURATION) {
        timerRef.current = 0;
        let newMode;
        do { newMode = Math.floor(Math.random() * MODES); } while (newMode === modeRef.current);
        modeRef.current = newMode;
        transitionRef.current = 75;

        if (newMode === 1) {
          const texts = SHAPES[lang] || SHAPES.en;
          targetsRef.current = buildTextTargets(texts[Math.floor(Math.random() * texts.length)], particles.length, w, h);
        }
        if (newMode === 5) {
          particles.forEach(p => {
            p.x = Math.random() * w; p.y = h + Math.random() * 200;
            p.r = 1.5 + Math.random() * 5;
            p.vx = (Math.random() - 0.5) * 0.4; p.vy = -(0.5 + Math.random() * 1.2);
          });
        }
        if (newMode === 6) {
          const sp = 50;
          const cols = Math.floor(w / sp), rows = Math.floor(h / sp);
          particles.forEach((p, i) => {
            p.baseX = 30 + (i % cols) * sp;
            p.baseY = 30 + Math.floor(i / cols) % rows * sp;
            p.x = p.baseX; p.y = p.baseY;
          });
        }
        if (newMode === 7) {
          particles.forEach(p => {
            p.orbit = 60 + Math.random() * Math.min(w, h) * 0.48;
            p.angle = Math.random() * Math.PI * 2;
            p.y = h / 2 + Math.sin(p.angle) * p.orbit;
            p.x = w / 2 + Math.cos(p.angle) * p.orbit;
          });
        }
        if (newMode === 8) {
          particles.forEach(p => {
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = (Math.random() - 0.5) * 2;
            p.hue = 200 + Math.random() * 60;
          });
        }
        if (newMode === 9) {
          particles.forEach(p => {
            p.hue = 35 + Math.random() * 25;
            p.vx = (Math.random() - 0.5) * 0.3;
            p.vy = (Math.random() - 0.5) * 0.3;
            p.life = 40 + Math.random() * 80;
            p.r = 1.5 + Math.random() * 2;
          });
        }
        if (newMode === 10) {
          particles.forEach(p => {
            p.vx = (Math.random() - 0.5) * 0.2;
            p.vy = (Math.random() - 0.5) * 0.2;
            p.hue = 220 + Math.random() * 40;
          });
        }
        if (newMode === 11) {
          const sectors = 6;
          particles.forEach(p => {
            p.angle = Math.random() * (Math.PI * 2 / sectors);
            p.orbit = 30 + Math.random() * Math.min(w, h) * 0.45;
            p.baseX = Math.cos(p.angle) * p.orbit;
            p.baseY = Math.sin(p.angle) * p.orbit;
            p.hue = (p.hue * 7) % 360;
          });
        }
        if (newMode === 12) {
          const nuclei = [];
          for (let n = 0; n < 6; n++) {
            nuclei.push({ x: w * 0.15 + Math.random() * w * 0.7, y: h * 0.15 + Math.random() * h * 0.7 });
          }
          particles.forEach(p => {
            p.nucleus = Math.floor(Math.random() * nuclei.length);
            const nc = nuclei[p.nucleus];
            p.baseX = nc.x; p.baseY = nc.y;
            p.orbit = 20 + Math.random() * 90;
            p.angle = Math.random() * Math.PI * 2;
            p.vx = 0.01 + Math.random() * 0.03;
            p.hue = 260 + Math.random() * 60;
          });
        }
        if (newMode === 13) {
          pulsesRef.current = [];
        }
        if (newMode === 14) {
          particles.forEach(p => {
            p.burst = 0;
            p.life = 30 + Math.random() * 60;
            p.x = Math.random() * w; p.y = h + 10;
            p.vx = (Math.random() - 0.5) * 0.5;
            p.vy = -(4 + Math.random() * 6);
            p.r = 1 + Math.random() * 1.5;
            p.hue = Math.random() * 360;
          });
        }
        // --- New mode inits (15-21) ---
        if (newMode === 15) {
          // Magnetic field
          particles.forEach(p => {
            p.x = Math.random() * w; p.y = Math.random() * h;
            p.vx = 0; p.vy = 0;
            p.hue = 190 + Math.random() * 30;
          });
        }
        if (newMode === 16) {
          // Gravity wells: random positions for gravity sources stored in baseX/Y
          const wellCount = 4;
          const wells = [];
          for (let n = 0; n < wellCount; n++) {
            wells.push({ x: w * 0.2 + Math.random() * w * 0.6, y: h * 0.2 + Math.random() * h * 0.6, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3 });
          }
          particles.forEach((p, i) => {
            const wl = wells[i % wellCount];
            p.baseX = wl.x; p.baseY = wl.y;
            p.vx = wl.vx; p.vy = wl.vy;
            p.x = p.baseX + (Math.random()-0.5)*200;
            p.y = p.baseY + (Math.random()-0.5)*200;
            p.hue = 280 + Math.random() * 60;
          });
        }
        if (newMode === 17) {
          // Elastic web: grid arrangement
          const gCols = Math.floor(Math.sqrt(particles.length * w / h));
          const gRows = Math.floor(particles.length / gCols);
          const cellW = w / (gCols + 1);
          const cellH = h / (gRows + 1);
          particles.forEach((p, i) => {
            p.gridCol = i % gCols;
            p.gridRow = Math.floor(i / gCols) % gRows;
            p.restX = cellW + p.gridCol * cellW;
            p.restY = cellH + p.gridRow * cellH;
            p.x = p.restX;
            p.y = p.restY;
            p.vx = 0; p.vy = 0;
            p.hue = 0;
          });
        }
        if (newMode === 18) {
          // Reaction-diffusion: random state, warm/cool hues
          particles.forEach(p => {
            p.state = Math.random() > 0.5 ? 1 : 0;
            p.vx = (Math.random()-0.5)*0.3;
            p.vy = (Math.random()-0.5)*0.3;
          });
        }
        if (newMode === 19) {
          // DNA helix
          particles.forEach((p, i) => {
            p.orbit = 60 + Math.random() * 120; // radius
            p.angle = (i / particles.length) * Math.PI * 40; // spread vertically
            p.baseX = i % 2; // strand 0 or 1
            p.hue = 290 + Math.random() * 40;
          });
        }
        if (newMode === 20) {
          // Laser grid: assign to grid rows/cols
          const lCols = Math.floor(w / 55);
          const lRows = Math.floor(h / 55);
          particles.forEach((p, i) => {
            p.gridCol = i % lCols;
            p.gridRow = Math.floor(i / lCols) % lRows;
            p.baseX = 30 + p.gridCol * 55;
            p.baseY = 30 + p.gridRow * 55;
            p.x = p.baseX; p.y = p.baseY;
            p.vx = 0; p.vy = 0;
            p.hue = 320 + Math.random() * 40;
          });
        }
        if (newMode === 21) {
          // Typewriter: pick a text
          const texts = TYPEWRITER_TEXTS[lang] || TYPEWRITER_TEXTS.en;
          const text = texts[Math.floor(Math.random() * texts.length)];
          typeRef.current = { text, charIdx: 0, timer: 0 };
          particles.forEach(p => { p.x = Math.random() * w; p.y = Math.random() * h; p.vx = 0; p.vy = 0; });
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        switch (modeRef.current) {
          // ==================== MODES 0-7: Original ====================
          case 0: {
            if (i < particles.length - 5) {
              p.vx *= 0.99; p.vy *= 0.99;
              p.vx += (Math.random() - 0.5) * 0.015;
              p.vy += (Math.random() - 0.5) * 0.015;
              p.r = 0.5 + Math.sin(t * 0.04 + p.hue) * 0.5;
            } else {
              if (p.life <= 0) { p.x = Math.random() * w; p.y = Math.random() * h * 0.5; p.vx = 4 + Math.random() * 6; p.vy = 1 + Math.random() * 3; p.life = 60 + Math.random() * 40; p.r = 0.8 + Math.random() * 0.6; }
              p.life--;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 12, p.y - p.vy * 12);
              ctx.strokeStyle = isDark ? `rgba(180,210,255,${Math.min(1, p.life / 20) * 0.7})` : `rgba(60,100,180,${Math.min(1, p.life / 20) * 0.5})`;
              ctx.lineWidth = p.r * 2; ctx.stroke();
            }
            break;
          }
          case 1: {
            const target = targetsRef.current[i];
            if (target) {
              const dx = mx - p.x, dy = my - p.y, dm = Math.sqrt(dx * dx + dy * dy);
              if (dm < 160 && dm > 0) { const f = (160 - dm) / 160; p.vx -= (dx / dm) * f * 4; p.vy -= (dy / dm) * f * 4; p.vx += (Math.random() - 0.5) * f * 3; p.vy += (Math.random() - 0.5) * f * 3; }
              else { const td = target.x - p.x, ty = target.y - p.y, dt = Math.sqrt(td * td + ty * ty); if (dt > 0.5) { const af = 0.015 + Math.min(dt * 0.0008, 0.04); p.vx += td * af; p.vy += ty * af; } }
            }
            p.vx *= 0.92; p.vy *= 0.92;
            break;
          }
          case 2: {
            const fx = Math.sin(p.y * 0.008 + t * 0.02) * Math.cos(p.x * 0.006 + p.hue) * 0.6;
            const fy = Math.cos(p.x * 0.007 + t * 0.015) * Math.sin(p.y * 0.009 + p.hue) * 0.6;
            p.vx += fx * 0.015; p.vy += fy * 0.015;
            const dx = mx - p.x, dy = my - p.y, dm = Math.sqrt(dx * dx + dy * dy);
            if (dm < 300 && dm > 0) { const f = (1 - dm / 300) ** 2; if (md) { p.vx += -(dy / dm) * f * 0.35; p.vy += (dx / dm) * f * 0.35; p.vx += (dx / dm) * f * 0.04; p.vy += (dy / dm) * f * 0.04; } else { p.vx -= (dx / dm) * f * 0.08; p.vy -= (dy / dm) * f * 0.08; } }
            p.vx *= 0.985; p.vy *= 0.985; const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd > 1.5) { p.vx *= 1.5 / spd; p.vy *= 1.5 / spd; }
            if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20; if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
            break;
          }
          case 3: {
            p.vy += 0.015; p.vx += Math.sin(t * 0.03 + p.hue) * 0.03; p.vx *= 0.995; p.vy *= 0.995;
            if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; p.vx = 0; p.vy = 0.8 + Math.random() * 1.5; }
            if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
            p.r = 1.5 + Math.abs(Math.sin(t * 0.05 + i)) * 2.5;
            break;
          }
          case 4: {
            const ba = t * 0.003, bi = i % 6, bsa = (bi / 6) * Math.PI * 2 + ba, dist = (i % 40) * (Math.max(w, h) / 38);
            p.x = w / 2 + Math.cos(bsa) * dist; p.y = h / 2 + Math.sin(bsa) * dist;
            p.x += Math.sin(t * 0.02 + i) * 3; p.y += Math.cos(t * 0.02 + i) * 3;
            p.r = 1 + Math.abs(Math.sin(dist * 0.01 + t * 0.03)) * 1.5;
            break;
          }
          case 5: {
            p.vy += 0.003; p.vx += (Math.random() - 0.5) * 0.02; p.vx *= 0.99;
            if (p.y < -30) { p.y = h + 30; p.x = Math.random() * w; p.r = 1.5 + Math.random() * 5; p.vy = -(0.5 + Math.random() * 1.2); }
            p.x += Math.sin(t * 0.03 + i) * 0.15;
            break;
          }
          case 6: {
            const progress = ((t + i * 20) % 300) / 300;
            if (progress < 0.5) { p.x = p.baseX + (Math.random() - 0.5) * 2; p.y = p.baseY + (Math.random() - 0.5) * 2; }
            else if (progress < 0.75) { const lp = (progress - 0.5) * 4; p.x = p.baseX + 50 * lp; p.y = p.baseY; }
            else { const lp = (progress - 0.75) * 4; p.x = p.baseX + 50; p.y = p.baseY + 50 * lp; }
            break;
          }
          case 7: {
            const cx = w / 2, cy = h / 2;
            if (md) { const mx2 = mx - cx, my2 = my - cy; if (Math.sqrt(mx2 * mx2 + my2 * my2) < 300) { p.orbit += (Math.random() - 0.5) * 5; p.orbit = Math.max(30, Math.min(Math.min(w, h) * 0.5, p.orbit)); } }
            p.angle += 0.01 + (p.orbit / Math.max(w, h)) * 0.02;
            p.x = cx + Math.cos(p.angle) * (p.orbit + Math.sin(t * 0.02 + i * 0.1) * 10);
            p.y = cy + Math.sin(p.angle) * (p.orbit + Math.sin(t * 0.02 + i * 0.1) * 10);
            break;
          }

          // ==================== MODES 8-14: Batch 2 ====================
          case 8: {
            let sepX = 0, sepY = 0, aliX = 0, aliY = 0, cohX = 0, cohY = 0, nCount = 0;
            const viewR = 50;
            for (let j = i - 12; j <= i + 12; j += 4) {
              if (j === i || j < 0 || j >= particles.length) continue;
              const q = particles[j], ddx = p.x - q.x, ddy = p.y - q.y, d = Math.sqrt(ddx * ddx + ddy * ddy);
              if (d < viewR && d > 0.1) { sepX += (ddx / d) * (1 - d / viewR); sepY += (ddy / d) * (1 - d / viewR); aliX += q.vx; aliY += q.vy; cohX += q.x; cohY += q.y; nCount++; }
            }
            if (nCount > 0) { p.vx += sepX * 0.03 + ((aliX / nCount) - p.vx) * 0.02 + ((cohX / nCount) - p.x) * 0.0004; p.vy += sepY * 0.03 + ((aliY / nCount) - p.vy) * 0.02 + ((cohY / nCount) - p.y) * 0.0004; }
            const spd2 = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd2 > 0) { p.vx = (p.vx / spd2) * 1.2; p.vy = (p.vy / spd2) * 1.2; }
            if (p.x < -30) p.x = w + 30; if (p.x > w + 30) p.x = -30; if (p.y < -30) p.y = h + 30; if (p.y > h + 30) p.y = -30;
            break;
          }
          case 9: {
            p.vx += (Math.random() - 0.5) * 0.015; p.vy += (Math.random() - 0.5) * 0.015; p.life--;
            if (p.life <= 0) { p.vx += (Math.random() - 0.5) * 1.5; p.vy += (Math.random() - 0.5) * 1.5; p.life = 40 + Math.random() * 80; }
            p.vx *= 0.98; p.vy *= 0.98; const fs = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (fs > 0.8) { p.vx *= 0.8 / fs; p.vy *= 0.8 / fs; }
            if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20; if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
            p.r = 1.5 + Math.sin(t * 0.05 + i * 0.3) * 1.2 + Math.abs(Math.sin(t * 0.1 + p.hue)) * 1.5;
            break;
          }
          case 10: {
            p.vx += (Math.random() - 0.5) * 0.01; p.vy += (Math.random() - 0.5) * 0.01; p.vx *= 0.995; p.vy *= 0.995;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            p.r = 0.5 + Math.sin(t * 0.03 + i * 0.5) * 0.4;
            break;
          }
          case 11: {
            const sectors = 6, rot = t * 0.004, secAngle = (Math.PI * 2) / sectors, sx = p.baseX, sy = p.baseY;
            const cr = Math.cos(rot), sr = Math.sin(rot), rx = sx * cr - sy * sr, ry = sx * sr + sy * cr;
            const sector = i % sectors, sa = sector * secAngle, cr2 = Math.cos(sa), sr2 = Math.sin(sa);
            p.x = w / 2 + rx * cr2 - ry * sr2; p.y = h / 2 + rx * sr2 + ry * cr2;
            p.r = 1 + Math.abs(Math.sin(t * 0.03 + i * 0.1)) * 1.5;
            break;
          }
          case 12: {
            p.angle += p.vx;
            if (Math.random() < 0.001) { const j = (i + Math.floor(Math.random() * particles.length)) % particles.length; p.baseX = particles[j].baseX; p.baseY = particles[j].baseY; p.orbit = 20 + Math.random() * 90; p.angle = Math.random() * Math.PI * 2; }
            const wob = p.orbit + Math.sin(t * 0.03 + i * 0.2) * 15;
            p.x = p.baseX + Math.cos(p.angle) * wob; p.y = p.baseY + Math.sin(p.angle) * wob * 0.7;
            p.r = 0.8 + Math.abs(Math.sin(t * 0.04 + i)) * 1.5;
            break;
          }
          case 13: {
            if (t % 35 === 0 && pulses.length < 8) { pulses.push({ x: Math.random() * w, y: Math.random() * h, radius: 0, alpha: 1, hue: Math.random() * 360 }); }
            const pi = i % pulses.length;
            const pulse = pulses[pi];
            if (pulse && pulse.alpha > 0.01) { const aoff = (i / particles.length) * Math.PI * 2; p.x = pulse.x + Math.cos(aoff) * pulse.radius; p.y = pulse.y + Math.sin(aoff) * pulse.radius; p.hue = pulse.hue; p.r = 1 + pulse.alpha * 2; }
            for (let pi2 = pulses.length - 1; pi2 >= 0; pi2--) { pulses[pi2].radius += 1.8; pulses[pi2].alpha -= 0.006; if (pulses[pi2].alpha <= 0) pulses.splice(pi2, 1); }
            break;
          }
          case 14: {
            if (p.burst === 0) { p.vy += 0.01; p.x += p.vx * 0.3; p.y += p.vy; p.life--; if (p.life <= 0 || p.y < h * 0.1 + Math.random() * h * 0.4) { p.burst = 1; p.life = 40 + Math.random() * 30; const ba = Math.random() * Math.PI * 2, bs = 1 + Math.random() * 4; p.burstVx = Math.cos(ba) * bs; p.burstVy = Math.sin(ba) * bs; p.vx = p.burstVx; p.vy = p.burstVy; } }
            else if (p.burst === 1) { p.vy += 0.04; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.life--; p.r *= 0.98; if (p.life <= 0) { p.burst = 0; p.x = Math.random() * w; p.y = h + 10; p.vx = (Math.random() - 0.5) * 0.5; p.vy = -(4 + Math.random() * 6); p.life = 30 + Math.random() * 60; p.r = 1 + Math.random() * 1.5; p.hue = Math.random() * 360; } }
            break;
          }

          // ==================== MODES 15-21: Batch 3 ====================
          // ===== MODE 15: Magnetic Field =====
          case 15: {
            // Magnetic field lines flow top-to-bottom, curving around mouse
            const mdx = p.x - mx, mdy = p.y - my;
            const md2 = mdx * mdx + mdy * mdy;
            const mInf = 8000 / Math.max(md2, 400);
            // Base downward flow + mouse deflection
            p.vx = (Math.random() - 0.5) * 0.1 - (mdy / Math.max(Math.sqrt(md2), 1)) * mInf * 0.5;
            p.vy = 0.8 + (mdx / Math.max(Math.sqrt(md2), 1)) * mInf * 0.5;
            // Normalize speed
            const ms = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            p.vx = (p.vx / ms) * 1.2; p.vy = (p.vy / ms) * 1.2;
            p.x += p.vx; p.y += p.vy;
            if (p.x < -30) p.x = w + 30; if (p.x > w + 30) p.x = -30;
            if (p.y < -30) p.y = h + 30; if (p.y > h + 30) p.y = -30;
            p.r = 0.7 + Math.abs(Math.sin(t * 0.04 + i)) * 0.8;
            break;
          }

          // ===== MODE 16: Gravity Wells =====
          case 16: {
            // Gravity sources drift slowly, stored in baseX/baseY of a few particles
            const wellIdx = i % 4;
            const srcP = particles[wellIdx];
            if (i < 4) {
              // These particles ARE the gravity sources — drift them
              srcP.baseX += srcP.vx; srcP.baseY += srcP.vy;
              if (srcP.baseX < 50 || srcP.baseX > w - 50) srcP.vx *= -1;
              if (srcP.baseY < 50 || srcP.baseY > h - 50) srcP.vy *= -1;
              p.x = srcP.baseX; p.y = srcP.baseY;
              p.r = 3 + Math.sin(t * 0.1) * 1.5;
              p.hue = 50;
            } else {
              // Other particles orbit/fall toward their assigned well
              const wx = particles[wellIdx].baseX, wy = particles[wellIdx].baseY;
              const gx = wx - p.x, gy = wy - p.y;
              const gd = Math.sqrt(gx * gx + gy * gy) + 0.1;
              const gf = 0.15 / Math.max(gd * 0.05, 0.5);
              p.vx += gx * gf; p.vy += gy * gf;
              // Tangential orbital push
              p.vx += -gy * gf * 0.4; p.vy += gx * gf * 0.4;
              p.vx *= 0.985; p.vy *= 0.985;
              p.hue = 270 + (gd % 60);
            }
            break;
          }

          // ===== MODE 17: Elastic Web =====
          case 17: {
            // Spring force toward rest position
            const sx = p.restX - p.x, sy = p.restY - p.y;
            p.vx += sx * 0.02; p.vy += sy * 0.02;
            // Mouse grab — pull nearby particles
            const mdx2 = mx - p.x, mdy2 = my - p.y;
            const md2_2 = Math.sqrt(mdx2 * mdx2 + mdy2 * mdy2);
            if (md && md2_2 < 150 && md2_2 > 0) {
              p.vx += mdx2 * 0.08; p.vy += mdy2 * 0.08;
            }
            // Spring connections to neighbors (every 4th connection check)
            if (i % 4 === 0) {
              const nIdx = i + 1;
              if (nIdx < particles.length && particles[nIdx].gridRow === p.gridRow) {
                const ndx = particles[nIdx].x - p.x, ndy = particles[nIdx].y - p.y;
                const nd = Math.sqrt(ndx * ndx + ndy * ndy);
                const restD = Math.abs(particles[nIdx].restX - p.restX);
                if (nd > 0 && Math.abs(nd - restD) > 2) {
                  const nf = (nd - restD) * 0.005;
                  p.vx += (ndx / nd) * nf; p.vy += (ndy / nd) * nf;
                }
              }
            }
            p.vx *= 0.94; p.vy *= 0.94;
            break;
          }

          // ===== MODE 18: Reaction-Diffusion =====
          case 18: {
            // Count local neighbors in opposite state
            let oppCount = 0, sameCount = 0;
            const checkR = 35;
            for (let j = Math.max(0, i - 20); j < Math.min(particles.length, i + 20); j += 2) {
              if (j === i) continue;
              const q = particles[j];
              const ddx2 = p.x - q.x, ddy2 = p.y - q.y;
              if (Math.sqrt(ddx2 * ddx2 + ddy2 * ddy2) < checkR) {
                if (q.state !== p.state) oppCount++; else sameCount++;
              }
            }
            // Turing-like transition rule
            if (p.state === 0 && oppCount > 4) p.state = 1;
            else if (p.state === 1 && (oppCount < 2 || sameCount > 8)) p.state = 0;
            // Move based on state
            p.vx += (Math.random() - 0.5) * 0.08;
            p.vy += (Math.random() - 0.5) * 0.08;
            // Same-state attraction, opposite repulsion (phase separation)
            if (i % 3 === 0) {
              const q = particles[Math.max(0, i - 3)];
              const ddx3 = p.x - q.x, ddy3 = p.y - q.y;
              const d3 = Math.sqrt(ddx3 * ddx3 + ddy3 * ddy3) + 0.1;
              if (d3 < 50 && q.state === p.state) { p.vx -= (ddx3 / d3) * 0.06; p.vy -= (ddy3 / d3) * 0.06; }
            }
            p.vx *= 0.95; p.vy *= 0.95;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            p.hue = p.state === 1 ? 320 + Math.random() * 20 : 200 + Math.random() * 20;
            p.r = p.state === 1 ? 2.5 : 1;
            break;
          }

          // ===== MODE 19: DNA Helix =====
          case 19: {
            const strand = p.baseX; // 0 or 1
            const phase = strand * Math.PI;
            const scrollSpeed = 0.6;
            // Update vertical position
            p.angle += scrollSpeed * 0.05;
            const cy2 = ((p.angle % (Math.PI * 4)) / (Math.PI * 4)) * h;
            const helixX = w / 2 + Math.cos(cy2 * 0.04 + p.angle + phase) * p.orbit;
            const helixY = cy2;
            p.x = helixX; p.y = helixY;
            if (p.y > h + 20) p.angle -= 0.01;
            if (p.y < -20) p.angle += 0.01;
            p.r = 1 + Math.abs(Math.sin(p.angle * 0.5)) * 1.2;
            // Draw rung connections
            if (strand === 0 && i % 3 === 0) {
              const mate = particles[Math.min(i + 1, particles.length - 1)];
              if (mate.baseX === 1) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mate.x, mate.y);
                ctx.strokeStyle = isDark ? `rgba(200,150,255,0.15)` : `rgba(100,50,180,0.1)`;
                ctx.lineWidth = 0.4; ctx.stroke();
              }
            }
            break;
          }

          // ===== MODE 20: Laser Grid =====
          case 20: {
            // Fast sweeping lines across the grid
            const sweep = (t * 2 + p.gridCol * 7 + p.gridRow * 13) % (w + h);
            // Diagonal sweep patterns
            if (sweep < w) {
              // Horizontal sweep
              p.x = sweep;
              p.y = p.baseY;
              p.r = 0.3 + (sweep % 15 < 2 ? 3 : 0.5);
            } else {
              // Vertical sweep
              p.y = (sweep - w);
              p.x = p.baseX;
              p.r = 0.3 + ((sweep - w) % 15 < 2 ? 3 : 0.5);
            }
            // Draw laser beam (bright glow at head)
            const isHead = (sweep % 15) < 3;
            if (isHead) {
              p.hue = 320;
              p.r = 3 + Math.random();
            } else {
              p.hue = 200;
            }
            break;
          }

          // ===== MODE 21: Typewriter =====
          case 21: {
            const tw = typeRef.current;
            if (!tw.text) break;
            tw.timer++;
            // Advance character every ~40 frames
            if (tw.timer > 35 && tw.charIdx < tw.text.length) {
              tw.charIdx++;
              tw.timer = 0;
              // Build new targets for current prefix
              const prefix = tw.text.substring(0, tw.charIdx);
              if (prefix.length > 0) {
                const charW = w / tw.text.length;
                const cx = charW * (tw.charIdx - 1) + charW * 0.5;
                const cy = h / 2;
                targetsRef.current = buildCharTargets(prefix[prefix.length - 1], particles.length, w, h, Math.max(0, cx - charW * 0.4), cy - h * 0.2, charW * 0.8, h * 0.4);
              }
            }
            // If done, wait then reset
            if (tw.charIdx >= tw.text.length) {
              tw.timer++;
              if (tw.timer > 100) {
                const texts = TYPEWRITER_TEXTS[lang] || TYPEWRITER_TEXTS.en;
                tw.text = texts[Math.floor(Math.random() * texts.length)];
                tw.charIdx = 0; tw.timer = 0;
                particles.forEach(p => { p.x = Math.random() * w; p.y = Math.random() * h; p.vx = 0; p.vy = 0; });
              }
            }
            // Move particles toward targets (like mode 1 but per-character)
            const target = targetsRef.current[i];
            if (target) {
              const tdx = target.x - p.x, tdy = target.y - p.y;
              const dt = Math.sqrt(tdx * tdx + tdy * tdy);
              if (dt > 0.5) { const af = 0.02 + Math.min(dt * 0.001, 0.05); p.vx += tdx * af; p.vy += tdy * af; }
            } else {
              // Particles without target drift
              p.vx += (Math.random() - 0.5) * 0.3; p.vy += (Math.random() - 0.5) * 0.3;
            }
            p.vx *= 0.9; p.vy *= 0.9;
            break;
          }
        }

        // Slow random hue drift for color variation
        p.hue = (p.hue + (Math.random() - 0.5) * 0.4) % 360;

        // Transition chaos
        const trans = transitionRef.current;
        if (trans > 0) {
          const tf = trans / 75;
          p.vx += (Math.random() - 0.5) * tf * 0.6;
          p.vy += (Math.random() - 0.5) * tf * 0.6;
          p.vx *= 0.96; p.vy *= 0.96;
        }

        const isPositionMode = modeRef.current === 4 || modeRef.current === 6 || modeRef.current === 7 || modeRef.current === 11 || modeRef.current === 13 || modeRef.current === 19 || modeRef.current === 20;
        if (!isPositionMode || trans > 0) {
          p.x += p.vx;
          p.y += p.vy;
        }

        if (trans > 0) transitionRef.current--;

        // Draw — modes that self-draw skip (none currently)
        const selfDraw = modeRef.current === 19; // DNA draws its own rungs
        if (modeRef.current === 19 && i % 3 !== 0) { /* rung drawing is handled in case above */ }

        const isScattered = (() => {
          const dx = mx - p.x, dy = my - p.y;
          return Math.sqrt(dx * dx + dy * dy) < 160;
        })();

        const alpha = isScattered ? 0.95 : (modeRef.current === 0 ? 0.85 : 0.65);
        const hsl = isDark
          ? `hsla(${p.hue}, 80%, 70%, `
          : `hsla(${p.hue}, 70%, 50%, `;

        const transBoost = trans > 0 ? 1 + (trans / 75) * 0.8 : 1;
        const gr = p.r * (isScattered ? 5.5 : 3.0) * transBoost;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
        glow.addColorStop(0, hsl + alpha + ')');
        glow.addColorStop(0.5, hsl + (alpha * 0.25) + ')');
        glow.addColorStop(1, hsl + '0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = hsl + Math.min(1, alpha + 0.25) + ')';
        ctx.fill();

        // Connections in relevant modes
        if (!isScattered && i % 3 === 0 && [0, 1, 7, 9, 10, 17, 18].includes(modeRef.current)) {
          const p2 = particles[Math.max(0, i - 3)];
          const ddx = p.x - p2.x, ddy = p.y - p2.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          let maxD = 80;
          if (modeRef.current === 1) maxD = 50;
          else if (modeRef.current === 10) maxD = 100;
          else if (modeRef.current === 17) maxD = 90;
          else if (modeRef.current === 18) maxD = 45;
          if (dd < maxD) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            const connAlpha = modeRef.current === 10 ? 0.25 : (modeRef.current === 18 ? 0.3 : 0.15);
            ctx.strokeStyle = isDark
              ? `rgba(140,200,255,${connAlpha * (1 - dd / maxD)})`
              : `rgba(40,80,160,${connAlpha * 0.7 * (1 - dd / maxD)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [theme, lang, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}
