import { CanvasTemplateProps } from '../../types';
import {
  loadImage,
  wrapText,
  drawContainImage,
  drawCoverImage,
  roundRectPath,
  drawLetterSpacedText,
  clamp,
  getLinkIconAndLabel,
} from '../../utils/canvasUtils';

export const renderEthereal = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {
  const portrait = height > width;
  const palettes = {
    midnight: { bg: '#11111F', panel: '#191A2E', ink: '#FBF8F2', muted: '#C5C0D2', accent: '#D8B4FE', line: 'rgba(216,180,254,.28)' },
    obsidian: { bg: '#11100F', panel: '#211C1A', ink: '#FFF9F1', muted: '#C9B8AA', accent: '#F0B27A', line: 'rgba(240,178,122,.30)' },
    corporate: { bg: '#E9E3D9', panel: '#F8F4EC', ink: '#1F2933', muted: '#5F6B73', accent: '#8B5E3C', line: 'rgba(70,58,47,.22)' },
    emerald: { bg: '#E7EEE7', panel: '#F5F8F2', ink: '#183128', muted: '#557064', accent: '#39735A', line: 'rgba(57,115,90,.25)' },
    crimson: { bg: '#F3E4E3', panel: '#FFF6F4', ink: '#3B1720', muted: '#80545B', accent: '#B83D52', line: 'rgba(184,61,82,.24)' },
    digital: { bg: '#DCE9EC', panel: '#F1F8F9', ink: '#102A31', muted: '#4F727A', accent: '#167C89', line: 'rgba(22,124,137,.25)' },
  };
  const p = palettes[props.bgStyle as keyof typeof palettes] || palettes.midnight;
  const pad = Math.max(38, Math.min(width, height) * 0.065);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, width, height);

  // Premium editorial atmosphere: two restrained light pools, not a generic glow.
  const glow = ctx.createRadialGradient(width * .78, height * .18, 0, width * .78, height * .18, Math.max(width, height) * .62);
  glow.addColorStop(0, `${p.accent}24`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = p.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(pad * .55, pad * .55, width - pad * 1.1, height - pad * 1.1);

  const hasSpeaker = Boolean(props.showSpeaker && props.speakerImageUrl);
  const textW = portrait ? width - pad * 2 : hasSpeaker ? width * .53 : width - pad * 2;
  const textX = pad;
  const textY = portrait ? pad : pad * .95;
  const imageX = portrait ? pad : width * .59;
  const imageY = portrait ? height * .53 : pad;
  const imageW = portrait ? width - pad * 2 : width * .34;
  const imageH = portrait ? height * .36 : height - pad * 2;

  // Image/editorial portrait block.
  if (hasSpeaker && props.speakerImageUrl) {
    try {
      const img = await loadImage(props.speakerImageUrl);
      const scale = clamp(props.speakerScale || 1, .5, 3);
      ctx.save();
      roundRectPath(ctx, imageX, imageY, imageW, imageH, portrait ? 26 : 20);
      ctx.fillStyle = p.panel;
      ctx.fill();
      ctx.strokeStyle = p.line;
      ctx.stroke();
      ctx.clip();
      ctx.translate(imageX + imageW / 2 + (props.speakerX || 0), imageY + imageH / 2 + (props.speakerY || 0));
      ctx.scale(scale, scale);
      drawCoverImage(ctx, img, -imageW / 2, -imageH / 2, imageW, imageH, 'center', 'smart');
      ctx.restore();

      ctx.save();
      roundRectPath(ctx, imageX, imageY, imageW, imageH, portrait ? 26 : 20);
      ctx.strokeStyle = p.line;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } catch {}
  }

  // Logo remains an independent layer so changing template/theme never replaces it.
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const size = Math.min(82, width * .13) * clamp(props.logoScale || 1, .5, 3);
      drawContainImage(ctx, logo, pad + (props.logoX || 0), pad * .45 + (props.logoY || 0), size, size, 'left', 'top');
    } catch {}
  }

  // Strong editorial title treatment.
  ctx.save();
  ctx.translate(textX + (props.textX || 0), textY + (props.textY || 0));
  ctx.scale(clamp(props.textScale || 1, .6, 2), clamp(props.textScale || 1, .6, 2));
  let y = 0;

  if (props.brandName) {
    ctx.font = `600 ${portrait ? 20 : 15}px "Inter", sans-serif`;
    ctx.fillStyle = p.muted;
    drawLetterSpacedText(ctx, props.brandName.toUpperCase(), 0, y, 4, 'left');
    y += portrait ? 38 : 30;
  }

  if (props.category) {
    ctx.font = `700 ${portrait ? 16 : 13}px "Inter", sans-serif`;
    ctx.fillStyle = p.accent;
    drawLetterSpacedText(ctx, props.category.toUpperCase(), 0, y, 3, 'left');
    y += portrait ? 32 : 26;
  }

  ctx.font = `700 ${portrait ? 78 : 66}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = p.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const titleLen = (props.title || '').length;
  const titleMax = portrait ? 3 : 4;
  const titleSize = titleLen > 48 ? 54 : titleLen > 30 ? 60 : 66;
  ctx.font = `700 ${portrait ? Math.min(82, titleSize + 8) : titleSize}px "Playfair Display", Georgia, serif`;
  y = wrapText(ctx, props.title || '', 0, y, textW, (portrait ? 88 : titleSize * 1.08), titleMax) + (portrait ? 22 : 18);

  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(Math.min(textW * .24, portrait ? 120 : 90), y);
  ctx.stroke();
  y += portrait ? 30 : 24;

  if (props.subtitle) {
    ctx.font = `400 ${portrait ? 28 : 20}px "Inter", sans-serif`;
    ctx.fillStyle = p.muted;
    y = wrapText(ctx, props.subtitle, 0, y, textW, portrait ? 40 : 30, 3) + (portrait ? 22 : 18);
  }

  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills.split(/[,•]/).map(v => v.trim()).filter(Boolean).slice(0, 4);
    ctx.font = `600 ${portrait ? 17 : 12}px "Inter", sans-serif`;
    let x = 0;
    const h = portrait ? 36 : 27;
    pills.forEach((pill) => {
      const w = ctx.measureText(pill.toUpperCase()).width + (portrait ? 28 : 22);
      if (x + w > textW && x > 0) { x = 0; y += h + 8; }
      ctx.save();
      roundRectPath(ctx, x, y, w, h, h / 2);
      ctx.fillStyle = p.panel;
      ctx.fill();
      ctx.strokeStyle = p.line;
      ctx.stroke();
      ctx.fillStyle = p.ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pill.toUpperCase(), x + w / 2, y + h / 2);
      ctx.restore();
      x += w + 8;
    });
  }
  ctx.restore();

  // Name + role are first-class content in Elegant, including when no photo is uploaded.
  if (props.showSpeaker && (props.speakerName || props.speakerRole)) {
    const cardW = Math.min(portrait ? width * .82 : 300, width - pad * 2);
    const cardH = portrait ? 76 : 64;
    const cx = portrait ? (width - cardW) / 2 : imageX + 10;
    const cy = Math.max(pad, imageY + imageH - cardH - 14);
    ctx.save();
    roundRectPath(ctx, cx, cy, cardW, cardH, 12);
    ctx.fillStyle = props.bgStyle === 'corporate' || props.bgStyle === 'emerald' || props.bgStyle === 'crimson' || props.bgStyle === 'digital' ? 'rgba(255,255,255,.88)' : 'rgba(12,12,20,.78)';
    ctx.fill();
    ctx.strokeStyle = `${p.accent}66`;
    ctx.stroke();
    let iy = cy + 13;
    if (props.speakerName) {
      ctx.font = `700 ${portrait ? 19 : 15}px "Plus Jakarta Sans", Inter, sans-serif`;
      ctx.fillStyle = p.ink;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(props.speakerName, cx + 15, iy, cardW - 30);
      iy += portrait ? 26 : 21;
    }
    if (props.speakerRole) {
      ctx.font = `600 ${portrait ? 13 : 11}px "Plus Jakarta Sans", Inter, sans-serif`;
      ctx.fillStyle = p.accent;
      ctx.fillText(props.speakerRole.toUpperCase(), cx + 15, iy, cardW - 30);
    }
    ctx.restore();
  }

  if (props.showFooterLinks !== false && props.footerLinks?.length) {
    ctx.save();
    const footerY = height - pad * .65;
    ctx.strokeStyle = p.line;
    ctx.beginPath();
    ctx.moveTo(pad, footerY - 18);
    ctx.lineTo(width - pad, footerY - 18);
    ctx.stroke();
    ctx.font = `600 ${portrait ? 14 : 11}px "Inter", sans-serif`;
    ctx.fillStyle = p.muted;
    let x = pad;
    props.footerLinks.slice(0, 4).filter(Boolean).forEach((link) => {
      const label = getLinkIconAndLabel(link).label;
      const w = ctx.measureText(label).width + 26;
      if (x + w > width - pad) return;
      ctx.fillText(label, x, footerY);
      x += w;
    });
    ctx.restore();
  }
};
