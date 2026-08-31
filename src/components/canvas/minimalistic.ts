import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawContainImage, drawCoverImage } from '../../utils/canvasUtils';

export const renderMinimalistic = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  const colors: Record<string, string> = {
    midnight: '#EAEAEA', crimson: '#F0F0F0', obsidian: '#FFFFFF',
    corporate: '#F4F4F4', digital: '#E8E8E8', emerald: '#F2F5F3',
  };
  ctx.fillStyle = colors[props.bgStyle] || '#F5F5F5';
  ctx.fillRect(0, 0, width, height);

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

  const textRegion = isPortrait
    ? { x: padX + (props.textX || 0), y: topY + 40 + (props.textY || 0), w: width - (padX * 2), h: (botY - topY) * 0.5 - 40 }
    : { x: padX + (props.textX || 0), y: topY + 40 + (props.textY || 0), w: width * 0.5, h: botY - topY - 80 };

  const imageRegion = isPortrait
    ? { x: padX, y: botY - (botY - topY) * 0.4, w: width - (padX * 2), h: (botY - topY) * 0.4 }
    : { x: width * 0.6, y: topY, w: width * 0.4 - padX, h: botY - topY };

  ctx.fillStyle = '#111111';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const lScale = props.logoScale || 1;
      const lx = props.logoX || 0;
      const ly = props.logoY || 0;
      ctx.save();
      ctx.translate(textRegion.x + lx + (120*lScale)/2, 20 + ly + (120*lScale)/2);
      ctx.scale(lScale, lScale);
      drawContainImage(ctx, logo, -60, -60, 120, 120, 'left', 'top');
      ctx.restore();
    } catch (e) {}
  }

  let currentY = textRegion.y;
  const tScale = props.textScale || 1;

  if (props.category) {
    ctx.font = '800 ' + (24 * tScale) + 'px "Inter", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(props.category.toUpperCase(), textRegion.x, currentY);
    ctx.letterSpacing = '0px';
    currentY += 40 * tScale;
  }

  let titleSize = isPortrait ? 65 : 80;
  if (props.title.length > 40) titleSize = isPortrait ? 50 : 65;
  titleSize *= tScale;
  ctx.font = '900 ' + titleSize + 'px "Inter", sans-serif';
  currentY = wrapText(ctx, props.title, textRegion.x, currentY, textRegion.w, titleSize * 1.1) + 20 * tScale;

  if (props.subtitle) {
    ctx.font = '500 ' + (32 * tScale) + 'px "Inter", sans-serif';
    ctx.fillStyle = '#666666';
    currentY = wrapText(ctx, props.subtitle, textRegion.x, currentY, textRegion.w, 44 * tScale) + 30 * tScale;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    let px = textRegion.x;
    let py = currentY;
    ctx.textBaseline = 'middle';
    pills.forEach((pill: string) => {
      ctx.font = '600 ' + (18 * tScale) + 'px "Inter", sans-serif';
      const m = ctx.measureText(pill);
      if (px + m.width + 30 * tScale > textRegion.x + textRegion.w) {
        px = textRegion.x; py += 45 * tScale;
      }
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py - 18 * tScale, m.width + 24 * tScale, 36 * tScale);
      ctx.fillStyle = '#111111';
      ctx.fillText(pill, px + 12 * tScale, py);
      px += m.width + 40 * tScale;
    });
  }

  ctx.fillStyle = props.bgStyle === 'crimson' ? '#D93025' : props.bgStyle === 'digital' ? '#00E5FF' : '#111111';
  ctx.fillRect(padX, topY - 10, 80, 10);

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = props.speakerScale || 1;
      const sx = props.speakerX || 0;
      const sy = props.speakerY || 0;
      ctx.save();
      ctx.beginPath();
      ctx.rect(imageRegion.x, imageRegion.y, imageRegion.w, imageRegion.h);
      ctx.clip();
      ctx.translate(imageRegion.x + imageRegion.w/2 + sx, imageRegion.y + imageRegion.h/2 + sy);
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -imageRegion.w/2, -imageRegion.h/2, imageRegion.w, imageRegion.h, 'center', 'center');
      ctx.restore();
      
      ctx.font = '600 16px "Inter", sans-serif';
      ctx.fillStyle = '#111';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText((props.speakerName || 'FIG. 1').toUpperCase(), imageRegion.x, imageRegion.y - 10);
    } catch(e) {}
  }
};
