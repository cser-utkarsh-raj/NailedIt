import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawContainImage, drawCoverImage } from '../../utils/canvasUtils';

export const renderBohemian = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  const bgColor = props.bgStyle === 'emerald' ? '#E9E4D4' : '#F5F0E6';
  const strokeColor = '#8C6E53';
  const textColor = '#3A2E24';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const pad = isPortrait ? 20 : 30;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(pad, pad, width - (pad * 2), height - (pad * 2));
  ctx.lineWidth = 1;
  ctx.strokeRect(pad + 10, pad + 10, width - ((pad + 10) * 2), height - ((pad + 10) * 2));

  const imageRegion = isPortrait
    ? { x: pad + 20, y: height * 0.45, w: width - (pad*2) - 40, h: height * 0.5 }
    : { x: width * 0.5, y: pad + 20, w: width * 0.5 - pad - 40, h: height - (pad*2) - 40 };

  const textRegion = isPortrait
    ? { x: pad + 20 + (props.textX||0), y: pad + 20 + (props.textY||0), w: width - (pad*2) - 40, h: height * 0.4 }
    : { x: pad + 40 + (props.textX||0), y: pad + 40 + (props.textY||0), w: width * 0.45 - pad - 20, h: height - (pad*2) - 80 };

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      const radius = imageRegion.w / 2;
      ctx.moveTo(imageRegion.x, imageRegion.y + imageRegion.h);
      ctx.lineTo(imageRegion.x, imageRegion.y + radius);
      ctx.arc(imageRegion.x + radius, imageRegion.y + radius, radius, Math.PI, 0);
      ctx.lineTo(imageRegion.x + imageRegion.w, imageRegion.y + imageRegion.h);
      ctx.clip();
      
      const sScale = props.speakerScale || 1;
      ctx.translate(imageRegion.x + imageRegion.w/2 + (props.speakerX||0), imageRegion.y + imageRegion.h/2 + (props.speakerY||0));
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -imageRegion.w/2, -imageRegion.h/2, imageRegion.w, imageRegion.h, 'center', 'center');
      ctx.restore();
    } catch(e) {}
  } else {
    ctx.fillStyle = 'rgba(140, 110, 83, 0.05)';
    ctx.beginPath();
    const radius = imageRegion.w / 2;
    ctx.moveTo(imageRegion.x, imageRegion.y + imageRegion.h);
    ctx.lineTo(imageRegion.x, imageRegion.y + radius);
    ctx.arc(imageRegion.x + radius, imageRegion.y + radius, radius, Math.PI, 0);
    ctx.lineTo(imageRegion.x + imageRegion.w, imageRegion.y + imageRegion.h);
    ctx.fill();
  }

  let currentY = textRegion.y;
  const cX = isPortrait ? textRegion.x + textRegion.w / 2 : textRegion.x;
  ctx.textAlign = isPortrait ? 'center' : 'left';
  ctx.textBaseline = 'top';
  
  const tScale = props.textScale || 1;

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const lScale = props.logoScale || 1;
      ctx.save();
      ctx.translate((isPortrait ? cX - 70 : textRegion.x) + (props.logoX||0) + (140*lScale)/2, currentY + (props.logoY||0) + (140*lScale)/2);
      ctx.scale(lScale, lScale);
      drawContainImage(ctx, logo, -70, -70, 140, 140, isPortrait ? 'center' : 'left', 'top');
      ctx.restore();
      currentY += 160 * lScale;
    } catch(e) {}
  } else {
    currentY += 40 * tScale;
  }

  if (props.category) {
    ctx.font = '400 ' + (24 * tScale) + 'px "Cormorant Garamond", serif';
    ctx.letterSpacing = '6px';
    ctx.fillStyle = strokeColor;
    ctx.fillText(props.category.toUpperCase(), cX, currentY);
    ctx.letterSpacing = '0px';
    currentY += 40 * tScale;
  }

  let titleSize = isPortrait ? 65 : 80;
  if (props.title.length > 30) titleSize = isPortrait ? 50 : 65;
  titleSize *= tScale;
  ctx.font = '600 ' + titleSize + 'px "Cormorant Garamond", serif';
  ctx.fillStyle = textColor;
  currentY = wrapText(ctx, props.title, cX, currentY, textRegion.w, titleSize * 1.1) + 20 * tScale;

  if (props.subtitle) {
    ctx.font = 'italic 400 ' + (32 * tScale) + 'px "Cormorant Garamond", serif';
    ctx.fillStyle = '#6B5A4B';
    currentY = wrapText(ctx, props.subtitle, cX, currentY, textRegion.w, 38 * tScale) + 30 * tScale;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    ctx.font = '400 ' + (20 * tScale) + 'px "Cormorant Garamond", serif';
    let px = isPortrait ? cX - (ctx.measureText(pills.join(' ')).width / 2) : cX;
    if (px < textRegion.x) px = textRegion.x; 
    let py = currentY;
    
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    pills.forEach((pill: string) => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 * tScale > textRegion.x + textRegion.w) {
        px = isPortrait ? textRegion.x : cX; 
        py += 40 * tScale;
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py - 18 * tScale, m.width + 20 * tScale, 36 * tScale);
      ctx.fillStyle = textColor;
      ctx.fillText(pill, px + 10 * tScale, py);
      px += m.width + 30 * tScale;
    });
  }
};
