const fs = require('fs');

const tpls = {
  professional: `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

export const renderProfessional = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const isPortrait = height > width;

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

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath();
  if (isPortrait) {
    ctx.moveTo(0, height * 0.4); ctx.lineTo(width, height * 0.4); ctx.lineTo(width, height); ctx.lineTo(0, height);
  } else {
    ctx.moveTo(width, 0); ctx.lineTo(width, height); ctx.lineTo(width * 0.5, height);
  }
  ctx.fill();

  const padX = isPortrait ? 40 : 60;
  let currentY = padX;
  const maxW = isPortrait ? width - (padX*2) : width * 0.55;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  let logoOffset = 0;
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, padX, currentY, 140, 140, 'left', 'top');
      logoOffset = 160;
    } catch (e) {}
  }
  
  if (props.brandName) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(props.brandName.toUpperCase(), padX + logoOffset, currentY + (logoOffset ? 55 : 0));
  }

  currentY += (logoOffset ? 160 : 50);

  if (props.category) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(props.category.toUpperCase(), padX, currentY);
    currentY += 40;
  }

  ctx.fillStyle = '#ffffff';
  let titleFontSize = isPortrait ? 70 : 80;
  if (props.title.length > 30) titleFontSize = isPortrait ? 55 : 65;
  ctx.font = \`bold \${titleFontSize}px serif\`;
  currentY = wrapText(ctx, props.title || '', padX, currentY, maxW, titleFontSize * 1.15) + 20;

  if (props.subtitle) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '36px sans-serif';
    currentY = wrapText(ctx, props.subtitle, padX, currentY, maxW, 46) + 30;
  }

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const cx = isPortrait ? width / 2 : width * 0.75;
      const cy = isPortrait ? height * 0.75 : height / 2 + 30;
      const r = isPortrait ? width * 0.35 : (width * 0.18); 
      
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
      ctx.fillText(props.speakerName || '', cx, cy + r + 25);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '22px sans-serif';
      ctx.fillText(props.speakerRole || '', cx, cy + r + 60);
    } catch (e) {}
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map((p: string) => p.trim()).filter(Boolean);
    let px = padX;
    let py = currentY + 10;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    pills.forEach((pill: string) => {
      ctx.font = 'bold 18px sans-serif';
      const m = ctx.measureText(pill);
      if (px + m.width + 40 > (isPortrait ? width - padX : maxW + padX)) {
        px = padX;
        py += 50;
      }
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(px, py - 20, m.width + 32, 40, 20);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(pill, px + 16, py);
      px += m.width + 48;
    });
  }
};`,

  minimalistic: `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

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

  let currentY = topY + 40;
  const maxW = isPortrait ? width - (padX * 2) : width * 0.55;

  ctx.fillStyle = '#111111';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, padX, 20, 120, 120, 'left', 'top');
    } catch (e) {}
  }

  if (props.category) {
    ctx.font = '800 24px "Inter", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(props.category.toUpperCase(), padX, currentY);
    ctx.letterSpacing = '0px';
    currentY += 40;
  }

  let titleSize = isPortrait ? 75 : 90;
  if (props.title.length > 40) titleSize = isPortrait ? 55 : 70;
  ctx.font = \`900 \${titleSize}px "Inter", sans-serif\`;
  currentY = wrapText(ctx, props.title, padX, currentY, maxW, titleSize * 1.1) + 20;

  if (props.subtitle) {
    ctx.font = '500 32px "Inter", sans-serif';
    ctx.fillStyle = '#666666';
    currentY = wrapText(ctx, props.subtitle, padX, currentY, maxW, 44) + 30;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map(p => p.trim()).filter(Boolean);
    let px = padX;
    let py = currentY;
    ctx.textBaseline = 'middle';
    pills.forEach(pill => {
      ctx.font = '600 18px "Inter", sans-serif';
      const m = ctx.measureText(pill);
      if (px + m.width + 30 > padX + maxW) {
        px = padX; py += 45;
      }
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py - 18, m.width + 24, 36);
      ctx.fillStyle = '#111111';
      ctx.fillText(pill, px + 12, py);
      px += m.width + 40;
    });
  }

  ctx.fillStyle = props.bgStyle === 'crimson' ? '#D93025' : props.bgStyle === 'digital' ? '#00E5FF' : '#111111';
  ctx.fillRect(padX, topY - 10, 80, 10);

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
      
      ctx.font = '600 16px "Inter", sans-serif';
      ctx.fillStyle = '#111';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText((props.speakerName || 'FIG. 1').toUpperCase(), ix, iy - 10);
    } catch(e) {}
  }
};`,

  youtubeBold: `import { CanvasTemplateProps } from '../../types';
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

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      if (isPortrait) {
        drawCoverImage(ctx, speaker, 0, height * 0.3, width, height * 0.7);
        const grad = ctx.createLinearGradient(0, height * 0.3, 0, height * 0.6);
        grad.addColorStop(0, bgColor); grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fillRect(0, height * 0.3, width, height * 0.3);
      } else {
        drawCoverImage(ctx, speaker, width * 0.35, 0, width * 0.65, height);
        const grad = ctx.createLinearGradient(width * 0.35, 0, width * 0.65, 0);
        grad.addColorStop(0, bgColor); grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fillRect(width * 0.35, 0, width * 0.3, height);
      }
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
      drawContainImage(ctx, logo, 40, 40, 150, 150, 'left', 'top');
    } catch(e) {}
  }

  ctx.save();
  ctx.translate(width * 0.05, isPortrait ? height * 0.15 : height * 0.2);
  ctx.transform(1, 0, -0.1, 1, 0, 0);

  let currentY = props.logoImageUrl ? 130 : 0;
  const maxW = isPortrait ? width * 0.85 : width * 0.55;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  if (props.category) {
    ctx.font = '900 28px "Montserrat", sans-serif';
    const cw = ctx.measureText(props.category.toUpperCase()).width;
    ctx.fillStyle = textPrimary;
    ctx.fillRect(0, currentY, cw + 40, 46);
    ctx.fillStyle = isDark ? '#000000' : '#FFFFFF';
    ctx.fillText(props.category.toUpperCase(), 20, currentY + 10);
    currentY += 60;
  }

  let titleSize = isPortrait ? 85 : 100;
  if (props.title.length > 30) titleSize = isPortrait ? 60 : 80;
  ctx.font = \`900 \${titleSize}px "Montserrat", sans-serif\`;
  
  const words = props.title.split(' ');
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > maxW && i > 0) {
      ctx.lineWidth = 12; ctx.strokeStyle = '#000000'; ctx.strokeText(line, 0, currentY);
      ctx.fillStyle = textPrimary; ctx.fillText(line, 0, currentY);
      line = words[i] + ' ';
      currentY += titleSize * 1.1;
    } else {
      line = testLine;
    }
  }
  ctx.lineWidth = 12; ctx.strokeStyle = '#000000'; ctx.strokeText(line, 0, currentY);
  ctx.fillStyle = textPrimary; ctx.fillText(line, 0, currentY);
  currentY += titleSize * 1.2;

  if (props.subtitle) {
    ctx.font = '900 36px "Montserrat", sans-serif';
    const subWords = props.subtitle.split(' ');
    let sLine = '';
    for (let i = 0; i < subWords.length; i++) {
      const tLine = sLine + subWords[i] + ' ';
      if (ctx.measureText(tLine).width > maxW && i > 0) {
        ctx.fillStyle = accent; ctx.fillRect(-10, currentY - 5, ctx.measureText(sLine).width + 20, 48);
        ctx.fillStyle = '#000000'; ctx.fillText(sLine, 0, currentY);
        sLine = subWords[i] + ' ';
        currentY += 55;
      } else {
        sLine = tLine;
      }
    }
    ctx.fillStyle = accent; ctx.fillRect(-10, currentY - 5, ctx.measureText(sLine).width + 20, 48);
    ctx.fillStyle = '#000000'; ctx.fillText(sLine, 0, currentY);
    currentY += 70;
  }
  
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map(p => p.trim()).filter(Boolean);
    let px = 0;
    let py = currentY;
    ctx.font = '900 22px "Montserrat", sans-serif';
    pills.forEach(pill => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 > maxW) {
        px = 0; py += 50;
      }
      ctx.fillStyle = textPrimary;
      ctx.fillRect(px, py, m.width + 30, 40);
      ctx.fillStyle = isDark ? '#000' : '#FFF';
      ctx.fillText(pill, px + 15, py + 8);
      px += m.width + 45;
    });
  }

  ctx.restore();
};`,

  techSaas: `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

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
  gradient.addColorStop(0, \`\${accent}40\`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const cX = isPortrait ? width * 0.05 : width * 0.05;
  const cY = isPortrait ? height * 0.35 : height * 0.10;
  const cW = isPortrait ? width * 0.9 : width * 0.55;
  const cH = isPortrait ? height * 0.6 : height * 0.8;

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      if (isPortrait) {
        drawContainImage(ctx, speaker, width * 0.1, 40, width * 0.8, cY - 40, 'center', 'bottom');
      } else {
        drawContainImage(ctx, speaker, width * 0.6, height * 0.1, width * 0.4, height * 0.8, 'center', 'bottom');
      }
    } catch(e) {}
  }

  ctx.fillStyle = 'rgba(15,15,20,0.7)';
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cX, cY, cW, cH, 24);
  ctx.fill();
  ctx.stroke();

  let currentY = cY + 40;
  const padX = cX + 40;
  const maxW = cW - 80;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, padX, currentY, 120, 120, 'left', 'top');
      currentY += 140;
    } catch(e) {}
  }

  if (props.category) {
    ctx.fillStyle = \`\${accent}30\`;
    ctx.beginPath();
    const catW = ctx.measureText(props.category.toUpperCase()).width + 40;
    ctx.roundRect(padX, currentY, catW, 36, 18);
    ctx.fill();
    ctx.font = '600 18px "SF Pro Display", sans-serif';
    ctx.fillStyle = accent;
    ctx.fillText(props.category.toUpperCase(), padX + 20, currentY + 8);
    currentY += 60;
  }

  let titleSize = isPortrait ? 55 : 70;
  if (props.title.length > 35) titleSize = isPortrait ? 45 : 55;
  ctx.font = \`800 \${titleSize}px "SF Pro Display", sans-serif\`;
  ctx.fillStyle = '#FFFFFF';
  currentY = wrapText(ctx, props.title, padX, currentY, maxW, titleSize * 1.1) + 20;

  if (props.subtitle) {
    ctx.font = '400 30px "SF Pro Display", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    currentY = wrapText(ctx, props.subtitle, padX, currentY, maxW, 40) + 30;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map(p => p.trim()).filter(Boolean);
    let px = padX;
    let py = currentY;
    ctx.font = '500 16px "SF Pro Display", sans-serif';
    ctx.textBaseline = 'middle';
    pills.forEach(pill => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 > padX + maxW) {
        px = padX; py += 40;
      }
      ctx.strokeStyle = \`\${accent}80\`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(px, py - 16, m.width + 24, 32, 8);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(pill, px + 12, py);
      px += m.width + 34;
    });
  }
};`,

  bohemian: `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

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

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      if (isPortrait) {
        ctx.moveTo(width / 2 - 200, height);
        ctx.lineTo(width / 2 - 200, height * 0.5);
        ctx.arc(width / 2, height * 0.5, 200, Math.PI, 0);
        ctx.lineTo(width / 2 + 200, height);
      } else {
        ctx.moveTo(width - 400, height);
        ctx.lineTo(width - 400, height * 0.3);
        ctx.arc(width - 200, height * 0.3, 200, Math.PI, 0);
        ctx.lineTo(width, height);
      }
      ctx.clip();
      if (isPortrait) drawCoverImage(ctx, speaker, width / 2 - 200, height * 0.3, 400, height * 0.7);
      else drawCoverImage(ctx, speaker, width - 400, height * 0.1, 400, height * 0.9);
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

  let currentY = pad + 40;
  const cX = isPortrait ? width / 2 : pad + 40;
  const maxW = isPortrait ? width - (pad * 4) : width * 0.55;

  ctx.textAlign = isPortrait ? 'center' : 'left';
  ctx.textBaseline = 'top';

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, isPortrait ? width/2 - 70 : pad + 40, currentY, 140, 140, isPortrait ? 'center' : 'left', 'top');
      currentY += 160;
    } catch(e) {}
  } else {
    currentY += isPortrait ? 60 : 40;
  }

  if (props.category) {
    ctx.font = '400 24px "Cormorant Garamond", serif';
    ctx.letterSpacing = '6px';
    ctx.fillStyle = strokeColor;
    ctx.fillText(props.category.toUpperCase(), cX, currentY);
    ctx.letterSpacing = '0px';
    currentY += 40;
  }

  let titleSize = isPortrait ? 75 : 85;
  if (props.title.length > 30) titleSize = isPortrait ? 60 : 70;
  ctx.font = \`600 \${titleSize}px "Cormorant Garamond", serif\`;
  ctx.fillStyle = textColor;
  currentY = wrapText(ctx, props.title, cX, currentY, maxW, titleSize * 1.1) + 20;

  if (props.subtitle) {
    ctx.font = 'italic 400 36px "Cormorant Garamond", serif';
    ctx.fillStyle = '#6B5A4B';
    currentY = wrapText(ctx, props.subtitle, cX, currentY, maxW, 42) + 30;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map(p => p.trim()).filter(Boolean);
    let px = isPortrait ? width / 2 - (ctx.measureText(pills.join(' ')).width / 2) : cX;
    if (px < pad + 20) px = pad + 20; 
    let py = currentY;
    ctx.font = '400 20px "Cormorant Garamond", serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    pills.forEach(pill => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 > width - (pad * 2)) {
        px = isPortrait ? pad + 40 : cX; 
        py += 40;
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py - 18, m.width + 20, 36);
      ctx.fillStyle = textColor;
      ctx.fillText(pill, px + 10, py);
      px += m.width + 30;
    });
  }
};`,

  ethereal: `import { CanvasTemplateProps } from '../../types';
import { loadImage, wrapText, drawCoverImage, drawContainImage } from '../../utils/canvasUtils';

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

  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      ctx.save();
      ctx.beginPath();
      if (isPortrait) {
        ctx.ellipse(width / 2, height * 0.75, width * 0.4, height * 0.2, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(width * 0.75, height / 2, width * 0.15, height * 0.4, 0, 0, Math.PI * 2);
      }
      ctx.clip();
      if (isPortrait) drawCoverImage(ctx, speaker, width * 0.1, height * 0.55, width * 0.8, height * 0.4);
      else drawCoverImage(ctx, speaker, width * 0.6, height * 0.1, width * 0.3, height * 0.8);
      ctx.restore();
    } catch(e) {}
  }

  let currentY = isPortrait ? 60 : 80;
  const cX = isPortrait || !props.speakerImageUrl ? width / 2 : width * 0.35;
  const maxW = isPortrait || !props.speakerImageUrl ? width * 0.8 : width * 0.55;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      drawContainImage(ctx, logo, isPortrait ? width/2 - 75 : 80, 60, 150, 150, isPortrait ? 'center' : 'left', 'top');
      currentY += isPortrait ? 180 : 0;
    } catch(e) {}
  }

  if (props.category) {
    ctx.font = '300 24px "Playfair Display", serif';
    ctx.letterSpacing = '12px';
    ctx.fillStyle = subColor;
    ctx.fillText(props.category.toUpperCase(), cX, currentY);
    ctx.letterSpacing = '0px';
    currentY += 40;
  }

  let titleSize = isPortrait ? 70 : 85;
  if (props.title.length > 30) titleSize = isPortrait ? 55 : 65;
  ctx.font = \`italic 400 \${titleSize}px "Playfair Display", serif\`;
  ctx.fillStyle = textColor;
  currentY = wrapText(ctx, props.title, cX, currentY, maxW, titleSize * 1.1) + 20;

  if (props.subtitle) {
    ctx.font = '300 32px "Inter", sans-serif';
    ctx.fillStyle = subColor;
    currentY = wrapText(ctx, props.subtitle, cX, currentY, maxW, 40) + 30;
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map(p => p.trim()).filter(Boolean);
    let px = cX - (maxW/2);
    let py = currentY;
    ctx.font = '300 18px "Inter", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    pills.forEach(pill => {
      const m = ctx.measureText(pill);
      if (px + m.width + 30 > cX + (maxW/2)) {
        px = cX - (maxW/2); py += 40;
      }
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
      ctx.beginPath();
      ctx.roundRect(px, py - 18, m.width + 24, 36, 18);
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.fillText(pill, px + 12, py);
      px += m.width + 34;
    });
  }
};`
};

for (const [name, content] of Object.entries(tpls)) {
  fs.writeFileSync(\`src/components/canvas/\${name}.ts\`, content);
}
