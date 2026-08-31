const fs = require('fs');

const youtubeBold = `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

export const renderYoutubeBold = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;
  
  const isDark = ['midnight', 'obsidian', 'crimson'].includes(props.bgStyle);
  const bgColor = isDark ? '#111111' : '#E8E8E8';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  let accent = '#FFED00'; 
  if (props.bgStyle === 'digital') accent = '#00FFFF';
  if (props.bgStyle === 'crimson') accent = '#FF003C';
  if (props.bgStyle === 'emerald') accent = '#00FF66';

  // Base
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Background Image (if any) taking up the right/bottom
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      if (isPortrait) {
        drawCoverImage(ctx, speaker, 0, height * 0.4, width, height * 0.6);
      } else {
        drawCoverImage(ctx, speaker, width * 0.4, 0, width * 0.6, height);
      }
      
      // Gradient fade to blend image with text area
      const grad = isPortrait 
        ? ctx.createLinearGradient(0, height * 0.4, 0, height * 0.6)
        : ctx.createLinearGradient(width * 0.4, 0, width * 0.7, 0);
      grad.addColorStop(0, bgColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      if (isPortrait) ctx.fillRect(0, height * 0.4, width, height * 0.2);
      else ctx.fillRect(width * 0.4, 0, width * 0.3, height);
    } catch(e) {}
  } else {
    // Speed Lines / Burst if no image
    ctx.save();
    ctx.translate(width / 2, height / 2);
    for (let i = 0; i < 20; i++) {
      ctx.rotate(Math.PI / 10);
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(width, -50); ctx.lineTo(width, 50); ctx.fill();
    }
    ctx.restore();
  }

  // Skewed Transform for Text
  ctx.save();
  ctx.translate(width * 0.05, isPortrait ? height * 0.1 : height * 0.2);
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
  ctx.font = '900 110px "Montserrat", sans-serif';
  let titleY = 80;
  const words = props.title.split(' ');
  let line = '';
  const maxW = isPortrait ? width * 0.8 : width * 0.6;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxW && i > 0) {
      ctx.lineWidth = 15; ctx.strokeStyle = '#000000'; ctx.strokeText(line, 0, titleY);
      ctx.fillStyle = textPrimary; ctx.fillText(line, 0, titleY);
      line = words[i] + ' ';
      titleY += 110;
    } else {
      line = testLine;
    }
  }
  ctx.lineWidth = 15; ctx.strokeStyle = '#000000'; ctx.strokeText(line, 0, titleY);
  ctx.fillStyle = textPrimary; ctx.fillText(line, 0, titleY);

  // Subtitle with Accent Background
  ctx.font = '900 40px "Montserrat", sans-serif';
  titleY += 130;
  
  // Wrap subtitle
  const subWords = props.subtitle.split(' ');
  let sLine = '';
  for (let i = 0; i < subWords.length; i++) {
    const tLine = sLine + subWords[i] + ' ';
    if (ctx.measureText(tLine).width > maxW && i > 0) {
      ctx.fillStyle = accent; ctx.fillRect(-10, titleY - 10, ctx.measureText(sLine).width + 40, 60);
      ctx.fillStyle = '#000000'; ctx.fillText(sLine, 10, titleY);
      sLine = subWords[i] + ' ';
      titleY += 70;
    } else {
      sLine = tLine;
    }
  }
  ctx.fillStyle = accent; ctx.fillRect(-10, titleY - 10, ctx.measureText(sLine).width + 40, 60);
  ctx.fillStyle = '#000000'; ctx.fillText(sLine, 10, titleY);

  ctx.restore();

  // Logo
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, width - 150, 40, 110, 110, 'right', 'top');
    } catch(e) {}
  }
};`;
fs.writeFileSync('src/components/canvas/youtubeBold.ts', youtubeBold);

const techSaas = `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

export const renderTechSaaS = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

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
  let accent = '#6366F1';
  if (props.bgStyle === 'digital') accent = '#06B6D4';
  if (props.bgStyle === 'emerald') accent = '#10B981';
  if (props.bgStyle === 'crimson') accent = '#F43F5E';
  
  const cx = isPortrait ? width / 2 : width * 0.8;
  const cy = isPortrait ? height * 0.2 : height * 0.5;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, isPortrait ? width : 600);
  gradient.addColorStop(0, \`\${accent}40\`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Glassmorphism Card
  const cX = isPortrait ? width * 0.05 : width * 0.05;
  const cY = isPortrait ? height * 0.4 : height * 0.15;
  const cW = isPortrait ? width * 0.9 : width * 0.6;
  const cH = isPortrait ? height * 0.55 : height * 0.7;

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cX, cY, cW, cH, 24);
  ctx.fill();
  ctx.stroke();

  // Content inside card
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Category Pill
  ctx.fillStyle = \`\${accent}30\`;
  ctx.beginPath();
  ctx.roundRect(cX + 30, cY + 40, ctx.measureText(props.category).width + 120, 40, 20);
  ctx.fill();
  
  ctx.font = '600 20px "SF Pro Display", sans-serif';
  ctx.fillStyle = accent;
  ctx.fillText(props.category.toUpperCase(), cX + 50, cY + 50);

  // Title
  ctx.font = '800 64px "SF Pro Display", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  const nextY = wrapText(ctx, props.title, cX + 30, cY + 120, cW - 60, 74);

  // Subtitle
  ctx.font = '400 32px "SF Pro Display", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  wrapText(ctx, props.subtitle, cX + 30, nextY + 30, cW - 60, 40);

  // Background/Subject Image (placed outside card or nicely integrated)
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      if (isPortrait) {
        drawContainImage(ctx, speaker, width * 0.1, 40, width * 0.8, cY - 80, 'center', 'bottom');
      } else {
        drawContainImage(ctx, speaker, width * 0.65, height * 0.1, width * 0.35, height * 0.8, 'center', 'bottom');
      }
    } catch(e) {}
  }

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, isPortrait ? width - 120 : width - 140, isPortrait ? 40 : 40, 80, 80, 'right', 'top');
    } catch(e) {}
  }
};`;
fs.writeFileSync('src/components/canvas/techSaas.ts', techSaas);

