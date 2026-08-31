export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
};

export const drawCoverImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > canvasRatio) {
    sh = img.height;
    sw = img.height * canvasRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / canvasRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
};

export const drawContainImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, maxW: number, maxH: number, alignX = 'center', alignY = 'center') => {
  const ratio = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  let dx = x;
  let dy = y;
  if (alignX === 'center') dx = x + (maxW - w) / 2;
  if (alignX === 'right') dx = x + maxW - w;
  if (alignY === 'center') dy = y + (maxH - h) / 2;
  if (alignY === 'bottom') dy = y + maxH - h;
  ctx.drawImage(img, dx, dy, w, h);
};

export const drawTransformedImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number = 1,
  offsetX: number = 0,
  offsetY: number = 0,
  objectFit: 'cover' | 'contain' = 'cover',
  alignX: 'left' | 'center' | 'right' = 'center',
  alignY: 'top' | 'center' | 'bottom' = 'center'
) => {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const imgRatio = img.width / img.height;
  const boxRatio = w / h;

  let drawW, drawH;

  if (objectFit === 'cover') {
    if (imgRatio > boxRatio) {
      drawH = h;
      drawW = h * imgRatio;
    } else {
      drawW = w;
      drawH = w / imgRatio;
    }
  } else {
    if (imgRatio > boxRatio) {
      drawW = w;
      drawH = w / imgRatio;
    } else {
      drawH = h;
      drawW = h * imgRatio;
    }
  }

  // Calculate base position (centered by default for cover)
  let baseX = x + (w - drawW) / 2;
  let baseY = y + (h - drawH) / 2;

  if (objectFit === 'contain') {
    if (alignX === 'left') baseX = x;
    else if (alignX === 'right') baseX = x + w - drawW;
    
    if (alignY === 'top') baseY = y;
    else if (alignY === 'bottom') baseY = y + h - drawH;
  }

  const cx = baseX + drawW / 2;
  const cy = baseY + drawH / 2;
  
  const scaledW = drawW * scale;
  const scaledH = drawH * scale;

  ctx.translate(cx + offsetX, cy + offsetY);
  ctx.drawImage(img, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
  ctx.restore();
};
