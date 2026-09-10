import { CanvasTemplateProps } from '../../types';
import { clamp, drawCoverImage, drawContainImage, loadImage, roundRectPath, wrapText } from '../../utils/canvasUtils';

type Palette = { bg: string; bg2: string; ink: string; muted: string; accent: string; soft: string };

const palettes: Record<CanvasTemplateProps['bgStyle'], Palette> = {
  midnight: { bg: '#070B14', bg2: '#101A33', ink: '#F8FAFC', muted: '#A7B3C8', accent: '#7C8CFF', soft: 'rgba(124,140,255,.16)' },
  corporate: { bg: '#07152D', bg2: '#123B78', ink: '#F8FAFC', muted: '#B8C8E3', accent: '#62A0FF', soft: 'rgba(98,160,255,.16)' },
  obsidian: { bg: '#0A0A0B', bg2: '#202024', ink: '#FAFAFA', muted: '#B2B2B8', accent: '#F2C66D', soft: 'rgba(242,198,109,.12)' },
  emerald: { bg: '#061A15', bg2: '#0D352A', ink: '#F0FDF8', muted: '#A9D7C6', accent: '#43D6A1', soft: 'rgba(67,214,161,.13)' },
  crimson: { bg: '#1A080D', bg2: '#3A111C', ink: '#FFF7F8', muted: '#E5B8C1', accent: '#FF7087', soft: 'rgba(255,112,135,.14)' },
  digital: { bg: '#06111C', bg2: '#0B2940', ink: '#F2FBFF', muted: '#A8D6E8', accent: '#37D7FF', soft: 'rgba(55,215,255,.13)' },
};

const clean = (v?: string) => (v || '').trim();
const pills = (v?: string) => clean(v).split(/[,•|]/).map(x => x.trim()).filter(Boolean).slice(0, 4);

function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string) {
  ctx.save(); roundRectPath(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
}

function fitTitle(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number, start: number, min: number) {
  let size = start;
  while (size > min) {
    ctx.font = `800 ${size}px "Plus Jakarta Sans", "Inter", sans-serif`;
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && line) { lines.push(line); line = word; } else line = candidate;
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines) return { size, lines };
    size -= 2;
  }
  ctx.font = `800 ${min}px "Plus Jakarta Sans", "Inter", sans-serif`;
  return { size: min, lines: text.split(/\s+/).slice(0, maxLines).join(' ') .split('\n') };
}

function drawTextLines(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, size: number, color: string, lineHeight = 1.04) {
  ctx.save(); ctx.font = `800 ${size}px "Plus Jakarta Sans", "Inter", sans-serif`; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * size * lineHeight)); ctx.restore();
}

