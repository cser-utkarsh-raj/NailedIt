const fs = require('fs');

const professional = `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

export const renderProfessional = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (props.bgStyle === 'midnight') {
    gradient.addColorStop(0, '#0f172a'); gradient.addColorStop(1, '#1e3a8a');
  } else if (props.bgStyle === 'crimson') {
    gradient.addColorStop(0, '#4a0404'); gradient.addColorStop(1, '#7f1d1d');
  } else {
    gradient.addColorStop(0, '#111827'); gradient.addColorStop(1, '#374151');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Geometric Accents
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath();
  if (isPortrait) {
    ctx.moveTo(0, height * 0.4); ctx.lineTo(width, height * 0.4); ctx.lineTo(width, height); ctx.lineTo(0, height);
  } else {
    ctx.moveTo(width, 0); ctx.lineTo(width, height); ctx.lineTo(width * 0.5, height);
  }
  ctx.fill();

  const padX = isPortrait ? 40 : 60;
  let textY = isPortrait ? 80 : 200;
  const maxW = isPortrait ? width - 80 : width * 0.55;

  ctx.textAlign = 'left';

  // Branding text
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(props.brandName?.toUpperCase() || '', padX, isPortrait ? 50 : 60);

  // Category
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(props.category?.toUpperCase() || '', padX, isPortrait ? 100 : 110);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px serif';
  const nextY = wrapText(ctx, props.title || '', padX, isPortrait ? 160 : 200, maxW, 74);

  // Subtitle
  let finalY = nextY;
  if (props.subtitle) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '32px sans-serif';
    finalY = wrapText(ctx, props.subtitle, padX, nextY + 20, maxW, 42);
  }

  // Key pills
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    let px = padX;
    const py = isPortrait ? finalY + 50 : height - 80;
    pills.forEach((pill: string) => {
      ctx.font = 'bold 16px sans-serif';
      const m = ctx.measureText(pill);
      if (px + m.width + 48 > width && isPortrait) return; // simple overflow prevention
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
      drawContainImage(ctx, logo, width - 140, 30, 100, 100, 'right', 'top');
    } catch (e) {}
  }

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      
      const cx = isPortrait ? width / 2 : width * 0.75;
      const cy = isPortrait ? height * 0.75 : height / 2 + 30;
      const r = isPortrait ? width * 0.35 : 180;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      drawCoverImage(ctx, speaker, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
      
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(props.speakerName || '', cx, cy + r + 40);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '20px sans-serif';
      ctx.fillText(props.speakerRole || '', cx, cy + r + 70);
    } catch (e) {}
  }
};`;
fs.writeFileSync('src/components/canvas/professional.ts', professional);

const minimalistic = `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

export const renderMinimalistic = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  // Base Color
  const colors: Record<string, string> = {
    midnight: '#EAEAEA', crimson: '#F0F0F0', obsidian: '#FFFFFF',
    corporate: '#F4F4F4', digital: '#E8E8E8', emerald: '#F2F5F3',
  };
  ctx.fillStyle = colors[props.bgStyle] || '#F5F5F5';
  ctx.fillRect(0, 0, width, height);

  // Swiss Grid Lines
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const padX = width * 0.08;
  const topY = height * 0.12;
  const botY = height * 0.88;
  
  ctx.moveTo(padX, 0); ctx.lineTo(padX, height);
  ctx.moveTo(width - padX, 0); ctx.lineTo(width - padX, height);
  ctx.moveTo(0, topY); ctx.lineTo(width, topY);
  ctx.moveTo(0, botY); ctx.lineTo(width, botY);
  ctx.stroke();

  // Accent Dot/Line
  ctx.fillStyle = props.bgStyle === 'crimson' ? '#D93025' : props.bgStyle === 'digital' ? '#00E5FF' : '#111111';
  ctx.fillRect(padX, topY, 60, 10);

  // Text
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Category
  ctx.font = '800 24px "Inter", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText(props.category.toUpperCase(), padX, topY + 40);
  ctx.letterSpacing = '0px';

  // Huge Title
  ctx.font = '900 90px "Inter", sans-serif';
  let titleY = topY + 120;
  const maxW = isPortrait ? width - (padX * 2) : width * 0.55;
  
  const nextY = wrapText(ctx, props.title, padX, titleY, maxW, 100);

  // Subtitle
  ctx.font = '500 32px "Inter", sans-serif';
  ctx.fillStyle = '#666666';
  wrapText(ctx, props.subtitle, padX, nextY + 40, maxW, 40);

  // Images
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, width - padX - 80, 20, 80, 80, 'right', 'center');
    } catch (e) {}
  }

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const iw = isPortrait ? width - (padX * 2) : width * 0.35;
      const ih = isPortrait ? height * 0.35 : botY - topY;
      const ix = isPortrait ? padX : width - padX - iw;
      const iy = isPortrait ? botY - ih : topY;

      ctx.save();
      ctx.beginPath();
      ctx.rect(ix, iy, iw, ih);
      ctx.clip();
      drawCoverImage(ctx, speaker, ix, iy, iw, ih);
      ctx.restore();
      
      // Swiss caption
      ctx.font = '600 16px "Inter", sans-serif';
      ctx.fillStyle = '#111';
      ctx.fillText((props.speakerName || 'FIG. 1').toUpperCase(), ix, iy - 24);
    } catch(e) {}
  }
};`;
fs.writeFileSync('src/components/canvas/minimalistic.ts', minimalistic);

