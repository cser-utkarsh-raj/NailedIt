export type Rect = { x: number; y: number; w: number; h: number };

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const imageCache = new Map<string, HTMLImageElement>();
const imagePromiseCache = new Map<string, Promise<HTMLImageElement>>();

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(src);
  if (cached?.complete && cached.naturalWidth > 0) return Promise.resolve(cached);
  const pending = imagePromiseCache.get(src);
  if (pending) return pending;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imageCache.set(src, img); imagePromiseCache.delete(src); resolve(img); };
    img.onerror = (err) => { imagePromiseCache.delete(src); reject(err); };
    img.src = src;
  });
  imagePromiseCache.set(src, promise);
  return promise;
};

export const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void => {
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

export const drawLetterSpacedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, align: CanvasTextAlign = 'left'): void => {
  if (!text) return;
  const characters = [...text];
  const widths = characters.map((char) => ctx.measureText(char).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + spacing * Math.max(0, characters.length - 1);
  let cursor = x;
  if (align === 'center') cursor -= totalWidth / 2;
  if (align === 'right') cursor -= totalWidth;
  const originalAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  characters.forEach((char, index) => { ctx.fillText(char, cursor, y); cursor += widths[index] + spacing; });
  ctx.textAlign = originalAlign;
};

export const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 5): number => {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1 && n < words.length - 1) { line = words.slice(n).join(' ') + '...'; break; }
    } else line = testLine;
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
};

export const drawCoverImage = (ctx: CanvasRenderingContext2D, img: CanvasImageSource, x: number, y: number, w: number, h: number, alignX: 'left' | 'center' | 'right' = 'center', alignY: 'top' | 'center' | 'bottom' | 'smart' = 'smart'): void => {
  const imageElement = img as HTMLImageElement;
  const nw = imageElement.naturalWidth > 0 ? imageElement.naturalWidth : ((img as any).width || w);
  const nh = imageElement.naturalHeight > 0 ? imageElement.naturalHeight : ((img as any).height || h);
  const imgRatio = nw / nh;
  const targetRatio = w / h;
  let sx = 0, sy = 0, sw = nw, sh = nh;

  if (imgRatio > targetRatio) {
    sw = nh * targetRatio;
    if (alignX === 'center') sx = (nw - sw) / 2;
    else if (alignX === 'right') sx = nw - sw;
  } else {
    sh = nw / targetRatio;
    const excess = nh - sh;
    if (alignY === 'bottom') sy = excess;
    else if (alignY === 'center') sy = nh > nw * 1.25 ? Math.min(excess * 0.18, nh * 0.12) : nh > nw ? excess * 0.28 : excess / 2;
    else if (alignY === 'smart') sy = nh > nw * 1.4 ? Math.min(excess * 0.16, nh * 0.10) : nh > nw * 1.1 ? excess * 0.24 : excess * 0.35;
    sy = Math.max(0, Math.min(sy, excess));
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
};

export const drawContainImage = (ctx: CanvasRenderingContext2D, img: CanvasImageSource, x: number, y: number, maxW: number, maxH: number, alignX: 'left' | 'center' | 'right' = 'center', alignY: 'top' | 'center' | 'bottom' = 'center'): void => {
  const imageElement = img as HTMLImageElement;
  const nw = imageElement.naturalWidth > 0 ? imageElement.naturalWidth : ((img as any).width || maxW);
  const nh = imageElement.naturalHeight > 0 ? imageElement.naturalHeight : ((img as any).height || maxH);
  const ratio = Math.min(maxW / nw, maxH / nh);
  const w = nw * ratio, h = nh * ratio;
  let dx = x, dy = y;
  if (alignX === 'center') dx = x + (maxW - w) / 2; else if (alignX === 'right') dx = x + maxW - w;
  if (alignY === 'center') dy = y + (maxH - h) / 2; else if (alignY === 'bottom') dy = y + maxH - h;
  ctx.drawImage(img, dx, dy, w, h);
};

export const getLinkIconAndLabel = (link: string): { icon: string; label: string } => {
  const clean = (link || '').trim();
  const lower = clean.toLowerCase();
  if (lower.includes('youtube') || lower.includes('youtu.be')) return { icon: '▶', label: clean };
  if (lower.includes('github') || lower.includes('git.')) return { icon: '⌘', label: clean };
  if (lower.includes('twitter') || lower.includes('x.com')) return { icon: '𝕏', label: clean };
  if (lower.includes('instagram') || lower.includes('instagr.am')) return { icon: '📸', label: clean };
  if (lower.includes('linkedin')) return { icon: '💼', label: clean };
  if (lower.includes('podcast') || lower.includes('spotify') || lower.includes('apple.')) return { icon: '🎙', label: clean };
  if (clean.startsWith('@')) return { icon: '@', label: clean };
  if (lower.includes('.') || lower.includes('/')) return { icon: '🌐', label: clean };
  return { icon: '•', label: clean };
};
