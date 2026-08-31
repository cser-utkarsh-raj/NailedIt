const fs = require('fs');

// Minimalistic (Swiss Style, ultra clean typography)
const minimalistic = `import { CanvasTemplateProps } from '../../types';

export const drawMinimalistic = (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  // Background
  if (props.customOverlayImage) {
    // We expect the image to be loaded elsewhere and passed, but for now we'll just use colors
    // In a real app we'd need an Image object.
  }

  // Base Color
  const colors: Record<string, string> = {
    midnight: '#F5F5F5',
    crimson: '#EAEAEA',
    obsidian: '#FFFFFF',
    corporate: '#F0F0F0',
    digital: '#E8E8E8',
    emerald: '#F2F5F3',
  };
  
  ctx.fillStyle = colors[props.bgStyle] || '#F5F5F5';
  ctx.fillRect(0, 0, width, height);

  // Swiss Grid Lines
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, 0); ctx.lineTo(width * 0.1, height);
  ctx.moveTo(width * 0.9, 0); ctx.lineTo(width * 0.9, height);
  ctx.moveTo(0, height * 0.15); ctx.lineTo(width, height * 0.15);
  ctx.moveTo(0, height * 0.85); ctx.lineTo(width, height * 0.85);
  ctx.stroke();

  // Accent Dot/Line
  ctx.fillStyle = props.bgStyle === 'crimson' ? '#D93025' : props.bgStyle === 'digital' ? '#00E5FF' : '#111111';
  ctx.fillRect(width * 0.1, height * 0.15, 60, 10);

  // Text
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Category
  ctx.font = '800 32px "Inter", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText(props.category.toUpperCase(), width * 0.1, height * 0.25);
  ctx.letterSpacing = '0px';

  // Huge Title
  ctx.font = '900 110px "Inter", sans-serif';
  let titleY = height * 0.4;
  const words = props.title.split(' ');
  let line = '';
  const maxW = width * 0.75;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxW && i > 0) {
      ctx.fillText(line, width * 0.1, titleY);
      line = words[i] + ' ';
      titleY += 120;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width * 0.1, titleY);

  // Subtitle
  ctx.font = '500 36px "Inter", sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText(props.subtitle, width * 0.1, titleY + 140);
};`;
fs.writeFileSync('src/components/canvas/minimalistic.ts', minimalistic);

// YouTube Bold (High contrast, skewed, heavy)
const youtubeBold = `import { CanvasTemplateProps } from '../../types';

export const drawYoutubeBold = (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  // Background
  const isDark = ['midnight', 'obsidian', 'crimson'].includes(props.bgStyle);
  const bgColor = isDark ? '#111111' : '#E8E8E8';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  let accent = '#FFED00'; // Default yellow
  if (props.bgStyle === 'digital') accent = '#00FFFF';
  if (props.bgStyle === 'crimson') accent = '#FF003C';
  if (props.bgStyle === 'emerald') accent = '#00FF66';

  // Background Gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, isDark ? '#000000' : '#CCCCCC');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Speed Lines / Burst
  ctx.save();
  ctx.translate(width / 2, height / 2);
  for (let i = 0; i < 20; i++) {
    ctx.rotate(Math.PI / 10);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, -50);
    ctx.lineTo(width, 50);
    ctx.fill();
  }
  ctx.restore();

  // Skewed Transform for Text
  ctx.save();
  ctx.translate(width * 0.05, height * 0.2);
  ctx.transform(1, 0, -0.15, 1, 0, 0); // Skew X

  // Category Label
  ctx.fillStyle = textPrimary;
  ctx.fillRect(0, 0, ctx.measureText(props.category).width + 80, 50);
  ctx.font = '900 30px "Montserrat", sans-serif';
  ctx.fillStyle = isDark ? '#000000' : '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(props.category.toUpperCase(), 20, 10);

  // Huge Title with heavy stroke
  ctx.font = '900 130px "Montserrat", sans-serif';
  let titleY = 80;
  const words = props.title.split(' ');
  let line = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width * 0.7 && i > 0) {
      // Stroke
      ctx.lineWidth = 15;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(line, 0, titleY);
      // Fill
      ctx.fillStyle = textPrimary;
      ctx.fillText(line, 0, titleY);
      line = words[i] + ' ';
      titleY += 130;
    } else {
      line = testLine;
    }
  }
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#000000';
  ctx.strokeText(line, 0, titleY);
  ctx.fillStyle = textPrimary;
  ctx.fillText(line, 0, titleY);

  // Subtitle with Accent Background
  ctx.font = '900 50px "Montserrat", sans-serif';
  titleY += 150;
  ctx.fillStyle = accent;
  ctx.fillRect(-10, titleY - 10, ctx.measureText(props.subtitle).width + 40, 80);
  ctx.fillStyle = '#000000';
  ctx.fillText(props.subtitle, 10, titleY + 5);

  ctx.restore();
};`;
fs.writeFileSync('src/components/canvas/youtubeBold.ts', youtubeBold);

