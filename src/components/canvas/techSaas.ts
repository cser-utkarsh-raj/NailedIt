import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawContainImage, drawCoverImage } from '../../utils/canvasUtils';

export const renderTechSaaS = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  ctx.fillStyle = '#0A0A0F';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  const gridSize = 50;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  let accent = '#6366F1';
  if (props.bgStyle === 'digital') accent = '#06B6D4';
  if (props.bgStyle === 'emerald') accent = '#10B981';
  if (props.bgStyle === 'crimson') accent = '#F43F5E';
  
  const cx = isPortrait ? width / 2 : width * 0.8;
  const cy = isPortrait ? height * 0.2 : height * 0.5;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, isPortrait ? width : 600);
  gradient.addColorStop(0, accent + '40');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const imageRegion = isPortrait
    ? { x: width * 0.05, y: height * 0.05, w: width * 0.9, h: height * 0.45 }
    : { x: width * 0.55, y: height * 0.1, w: width * 0.4, h: height * 0.8 };

  const textRegion = isPortrait
    ? { x: width * 0.05 + (props.textX||0), y: height * 0.55 + (props.textY||0), w: width * 0.9, h: height * 0.4 }
    : { x: width * 0.05 + (props.textX||0), y: height * 0.15 + (props.textY||0), w: width * 0.45, h: height * 0.7 };

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = props.speakerScale || 1;
      ctx.save();
      ctx.beginPath();
      ctx.rect(imageRegion.x, imageRegion.y, imageRegion.w, imageRegion.h);
      ctx.clip();
      ctx.translate(imageRegion.x + imageRegion.w/2 + (props.speakerX||0), imageRegion.y + imageRegion.h/2 + (props.speakerY||0));
      ctx.scale(sScale, sScale);
      drawContainImage(ctx, speaker, -imageRegion.w/2, -imageRegion.h/2, imageRegion.w, imageRegion.h, 'center', 'bottom');
      ctx.restore();
    } catch(e) {}
  }

  ctx.fillStyle = 'rgba(15,15,20,0.7)';
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(textRegion.x, textRegion.y, textRegion.w, textRegion.h, 24);
  ctx.fill();
  ctx.stroke();

  let currentY = textRegion.y + 40;
  const padX = textRegion.x + 40;
  const maxW = textRegion.w - 80;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  const tScale = props.textScale || 1;

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const lScale = props.logoScale || 1;
      ctx.save();
      ctx.translate(padX + (props.logoX||0) + (120*lScale)/2, currentY + (props.logoY||0) + (120*lScale)/2);
      ctx.scale(lScale, lScale);
      drawContainImage(ctx, logo, -60, -60, 120, 120, 'left', 'top');
      ctx.restore();
      currentY += 140 * lScale;
    } catch(e) {}
  }

  if (props.category) {
    ctx.fillStyle = accent + '30';
    ctx.beginPath();
    ctx.font = '600 ' + (18 * tScale) + 'px "SF Pro Display", sans-serif';
    const catW = ctx.measureText(props.category.toUpperCase()).width + 40 * tScale;
    ctx.roundRect(padX, currentY, catW, 36 * tScale, 18 * tScale);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.fillText(props.category.toUpperCase(), padX + 20 * tScale, currentY + 8 * tScale);
    currentY += 60 * tScale;
  }

  let titleSize = isPortrait ? 50 : 65;
  if (props.title.length > 35) titleSize = isPortrait ? 40 : 50;
  titleSize *= tScale;
  ctx.font = '800 ' + titleSize + 'px "SF Pro Display", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  currentY = wrapText(ctx, props.title, padX, currentY, maxW, titleSize * 1.1) + 20 * tScale;

  if (props.subtitle) {
    ctx.font = '400 ' + (30 * tScale) + 'px "SF Pro Display", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    currentY = wrapText(ctx, props.subtitle, padX, currentY, maxW, 40 * tScale) + 30 * tScale;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    let px = padX;
    let py = currentY;
    ctx.font = '500 ' + (16 * tScale) + 'px "SF Pro Display", sans-serif';
    ctx.textBaseline = 'middle';
    pills.forEach((pill: string) => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 * tScale > padX + maxW) {
        px = padX; py += 40 * tScale;
      }
      ctx.strokeStyle = accent + '80';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(px, py - 16 * tScale, m.width + 24 * tScale, 32 * tScale, 8 * tScale);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(pill, px + 12 * tScale, py);
      px += m.width + 34 * tScale;
    });
  }
};
