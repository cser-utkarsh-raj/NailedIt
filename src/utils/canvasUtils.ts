export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const imageCache = new Map<string, HTMLImageElement>();

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

export const roundRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void => {
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

export const drawLetterSpacedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: CanvasTextAlign = 'left'
): void => {
  if (!text) return;
  const characters = [...text];
  const widths = characters.map((char) => ctx.measureText(char).width);
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    spacing * Math.max(0, characters.length - 1);

  let cursor = x;
  if (align === 'center') cursor -= totalWidth / 2;
  if (align === 'right') cursor -= totalWidth;

  const originalAlign = ctx.textAlign;
  ctx.textAlign = 'left';

  characters.forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += widths[index] + spacing;
  });

  ctx.textAlign = originalAlign;
};

export const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 5
): number => {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1 && n < words.length - 1) {
        // Truncate if exceeding max lines
        line = words.slice(n).join(' ') + '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
};

export const drawCoverImage = (
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number,
  alignX: 'left' | 'center' | 'right' = 'center',
  alignY: 'top' | 'center' | 'bottom' | 'smart' = 'smart'
): void => {
  const imageElement = img as HTMLImageElement;
  const nw = typeof imageElement.naturalWidth === 'number' && imageElement.naturalWidth > 0
    ? imageElement.naturalWidth
    : (typeof (img as any).width === 'number' ? (img as any).width : w);
  const nh = typeof imageElement.naturalHeight === 'number' && imageElement.naturalHeight > 0
    ? imageElement.naturalHeight
    : (typeof (img as any).height === 'number' ? (img as any).height : h);

  const imgRatio = nw / nh;
  const targetRatio = w / h;

  let sx = 0, sy = 0, sw = nw, sh = nh;

  if (imgRatio > targetRatio) {
    // Image is wider than target ratio -> horizontal crop
    sw = nh * targetRatio;
    if (alignX === 'center') sx = (nw - sw) / 2;
    else if (alignX === 'right') sx = nw - sw;
    else if (alignX === 'left') sx = 0;
  } else {
    // Image is TALLER than target ratio -> vertical crop
    sh = nw / targetRatio;
    const heightExcess = nh - sh;

    if (alignY === 'top') {
      sy = 0;
    } else if (alignY === 'bottom') {
      sy = heightExcess;
    } else if (alignY === 'center') {
      // If the image is extremely tall (e.g. portrait or full-body photo),
      // pure dead-center cuts off the head and focuses on thighs.
      // We automatically apply smart portrait framing if nh is significantly taller than nw.
      if (nh > nw * 1.25) {
        sy = Math.min(heightExcess * 0.18, nh * 0.12);
      } else if (nh > nw) {
        sy = heightExcess * 0.28;
      } else {
        sy = heightExcess / 2;
      }
    } else {
      // 'smart' mode: Intelligent portrait focal positioning (rule of thirds / upper body focus)
      if (nh > nw * 1.4) {
        // Very tall portrait or full-body photo -> focus on upper 15-20% (face & head)
        sy = Math.min(heightExcess * 0.16, nh * 0.10);
      } else if (nh > nw * 1.1) {
        // Standard portrait photo -> focus on upper 25% (eyes / shoulders)
        sy = heightExcess * 0.24;
      } else {
        // Square or slight landscape -> gentle upper-center bias
        sy = heightExcess * 0.35;
      }
    }
    
    // Safety clamp
    sy = Math.max(0, Math.min(sy, heightExcess));
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
};

export const drawContainImage = (
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  y: number,
  maxW: number,
  maxH: number,
  alignX: 'left' | 'center' | 'right' = 'center',
  alignY: 'top' | 'center' | 'bottom' = 'center'
): void => {
  const imageElement = img as HTMLImageElement;
  const nw = typeof imageElement.naturalWidth === 'number' && imageElement.naturalWidth > 0
    ? imageElement.naturalWidth
    : (typeof (img as any).width === 'number' ? (img as any).width : maxW);
  const nh = typeof imageElement.naturalHeight === 'number' && imageElement.naturalHeight > 0
    ? imageElement.naturalHeight
    : (typeof (img as any).height === 'number' ? (img as any).height : maxH);

  const ratio = Math.min(maxW / nw, maxH / nh);
  const w = nw * ratio;
  const h = nh * ratio;

  let dx = x;
  let dy = y;

  if (alignX === 'center') dx = x + (maxW - w) / 2;
  else if (alignX === 'right') dx = x + maxW - w;

  if (alignY === 'center') dy = y + (maxH - h) / 2;
  else if (alignY === 'bottom') dy = y + maxH - h;

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

