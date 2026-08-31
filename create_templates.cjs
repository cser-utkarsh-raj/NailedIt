const fs = require('fs');

// 1. Professional Template (Adapted from legacy logic)
const professionalTemplate = `
import { loadImage, wrapText } from '../ThumbnailCanvas';

export const renderProfessional = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: any) => {
  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (props.bgStyle === 'navy') {
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e3a8a');
  } else if (props.bgStyle === 'rbi') {
    gradient.addColorStop(0, '#4a0404');
    gradient.addColorStop(1, '#7f1d1d');
  } else {
    gradient.addColorStop(0, '#111827');
    gradient.addColorStop(1, '#374151');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Geometric Accents
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(width, height);
  ctx.lineTo(width * 0.6, height);
  ctx.fill();

  // Branding text
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(props.brandName?.toUpperCase() || '', 60, 60);

  // Category
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(props.category?.toUpperCase() || '', 60, 110);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px serif';
  const nextY = wrapText(ctx, props.title || '', 60, 200, width * 0.6, 74);

  // Subtitle
  if (props.subtitle) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '32px sans-serif';
    wrapText(ctx, props.subtitle, 60, nextY + 20, width * 0.6, 42);
  }

  // Key pills
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split('•').map((p: string) => p.trim());
    let px = 60;
    const py = height - 80;
    pills.forEach((pill: string) => {
      ctx.font = 'bold 16px sans-serif';
      const m = ctx.measureText(pill);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(px, py - 24, m.width + 32, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(pill, px + 16, py);
      px += m.width + 48;
    });
  }

  // Images
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      ctx.drawImage(logo, width - 120, 30, 80, 80);
    } catch (e) {}
  }

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(width - 200, height / 2 + 50, 150, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(speaker, width - 350, height / 2 - 100, 300, 300);
      ctx.restore();
      
      // Speaker Border
      ctx.beginPath();
      ctx.arc(width - 200, height / 2 + 50, 150, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Speaker Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(props.speakerName || '', width - 200, height - 80);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '20px sans-serif';
      ctx.fillText(props.speakerRole || '', width - 200, height - 50);
    } catch (e) {}
  }
};
`;

// 2. Ethereal Template
const etherealTemplate = `
import { loadImage, wrapText } from '../ThumbnailCanvas';

export const renderEthereal = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: any) => {
  // Soft, airy background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#fdfbfb');
  gradient.addColorStop(1, '#ebedee');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Soft glowing orb in the center
  const radial = ctx.createRadialGradient(width * 0.7, height * 0.4, 0, width * 0.7, height * 0.4, 600);
  radial.addColorStop(0, 'rgba(235, 204, 219, 0.4)');
  radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // Layout centered for Ethereal
  ctx.textAlign = 'center';

  // Category
  ctx.fillStyle = '#a1a1aa'; // Zinc 400
  ctx.font = '300 18px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText(props.category?.toUpperCase() || '', width / 2, height * 0.25);
  ctx.letterSpacing = '0px';

  // Title (Elegant Serif)
  ctx.fillStyle = '#3f3f46'; // Zinc 700
  ctx.font = 'italic 400 72px "Playfair Display", serif';
  let nextY = wrapText(ctx, props.title || '', width / 2, height * 0.45, width * 0.8, 85);

  // Subtitle
  if (props.subtitle) {
    ctx.fillStyle = '#71717a'; // Zinc 500
    ctx.font = '300 32px sans-serif';
    wrapText(ctx, props.subtitle, width / 2, nextY + 30, width * 0.7, 45);
  }

  // Branding
  ctx.fillStyle = '#d4d4d8';
  ctx.font = '300 16px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(props.brandName?.toUpperCase() || '', width / 2, height - 40);

  ctx.textAlign = 'left'; // reset
};
`;

// 3. Bohemian Template
const bohemianTemplate = `
import { loadImage, wrapText } from '../ThumbnailCanvas';

export const renderBohemian = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: any) => {
  // Earthy background
  ctx.fillStyle = '#e8dfd5'; // Warm sand
  ctx.fillRect(0, 0, width, height);

  // Arch shape framing the left
  ctx.fillStyle = '#d9c5b2';
  ctx.beginPath();
  ctx.arc(300, height, 400, Math.PI, 0);
  ctx.fill();

  // Terracotta accent arch top right
  ctx.fillStyle = '#a97155'; // Terracotta
  ctx.beginPath();
  ctx.arc(width - 150, 0, 250, 0, Math.PI);
  ctx.fill();

  ctx.textAlign = 'left';

  // Category
  ctx.fillStyle = '#5c4a3d';
  ctx.font = 'bold 20px sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(props.category?.toUpperCase() || '', 80, height * 0.25);
  ctx.letterSpacing = '0px';

  // Title (Organic Serif)
  ctx.fillStyle = '#3a2e25';
  ctx.font = '600 76px "Georgia", serif';
  let nextY = wrapText(ctx, props.title || '', 80, height * 0.4, width * 0.6, 85);

  // Subtitle
  if (props.subtitle) {
    ctx.fillStyle = '#6b5744';
    ctx.font = 'italic 34px "Georgia", serif';
    wrapText(ctx, props.subtitle, 80, nextY + 20, width * 0.6, 45);
  }

  // Speaker Image mapped into an arch or circle
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(width - 250, height * 0.6, 180, 250, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(speaker, width - 450, height * 0.2, 400, 500);
      ctx.restore();
      
      // Frame around image
      ctx.beginPath();
      ctx.ellipse(width - 250, height * 0.6, 180, 250, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#f4f1ea';
      ctx.lineWidth = 12;
      ctx.stroke();
    } catch (e) {}
  }
};
`;

