import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawContainImage, drawCoverImage } from '../../utils/canvasUtils';

export const renderProfessional = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (props.bgStyle === 'midnight') {
    gradient.addColorStop(0, '#0f172a'); gradient.addColorStop(1, '#1e3a8a');
  } else if (props.bgStyle === 'crimson') {
    gradient.addColorStop(0, '#4a0404'); gradient.addColorStop(1, '#7f1d1d');
  } else if (props.bgStyle === 'obsidian') {
    gradient.addColorStop(0, '#0a0a0a'); gradient.addColorStop(1, '#171717');
  } else {
    gradient.addColorStop(0, '#111827'); gradient.addColorStop(1, '#374151');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath();
  if (isPortrait) {
    ctx.moveTo(0, height * 0.4); ctx.lineTo(width, height * 0.4); ctx.lineTo(width, height); ctx.lineTo(0, height);
  } else {
    ctx.moveTo(width, 0); ctx.lineTo(width, height); ctx.lineTo(width * 0.5, height);
  }
  ctx.fill();

  const textRegion = isPortrait 
    ? { x: 40 + (props.textX || 0), y: 40 + (props.textY || 0), w: width - 80, h: height * 0.5 - 40 }
    : { x: 60 + (props.textX || 0), y: 60 + (props.textY || 0), w: width * 0.55 - 60, h: height - 120 };

  const imageRegion = isPortrait
    ? { x: 0, y: height * 0.5, w: width, h: height * 0.5 }
    : { x: width * 0.55, y: 0, w: width * 0.45, h: height };

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  let currentY = textRegion.y;
  const tScale = props.textScale || 1;

  let logoOffset = 0;
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const lScale = props.logoScale || 1;
      const lx = props.logoX || 0;
      const ly = props.logoY || 0;
      // manual drawing to apply transforms
      ctx.save();
      ctx.translate(textRegion.x + lx + (140 * lScale) / 2, currentY + ly + (140 * lScale) / 2);
      ctx.scale(lScale, lScale);
      drawContainImage(ctx, logo, -70, -70, 140, 140, 'center', 'center');
      ctx.restore();
      logoOffset = 160 * lScale;
    } catch (e) {}
  }
  
  if (props.brandName) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold ' + (28 * tScale) + 'px sans-serif';
    ctx.fillText(props.brandName.toUpperCase(), textRegion.x + logoOffset, currentY + (logoOffset ? 55 * (props.logoScale || 1) : 0));
  }

  currentY += (logoOffset ? 160 * (props.logoScale || 1) : 50 * tScale);

  if (props.category) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold ' + (24 * tScale) + 'px sans-serif';
    ctx.fillText(props.category.toUpperCase(), textRegion.x, currentY);
    currentY += 40 * tScale;
  }

  ctx.fillStyle = '#ffffff';
  let titleFontSize = isPortrait ? 70 : 80;
  if (props.title.length > 30) titleFontSize = isPortrait ? 55 : 65;
  titleFontSize *= tScale;
  
  ctx.font = 'bold ' + titleFontSize + 'px serif';
  currentY = wrapText(ctx, props.title || '', textRegion.x, currentY, textRegion.w, titleFontSize * 1.15) + 20 * tScale;

  if (props.subtitle) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = (36 * tScale) + 'px sans-serif';
    currentY = wrapText(ctx, props.subtitle, textRegion.x, currentY, textRegion.w, 46 * tScale) + 30 * tScale;
  }

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = props.speakerScale || 1;
      const sx = props.speakerX || 0;
      const sy = props.speakerY || 0;
      
      const r = isPortrait ? width * 0.35 : imageRegion.w * 0.35; 
      const cx = imageRegion.x + imageRegion.w / 2;
      const cy = imageRegion.y + imageRegion.h / 2 - (isPortrait ? r * 0.5 : 0);
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(cx + sx, cy + sy);
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -r, -r, r * 2, r * 2, 'center', 'center');
      ctx.restore();
      
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(props.speakerName || '', cx, cy + r + 25);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '22px sans-serif';
      ctx.fillText(props.speakerRole || '', cx, cy + r + 60);
    } catch (e) {}
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    let px = textRegion.x;
    let py = currentY + 10 * tScale;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    pills.forEach((pill: string) => {
      ctx.font = 'bold ' + (18 * tScale) + 'px sans-serif';
      const m = ctx.measureText(pill);
      if (px + m.width + 40 * tScale > textRegion.x + textRegion.w) {
        px = textRegion.x;
        py += 50 * tScale;
      }
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(px, py - 20 * tScale, m.width + 32 * tScale, 40 * tScale, 20 * tScale);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(pill, px + 16 * tScale, py);
      px += m.width + 48 * tScale;
    });
  }
};
