import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawContainImage, drawCoverImage } from '../../utils/canvasUtils';

export const renderEthereal = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  const grad1 = ctx.createLinearGradient(0, 0, width, height);
  if (props.bgStyle === 'obsidian' || props.bgStyle === 'midnight') {
    grad1.addColorStop(0, '#1E1B4B'); grad1.addColorStop(1, '#0F172A');
  } else if (props.bgStyle === 'emerald') {
    grad1.addColorStop(0, '#ECFDF5'); grad1.addColorStop(1, '#D1FAE5');
  } else if (props.bgStyle === 'crimson') {
    grad1.addColorStop(0, '#FFF1F2'); grad1.addColorStop(1, '#FFE4E6');
  } else {
    grad1.addColorStop(0, '#F8FAFC'); grad1.addColorStop(1, '#E2E8F0');
  }
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, width, height);

  const isDark = ['obsidian', 'midnight'].includes(props.bgStyle);
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

  const imageRegion = isPortrait
    ? { x: width * 0.1, y: height * 0.5, w: width * 0.8, h: height * 0.45 }
    : { x: width * 0.6, y: height * 0.1, w: width * 0.3, h: height * 0.8 };

  const textRegion = isPortrait
    ? { x: width * 0.1 + (props.textX||0), y: 60 + (props.textY||0), w: width * 0.8, h: height * 0.45 }
    : { x: 80 + (props.textX||0), y: 80 + (props.textY||0), w: width * 0.5, h: height * 0.8 };

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(imageRegion.x + imageRegion.w/2, imageRegion.y + imageRegion.h/2, imageRegion.w/2, imageRegion.h/2, 0, 0, Math.PI * 2);
      ctx.clip();
      const sScale = props.speakerScale || 1;
      ctx.translate(imageRegion.x + imageRegion.w/2 + (props.speakerX||0), imageRegion.y + imageRegion.h/2 + (props.speakerY||0));
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -imageRegion.w/2, -imageRegion.h/2, imageRegion.w, imageRegion.h, 'center', 'center');
      ctx.restore();
    } catch(e) {}
  }

  let currentY = textRegion.y;
  const cX = isPortrait || !props.speakerImageUrl ? textRegion.x + textRegion.w/2 : textRegion.x + textRegion.w/2;
  const maxW = textRegion.w;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const tScale = props.textScale || 1;

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const lScale = props.logoScale || 1;
      ctx.save();
      ctx.translate(cX - 75 + (props.logoX||0) + (150*lScale)/2, currentY + (props.logoY||0) + (150*lScale)/2);
      ctx.scale(lScale, lScale);
      drawContainImage(ctx, logo, -75, -75, 150, 150, 'center', 'top');
      ctx.restore();
      currentY += 180 * lScale;
    } catch(e) {}
  }

  if (props.category) {
    ctx.font = '300 ' + (24 * tScale) + 'px "Playfair Display", serif';
    ctx.letterSpacing = '12px';
    ctx.fillStyle = subColor;
    ctx.fillText(props.category.toUpperCase(), cX, currentY);
    ctx.letterSpacing = '0px';
    currentY += 40 * tScale;
  }

  let titleSize = isPortrait ? 60 : 75;
  if (props.title.length > 30) titleSize = isPortrait ? 45 : 60;
  titleSize *= tScale;
  ctx.font = 'italic 400 ' + titleSize + 'px "Playfair Display", serif';
  ctx.fillStyle = textColor;
  currentY = wrapText(ctx, props.title, cX, currentY, maxW, titleSize * 1.1) + 20 * tScale;

  if (props.subtitle) {
    ctx.font = '300 ' + (32 * tScale) + 'px "Inter", sans-serif';
    ctx.fillStyle = subColor;
    currentY = wrapText(ctx, props.subtitle, cX, currentY, maxW, 40 * tScale) + 30 * tScale;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    let px = cX - (maxW/2);
    let py = currentY;
    ctx.font = '300 ' + (18 * tScale) + 'px "Inter", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    pills.forEach((pill: string) => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 * tScale > cX + (maxW/2)) {
        px = cX - (maxW/2); py += 40 * tScale;
      }
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
      ctx.beginPath();
      ctx.roundRect(px, py - 18 * tScale, m.width + 24 * tScale, 36 * tScale, 18 * tScale);
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.fillText(pill, px + 12 * tScale, py);
      px += m.width + 34 * tScale;
    });
  }
};