// 4. Minimalistic Template
const minimalisticTemplate = `
import { loadImage, wrapText } from '../ThumbnailCanvas';

export const renderMinimalistic = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: any) => {
  // Flat vibrant/clean color block
  ctx.fillStyle = '#fceabb'; // Default warm vibrant minimal
  if (props.style === 'navy') ctx.fillStyle = '#1e3a8a';
  else if (props.style === 'dark') ctx.fillStyle = '#09090b';
  
  ctx.fillRect(0, 0, width, height);

  const isDarkBg = ['navy', 'dark', 'rbi'].includes(props.style);
  const primaryText = isDarkBg ? '#ffffff' : '#18181b';
  const secondaryText = isDarkBg ? '#a1a1aa' : '#52525b';
  const accentColor = isDarkBg ? '#3b82f6' : '#2563eb';

  // Large geometric minimal block
  ctx.fillStyle = isDarkBg ? '#18181b' : '#ffffff';
  ctx.fillRect(60, 60, width - 120, height - 120);

  ctx.textAlign = 'left';

  // Category
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 20px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(props.category?.toUpperCase() || '', 120, 160);
  ctx.letterSpacing = '0px';

  // Title (Crisp, clean Sans)
  ctx.fillStyle = primaryText;
  ctx.font = '900 80px "Inter", sans-serif';
  let nextY = wrapText(ctx, props.title || '', 120, 260, width - 240, 90);

  // Subtitle
  if (props.subtitle) {
    ctx.fillStyle = secondaryText;
    ctx.font = '400 36px "Inter", sans-serif';
    wrapText(ctx, props.subtitle, 120, nextY + 30, width - 240, 50);
  }
  
  // Minimalist logo bottom right
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      ctx.drawImage(logo, width - 200, height - 200, 80, 80);
    } catch (e) {}
  }
};
`;

// 5. YouTube Bold Template
const youtubeBoldTemplate = `
import { loadImage, wrapText } from '../ThumbnailCanvas';

export const renderYoutubeBold = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: any) => {
  // High contrast background
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);
  
  // Bright neon angled slash
  ctx.fillStyle = '#fbbf24'; // Warning yellow
  ctx.beginPath();
  ctx.moveTo(width * 0.4, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, height);
  ctx.lineTo(width * 0.2, height);
  ctx.fill();

  // Face/Image on the right
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      // Draw massive face on right side
      ctx.drawImage(speaker, width * 0.35, 0, width * 0.65, height);
    } catch (e) {}
  }

  // Dark overlay gradient on left for text readability
  const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
  gradient.addColorStop(0, 'rgba(0,0,0,0.9)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'left';

  // Title (Massive Impact)
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 96px "Impact", sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  let nextY = wrapText(ctx, props.title?.toUpperCase() || '', 60, 200, width * 0.6, 100);

  // Reset shadow for subtitle box
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Subtitle (High contrast box)
  if (props.subtitle) {
    ctx.fillStyle = '#ef4444'; // Bright red
    ctx.fillRect(60, nextY + 20, width * 0.5, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(props.subtitle, 80, nextY + 62);
  }
};
`;

// 6. Tech SaaS Template
const techSaasTemplate = `
import { loadImage, wrapText } from '../ThumbnailCanvas';

export const renderTechSaaS = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: any) => {
  // Dark tech background
  ctx.fillStyle = '#0f172a'; // Slate 900
  ctx.fillRect(0, 0, width, height);

  // Grid pattern
  ctx.strokeStyle = '#1e293b'; // Slate 800
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Abstract shapes
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, 'rgba(56, 189, 248, 0.2)'); // Light Blue
  grad.addColorStop(1, 'rgba(139, 92, 246, 0.2)'); // Purple
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(width * 0.5, height);
  ctx.lineTo(width, height * 0.2);
  ctx.lineTo(width, height);
  ctx.fill();

  ctx.textAlign = 'left';

  // Pill for category
  ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
  ctx.beginPath();
  ctx.roundRect(80, 80, 240, 40, 20);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(props.category?.toUpperCase() || '', 100, 105);

  // Title (Clean Modern)
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 72px "Inter", sans-serif';
  let nextY = wrapText(ctx, props.title || '', 80, 200, width * 0.7, 85);

  // Subtitle
  if (props.subtitle) {
    ctx.fillStyle = '#94a3b8'; // Slate 400
    ctx.font = '400 32px sans-serif';
    wrapText(ctx, props.subtitle, 80, nextY + 30, width * 0.6, 45);
  }

  // Key pills (Tech style)
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split('•').map((p: string) => p.trim());
    let px = 80;
    const py = height - 100;
    pills.forEach((pill: string) => {
      ctx.font = 'bold 16px sans-serif';
      const m = ctx.measureText(pill);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(px, py - 24, m.width + 32, 36, 6);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(pill, px + 16, py);
      px += m.width + 48;
    });
  }
};
`;

fs.writeFileSync('src/components/canvas/professional.ts', professionalTemplate);
fs.writeFileSync('src/components/canvas/ethereal.ts', etherealTemplate);
fs.writeFileSync('src/components/canvas/bohemian.ts', bohemianTemplate);
fs.writeFileSync('src/components/canvas/minimalistic.ts', minimalisticTemplate);
fs.writeFileSync('src/components/canvas/youtubeBold.ts', youtubeBoldTemplate);
fs.writeFileSync('src/components/canvas/techSaas.ts', techSaasTemplate);