// Tech SaaS (Dark mode, glow, neon, tech)
const techSaas = `import { CanvasTemplateProps } from '../../types';

export const drawTechSaas = (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  // Always dark background for Tech SaaS
  ctx.fillStyle = '#0A0A0F';
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  const gridSize = 50;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Glowing Orb
  let accent = '#6366F1'; // Indigo
  if (props.bgStyle === 'digital') accent = '#06B6D4';
  if (props.bgStyle === 'emerald') accent = '#10B981';
  if (props.bgStyle === 'crimson') accent = '#F43F5E';
  
  const gradient = ctx.createRadialGradient(width * 0.8, height * 0.5, 0, width * 0.8, height * 0.5, 600);
  gradient.addColorStop(0, \`\${accent}40\`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Glassmorphism Card
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(width * 0.05, height * 0.15, width * 0.6, height * 0.7, 24);
  ctx.fill();
  ctx.stroke();

  // Content inside card
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Category Pill
  ctx.fillStyle = \`\${accent}30\`;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height * 0.22, ctx.measureText(props.category).width + 120, 40, 20);
  ctx.fill();
  
  ctx.font = '600 20px "SF Pro Display", sans-serif';
  ctx.fillStyle = accent;
  ctx.fillText(props.category.toUpperCase(), width * 0.08 + 20, height * 0.22 + 10);

  // Title
  ctx.font = '800 80px "SF Pro Display", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  let titleY = height * 0.35;
  const words = props.title.split(' ');
  let line = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width * 0.5 && i > 0) {
      ctx.fillText(line, width * 0.08, titleY);
      line = words[i] + ' ';
      titleY += 90;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width * 0.08, titleY);

  // Subtitle
  ctx.font = '400 36px "SF Pro Display", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(props.subtitle, width * 0.08, titleY + 110);
};`;
fs.writeFileSync('src/components/canvas/techSaas.ts', techSaas);

// Ethereal (Soft gradients, blur, elegant)
const ethereal = `import { CanvasTemplateProps } from '../../types';

export const drawEthereal = (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  // Soft Gradient Mesh Background
  const grad1 = ctx.createLinearGradient(0, 0, width, height);
  if (props.bgStyle === 'obsidian' || props.bgStyle === 'midnight') {
    grad1.addColorStop(0, '#1E1B4B');
    grad1.addColorStop(1, '#0F172A');
  } else if (props.bgStyle === 'emerald') {
    grad1.addColorStop(0, '#ECFDF5');
    grad1.addColorStop(1, '#D1FAE5');
  } else if (props.bgStyle === 'crimson') {
    grad1.addColorStop(0, '#FFF1F2');
    grad1.addColorStop(1, '#FFE4E6');
  } else {
    grad1.addColorStop(0, '#F8FAFC');
    grad1.addColorStop(1, '#E2E8F0');
  }
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, width, height);

  const isDark = ['obsidian', 'midnight'].includes(props.bgStyle);
  const textColor = isDark ? '#F8FAFC' : '#0F172A';

  // Centered Content
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Category
  ctx.font = '300 24px "Playfair Display", serif';
  ctx.letterSpacing = '12px';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)';
  ctx.fillText(props.category.toUpperCase(), width / 2, height * 0.3);
  ctx.letterSpacing = '0px';

  // Title
  ctx.font = 'italic 400 90px "Playfair Display", serif';
  ctx.fillStyle = textColor;
  ctx.fillText(props.title, width / 2, height * 0.5);

  // Subtitle
  ctx.font = '300 32px "Inter", sans-serif';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  ctx.fillText(props.subtitle, width / 2, height * 0.65);
};`;
fs.writeFileSync('src/components/canvas/ethereal.ts', ethereal);

// Bohemian (Earthy, rustic, borders)
const bohemian = `import { CanvasTemplateProps } from '../../types';

export const drawBohemian = (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  // Warm earthy colors
  const bgColor = props.bgStyle === 'emerald' ? '#E9E4D4' : '#F5F0E6';
  const strokeColor = '#8C6E53';
  const textColor = '#3A2E24';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Double Border
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Center alignment
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Arch Shape behind text
  ctx.fillStyle = 'rgba(140, 110, 83, 0.05)';
  ctx.beginPath();
  ctx.moveTo(width / 2 - 300, height);
  ctx.lineTo(width / 2 - 300, height * 0.4);
  ctx.arc(width / 2, height * 0.4, 300, Math.PI, 0);
  ctx.lineTo(width / 2 + 300, height);
  ctx.fill();

  // Category
  ctx.font = '400 24px "Cormorant Garamond", serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = strokeColor;
  ctx.fillText(props.category.toUpperCase(), width / 2, height * 0.25);
  ctx.letterSpacing = '0px';

  // Title
  ctx.font = '600 80px "Cormorant Garamond", serif';
  ctx.fillStyle = textColor;
  let titleY = height * 0.4;
  const words = props.title.split(' ');
  let line = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 700 && i > 0) {
      ctx.fillText(line, width / 2, titleY);
      line = words[i] + ' ';
      titleY += 90;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width / 2, titleY);

  // Subtitle
  ctx.font = 'italic 400 36px "Cormorant Garamond", serif';
  ctx.fillStyle = '#6B5A4B';
  ctx.fillText(props.subtitle, width / 2, titleY + 110);
};`;
fs.writeFileSync('src/components/canvas/bohemian.ts', bohemian);

