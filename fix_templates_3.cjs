const fs = require('fs');

const ethereal = `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

export const renderEthereal = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  // Soft Gradient Mesh Background
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

  let textCenterY = height * 0.45;

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      if (isPortrait) {
        ctx.ellipse(width / 2, height * 0.75, width * 0.4, height * 0.2, 0, 0, Math.PI * 2);
        textCenterY = height * 0.3;
      } else {
        ctx.ellipse(width * 0.75, height / 2, width * 0.15, height * 0.4, 0, 0, Math.PI * 2);
        textCenterY = height / 2;
      }
      ctx.clip();
      if (isPortrait) drawCoverImage(ctx, speaker, width * 0.1, height * 0.55, width * 0.8, height * 0.4);
      else drawCoverImage(ctx, speaker, width * 0.6, height * 0.1, width * 0.3, height * 0.8);
      ctx.restore();
    } catch(e) {}
  }

  // Centered Content
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cX = isPortrait || !props.speakerImageUrl ? width / 2 : width * 0.35;
  const maxW = isPortrait || !props.speakerImageUrl ? width * 0.8 : width * 0.6;

  // Category
  ctx.font = '300 24px "Playfair Display", serif';
  ctx.letterSpacing = '12px';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)';
  ctx.fillText(props.category.toUpperCase(), cX, textCenterY - 120);
  ctx.letterSpacing = '0px';

  // Title
  ctx.font = 'italic 400 80px "Playfair Display", serif';
  ctx.fillStyle = textColor;
  
  // Custom center wrapping
  const words = props.title.split(' ');
  let line = '';
  let titleY = textCenterY - 40;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxW && n > 0) {
      ctx.fillText(line, cX, titleY);
      line = words[n] + ' ';
      titleY += 90;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, cX, titleY);

  // Subtitle
  ctx.font = '300 32px "Inter", sans-serif';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  ctx.fillText(props.subtitle, cX, titleY + 90);

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, isPortrait ? width / 2 - 50 : width - 150, 40, 100, 100);
    } catch(e) {}
  }
};`;
fs.writeFileSync('src/components/canvas/ethereal.ts', ethereal);

const bohemian = `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

export const renderBohemian = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

  // Warm earthy colors
  const bgColor = props.bgStyle === 'emerald' ? '#E9E4D4' : '#F5F0E6';
  const strokeColor = '#8C6E53';
  const textColor = '#3A2E24';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Double Border
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  const pad = isPortrait ? 20 : 30;
  ctx.strokeRect(pad, pad, width - (pad * 2), height - (pad * 2));
  ctx.lineWidth = 1;
  ctx.strokeRect(pad + 10, pad + 10, width - ((pad + 10) * 2), height - ((pad + 10) * 2));

  // Arch Shape behind text or holding image
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      if (isPortrait) {
        ctx.moveTo(width / 2 - 200, height);
        ctx.lineTo(width / 2 - 200, height * 0.6);
        ctx.arc(width / 2, height * 0.6, 200, Math.PI, 0);
        ctx.lineTo(width / 2 + 200, height);
      } else {
        ctx.moveTo(width - 400, height);
        ctx.lineTo(width - 400, height * 0.4);
        ctx.arc(width - 200, height * 0.4, 200, Math.PI, 0);
        ctx.lineTo(width, height);
      }
      ctx.clip();
      if (isPortrait) drawCoverImage(ctx, speaker, width / 2 - 200, height * 0.4, 400, height * 0.6);
      else drawCoverImage(ctx, speaker, width - 400, height * 0.2, 400, height * 0.8);
      ctx.restore();
    } catch(e) {}
  } else {
    ctx.fillStyle = 'rgba(140, 110, 83, 0.05)';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 300, height);
    ctx.lineTo(width / 2 - 300, height * 0.4);
    ctx.arc(width / 2, height * 0.4, 300, Math.PI, 0);
    ctx.lineTo(width / 2 + 300, height);
    ctx.fill();
  }

  // Text
  ctx.textAlign = isPortrait ? 'center' : 'left';
  ctx.textBaseline = 'middle';
  const cX = isPortrait ? width / 2 : width * 0.1;
  const maxW = isPortrait ? width * 0.8 : width * 0.55;
  let textY = isPortrait ? height * 0.2 : height * 0.4;

  // Category
  ctx.font = '400 24px "Cormorant Garamond", serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = strokeColor;
  ctx.fillText(props.category.toUpperCase(), cX, textY - 80);
  ctx.letterSpacing = '0px';

  // Title
  ctx.font = '600 70px "Cormorant Garamond", serif';
  ctx.fillStyle = textColor;
  
  const words = props.title.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxW && n > 0) {
      ctx.fillText(line, cX, textY);
      line = words[n] + ' ';
      textY += 80;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, cX, textY);

  // Subtitle
  ctx.font = 'italic 400 36px "Cormorant Garamond", serif';
  ctx.fillStyle = '#6B5A4B';
  ctx.fillText(props.subtitle, cX, textY + 90);

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, isPortrait ? width / 2 - 40 : width - 150, 40, 80, 80);
    } catch(e) {}
  }
};`;
fs.writeFileSync('src/components/canvas/bohemian.ts', bohemian);