function drawAccentMark(ctx: CanvasRenderingContext2D, template: CanvasTemplateProps['template'], x: number, y: number, size: number, color: string) {
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = Math.max(2, size * .08);
  if (template === 'youtube_bold') { ctx.beginPath(); ctx.moveTo(x, y + size); ctx.lineTo(x + size * .45, y); ctx.lineTo(x + size, y + size); ctx.stroke(); }
  else if (template === 'tech_saas') { ctx.strokeRect(x, y, size, size); ctx.beginPath(); ctx.moveTo(x + size * .25, y + size * .5); ctx.lineTo(x + size * .45, y + size * .7); ctx.lineTo(x + size * .8, y + size * .3); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size * .32, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

export const renderPremium = async (ctx: CanvasRenderingContext2D, width: number, height: number, props: CanvasTemplateProps) => {
  const p = palettes[props.bgStyle] || palettes.midnight;
  const portrait = height > width;
  const t = props.template;
  const pad = Math.max(34, Math.min(width, height) * (portrait ? .055 : .055));
  const title = clean(props.title).toUpperCase();
  const subtitle = clean(props.subtitle);
  const tagList = pills(props.keyPills);
  const hasImage = Boolean(props.showSpeaker && props.speakerImageUrl);
  const accent = p.accent;

  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, p.bg); bg.addColorStop(1, p.bg2); ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * (hasImage && !portrait ? .82 : .25), height * .2, 0, width * (hasImage && !portrait ? .82 : .25), height * .2, Math.max(width, height) * .7);
  glow.addColorStop(0, p.soft); glow.addColorStop(1, 'transparent'); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);

  // Editorial grid + edge treatment: subtle enough to feel intentional, never noisy.
  ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 1;
  const grid = Math.max(80, Math.min(width, height) * .12);
  for (let x = pad; x < width - pad; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = pad; y < height - pad; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

  if (t === 'minimalistic') {
    ctx.fillStyle = accent; ctx.fillRect(pad, pad, Math.min(72, width * .08), 4);
  } else if (t === 'bohemian' || t === 'ethereal') {
    ctx.strokeStyle = `${accent}66`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(width - pad * 1.3, pad * 1.3, Math.min(width, height) * .16, 0, Math.PI * 2); ctx.stroke();
  } else {
    drawAccentMark(ctx, t, pad, pad, Math.min(34, Math.min(width, height) * .05), accent);
  }

  const imageW = portrait ? width - pad * 2 : hasImage ? width * .37 : 0;
  const textW = portrait ? width - pad * 2 : hasImage ? width * .53 : width - pad * 2;
  const imageX = width - pad - imageW;
  const textX = pad;
  const textY = portrait ? height * .07 : pad * 1.15;
  const imageY = portrait ? height * .52 : pad;
  const imageH = portrait ? height * .38 : height - pad * 2;

  if (hasImage) {
    try {
      const img = await loadImage(props.speakerImageUrl!);
      const radius = portrait ? 28 : 24;
      rounded(ctx, imageX, imageY, imageW, imageH, radius, 'rgba(255,255,255,.055)', `${accent}55`);
      ctx.save(); roundRectPath(ctx, imageX + 8, imageY + 8, imageW - 16, imageH - 16, radius - 6); ctx.clip();
      drawCoverImage(ctx, img, imageX + 8, imageY + 8, imageW - 16, imageH - 16, 'center', 'smart');
      const veil = ctx.createLinearGradient(0, imageY, 0, imageY + imageH); veil.addColorStop(0, 'rgba(0,0,0,0)'); veil.addColorStop(.72, 'rgba(0,0,0,.15)'); veil.addColorStop(1, 'rgba(0,0,0,.72)'); ctx.fillStyle = veil; ctx.fillRect(imageX + 8, imageY + 8, imageW - 16, imageH - 16); ctx.restore();

      if (props.speakerName || props.speakerRole) {
        const cardH = portrait ? 72 : 64;
        const cardY = imageY + imageH - cardH - 22;
        rounded(ctx, imageX + 22, cardY, imageW - 44, cardH, 16, 'rgba(5,10,18,.78)', 'rgba(255,255,255,.14)');
        ctx.fillStyle = accent; ctx.fillRect(imageX + 22, cardY, 3, cardH);
        ctx.font = `700 ${portrait ? 20 : 17}px "Plus Jakarta Sans", "Inter", sans-serif`; ctx.fillStyle = '#fff'; ctx.textBaseline = 'top'; ctx.fillText(props.speakerName || '', imageX + 40, cardY + 13);
        ctx.font = `600 ${portrait ? 11 : 10}px "Plus Jakarta Sans", "Inter", sans-serif`; ctx.fillStyle = accent; ctx.fillText((props.speakerRole || '').toUpperCase(), imageX + 40, cardY + (portrait ? 42 : 39));
      }
    } catch { /* image is optional */ }
  }

  ctx.save();
  const scale = clamp(props.textScale || 1, .76, 1.05);
  const maxTitleLines = portrait ? 4 : (t === 'minimalistic' ? 3 : 4);
  const titleStart = (portrait ? 66 : 62) * scale * (t === 'youtube_bold' ? 1.08 : t === 'minimalistic' ? .94 : 1);
  const titleFit = fitTitle(ctx, title, textW, maxTitleLines, titleStart, portrait ? 40 : 34);
  let y = textY;

  if (props.brandName) {
    ctx.font = `800 ${portrait ? 15 : 13}px "Plus Jakarta Sans", "Inter", sans-serif`; ctx.fillStyle = accent; ctx.textBaseline = 'top'; ctx.letterSpacing = '0px';
    ctx.fillText(props.brandName.toUpperCase(), textX, y); y += portrait ? 31 : 28;
  }

  if (props.category) {
    const label = props.category.toUpperCase().slice(0, 28);
    ctx.font = `700 ${portrait ? 11 : 10}px "Plus Jakarta Sans", "Inter", sans-serif`;
    const w = ctx.measureText(label).width + 22; const h = portrait ? 26 : 24;
    rounded(ctx, textX, y, w, h, h / 2, p.soft, `${accent}55`);
    ctx.fillStyle = accent; ctx.textBaseline = 'middle'; ctx.fillText(label, textX + 11, y + h / 2); y += h + (portrait ? 22 : 18);
  }

  drawTextLines(ctx, titleFit.lines, textX, y, titleFit.size, p.ink, t === 'minimalistic' ? 1.0 : 1.04);
  y += titleFit.lines.length * titleFit.size * (t === 'minimalistic' ? 1.0 : 1.04) + (portrait ? 22 : 18);

  if (subtitle) {
    ctx.font = `400 ${portrait ? 19 : 17}px "Inter", sans-serif`; ctx.fillStyle = p.muted; ctx.textBaseline = 'top';
    y = wrapText(ctx, subtitle, textX, y, textW, portrait ? 28 : 25, portrait ? 4 : 3) + (portrait ? 22 : 18);
  }

  if (tagList.length && props.showKeyPills) {
    let x = textX;
    ctx.font = `700 ${portrait ? 10 : 9}px "Plus Jakarta Sans", "Inter", sans-serif`;
    for (const tag of tagList) {
      const tw = Math.min(textW * .46, ctx.measureText(tag.toUpperCase()).width + 20);
      if (x + tw > textX + textW) break;
      rounded(ctx, x, y, tw, portrait ? 26 : 24, 12, 'rgba(255,255,255,.045)', 'rgba(255,255,255,.10)');
      ctx.fillStyle = p.muted; ctx.textBaseline = 'middle'; ctx.fillText(tag.toUpperCase(), x + 10, y + (portrait ? 13 : 12)); x += tw + 7;
    }
  }

  if (props.showFooterLinks && props.footerLinks?.length) {
    const links = props.footerLinks.slice(0, 3).filter(Boolean);
    ctx.font = `500 ${portrait ? 9 : 9}px "Inter", sans-serif`; ctx.fillStyle = 'rgba(255,255,255,.58)'; ctx.textBaseline = 'alphabetic';
    const footer = links.join('   ·   ');
    ctx.fillText(footer, textX, height - pad * .7);
  }

  // Theme-specific final polish.
  if (t === 'youtube_bold') {
    ctx.fillStyle = `${accent}22`; ctx.fillRect(0, height * .82, width, height * .18);
  } else if (t === 'tech_saas') {
    ctx.fillStyle = `${accent}18`; ctx.fillRect(width - pad * .6, 0, pad * .6, height);
  } else if (t === 'ethereal') {
    const soft = ctx.createRadialGradient(width * .78, height * .18, 0, width * .78, height * .18, width * .35); soft.addColorStop(0, `${accent}18`); soft.addColorStop(1, 'transparent'); ctx.fillStyle = soft; ctx.fillRect(0,0,width,height);
  }
  ctx.restore();
};
