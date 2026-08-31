import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawContainImage, drawCoverImage } from '../../utils/canvasUtils';

export const renderYoutubeBold = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;
  
  const isDark = ['midnight', 'obsidian', 'crimson'].includes(props.bgStyle);
  const bgColor = isDark ? '#111111' : '#E8E8E8';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  let accent = '#FFED00'; 
  if (props.bgStyle === 'digital') accent = '#00FFFF';
  if (props.bgStyle === 'crimson') accent = '#FF003C';
  if (props.bgStyle === 'emerald') accent = '#00FF66';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const imageRegion = isPortrait 
    ? { x: 0, y: height * 0.4, w: width, h: height * 0.6 }
    : { x: width * 0.4, y: 0, w: width * 0.6, h: height };
    
  const textRegion = isPortrait
    ? { x: width * 0.05 + (props.textX||0), y: height * 0.15 + (props.textY||0), w: width * 0.85, h: height * 0.4 }
    : { x: width * 0.05 + (props.textX||0), y: height * 0.2 + (props.textY||0), w: width * 0.5, h: height * 0.8 };

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
      drawCoverImage(ctx, speaker, -imageRegion.w/2, -imageRegion.h/2, imageRegion.w, imageRegion.h, 'center', 'center');
      ctx.restore();
      
      const grad = ctx.createLinearGradient(
        isPortrait ? 0 : imageRegion.x, 
        isPortrait ? imageRegion.y : 0, 
        isPortrait ? 0 : imageRegion.x + imageRegion.w * 0.3, 
        isPortrait ? imageRegion.y + imageRegion.h * 0.3 : 0
      );
      grad.addColorStop(0, bgColor); grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; 
      ctx.fillRect(imageRegion.x, imageRegion.y, isPortrait ? imageRegion.w : imageRegion.w * 0.3, isPortrait ? imageRegion.h * 0.3 : imageRegion.h);
    } catch(e) {}
  } else {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    for (let i = 0; i < 20; i++) {
      ctx.rotate(Math.PI / 10);
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(width, -50); ctx.lineTo(width, 50); ctx.fill();
    }
    ctx.restore();
  }

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const lScale = props.logoScale || 1;
      ctx.save();
      ctx.translate(40 + (props.logoX||0) + (150*lScale)/2, 40 + (props.logoY||0) + (150*lScale)/2);
      ctx.scale(lScale, lScale);
      drawContainImage(ctx, logo, -75, -75, 150, 150, 'left', 'top');
      ctx.restore();
    } catch(e) {}
  }

  ctx.save();
  ctx.translate(textRegion.x, textRegion.y);
  ctx.transform(1, 0, -0.1, 1, 0, 0);

  const tScale = props.textScale || 1;
  let currentY = props.logoImageUrl ? 130 * (props.logoScale || 1) : 0;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  if (props.category) {
    ctx.font = '900 ' + (28 * tScale) + 'px "Montserrat", sans-serif';
    const cw = ctx.measureText(props.category.toUpperCase()).width;
    ctx.fillStyle = textPrimary;
    ctx.fillRect(0, currentY, cw + 40 * tScale, 46 * tScale);
    ctx.fillStyle = isDark ? '#000000' : '#FFFFFF';
    ctx.fillText(props.category.toUpperCase(), 20 * tScale, currentY + 10 * tScale);
    currentY += 60 * tScale;
  }

  let titleSize = isPortrait ? 75 : 90;
  if (props.title.length > 30) titleSize = isPortrait ? 55 : 70;
  titleSize *= tScale;
  ctx.font = '900 ' + titleSize + 'px "Montserrat", sans-serif';
  
  const words = props.title.split(' ');
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > textRegion.w && i > 0) {
      ctx.lineWidth = 12 * tScale; ctx.strokeStyle = '#000000'; ctx.strokeText(line, 0, currentY);
      ctx.fillStyle = textPrimary; ctx.fillText(line, 0, currentY);
      line = words[i] + ' ';
      currentY += titleSize * 1.1;
    } else {
      line = testLine;
    }
  }
  ctx.lineWidth = 12 * tScale; ctx.strokeStyle = '#000000'; ctx.strokeText(line, 0, currentY);
  ctx.fillStyle = textPrimary; ctx.fillText(line, 0, currentY);
  currentY += titleSize * 1.2;

  if (props.subtitle) {
    ctx.font = '900 ' + (36 * tScale) + 'px "Montserrat", sans-serif';
    const subWords = props.subtitle.split(' ');
    let sLine = '';
    for (let i = 0; i < subWords.length; i++) {
      const tLine = sLine + subWords[i] + ' ';
      if (ctx.measureText(tLine).width > textRegion.w && i > 0) {
        ctx.fillStyle = accent; ctx.fillRect(-10 * tScale, currentY - 5 * tScale, ctx.measureText(sLine).width + 20 * tScale, 48 * tScale);
        ctx.fillStyle = '#000000'; ctx.fillText(sLine, 0, currentY);
        sLine = subWords[i] + ' ';
        currentY += 55 * tScale;
      } else {
        sLine = tLine;
      }
    }
    ctx.fillStyle = accent; ctx.fillRect(-10 * tScale, currentY - 5 * tScale, ctx.measureText(sLine).width + 20 * tScale, 48 * tScale);
    ctx.fillStyle = '#000000'; ctx.fillText(sLine, 0, currentY);
    currentY += 70 * tScale;
  }
  
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    let px = 0;
    let py = currentY;
    ctx.font = '900 ' + (22 * tScale) + 'px "Montserrat", sans-serif';
    pills.forEach((pill: string) => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 * tScale > textRegion.w) {
        px = 0; py += 50 * tScale;
      }
      ctx.fillStyle = textPrimary;
      ctx.fillRect(px, py, m.width + 30 * tScale, 40 * tScale);
      ctx.fillStyle = isDark ? '#000' : '#FFF';
      ctx.fillText(pill, px + 15 * tScale, py + 8 * tScale);
      px += m.width + 45 * tScale;
    });
  }

  ctx.restore();
};
