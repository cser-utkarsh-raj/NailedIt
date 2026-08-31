import { CanvasTemplateProps } from '../../types';
import {
  loadImage,
  wrapText,
  drawContainImage,
  drawCoverImage,
  roundRectPath,
  drawLetterSpacedText,
  clamp,
  Rect,
  getLinkIconAndLabel,
} from '../../utils/canvasUtils';

export const renderTechSaaS = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {
  const isPortrait = height > width;

  // 1. PALETTE SYSTEM
  const accents = {
    midnight: { primary: '#818CF8', glow: 'rgba(129, 140, 248, 0.35)', bg: '#080816' },
    digital: { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.25)', bg: '#060B12' },
    emerald: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.25)', bg: '#06120E' },
    crimson: { primary: '#F43F5E', glow: 'rgba(244, 63, 94, 0.25)', bg: '#120609' },
    obsidian: { primary: '#E2E8F0', glow: 'rgba(255, 255, 255, 0.15)', bg: '#050507' },
    corporate: { primary: '#38BDF8', glow: 'rgba(56, 189, 248, 0.30)', bg: '#0C1B33' },
  };

  const accentScheme = accents[props.bgStyle as keyof typeof accents] || accents.midnight;
  const accent = accentScheme.primary;

  // 2. BACKGROUND RENDERING (Dark Mode Grid & Radiant Ambient Beacon)
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = accentScheme.bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle Matrix Dot Grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  const dotSpacing = Math.max(28, Math.min(width, height) * 0.045);
  for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
    for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Radial Beacon Glow
  const glowX = isPortrait ? width * 0.5 : width * 0.82;
  const glowY = isPortrait ? height * 0.25 : height * 0.45;
  const glowR = Math.max(width, height) * 0.65;
  const radGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
  radGrad.addColorStop(0, accentScheme.glow);
  radGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. LAYOUT REGIONS
  const outerPad = Math.max(30, Math.min(width, height) * (isPortrait ? 0.05 : 0.055));
  let textRegion: Rect;
  let imageRegion: Rect;

  if (isPortrait) {
    textRegion = {
      x: outerPad,
      y: outerPad + 20,
      w: width - outerPad * 2,
      h: height * 0.44,
    };
    imageRegion = {
      x: outerPad,
      y: height * 0.49,
      w: width - outerPad * 2,
      h: height * 0.44,
    };
  } else {
    textRegion = {
      x: outerPad,
      y: outerPad,
      w: width * 0.52,
      h: height - outerPad * 2,
    };
    imageRegion = {
      x: width * 0.56,
      y: outerPad,
      w: width * 0.38,
      h: height - outerPad * 2,
    };
  }

  // 4. SPEAKER IMAGE (Tech Terminal Window Frame)
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = clamp(props.speakerScale || 1, 0.5, 3);
      const sx = props.speakerX || 0;
      const sy = props.speakerY || 0;

      const cardW = imageRegion.w;
      const cardH = imageRegion.h;
      const cardX = imageRegion.x;
      const cardY = imageRegion.y;
      const radius = 16;

      // Terminal Card Container
      ctx.save();
      roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Clean Image Viewport Frame
      const viewX = cardX;
      const viewY = cardY;
      const viewW = cardW;
      const viewH = cardH;

      ctx.save();
      roundRectPath(ctx, viewX, viewY, viewW, viewH, radius);
      ctx.clip();

      const cx = viewX + viewW / 2;
      const cy = viewY + viewH / 2;
      ctx.translate(cx + sx, cy + sy);
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -viewW / 2, -viewH / 2, viewW, viewH, 'center', 'smart');
      ctx.restore();

      // Subtle cyan/accent border highlight
      ctx.save();
      roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.strokeStyle = accent + '50';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } catch {}
  }

  // 5. INDEPENDENT LOGO LAYER
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const logoScale = clamp(props.logoScale || 1, 0.5, 3);
      const logoSize = Math.min(80, width * 0.15);
      const lx = props.logoX || 0;
      const ly = props.logoY || 0;

      const baseLogoX = outerPad;
      const baseLogoY = outerPad;

      ctx.save();
      drawContainImage(
        ctx,
        logo,
        baseLogoX + lx,
        baseLogoY + ly,
        logoSize * logoScale,
        logoSize * logoScale,
        'left',
        'top'
      );
      ctx.restore();
    } catch {}
  }

  // 6. INDEPENDENT TEXT CONTENT BLOCK
  const textScale = clamp(props.textScale || 1, 0.6, 2);
  const textOffsetX = props.textX || 0;
  const textOffsetY = props.textY || 0;

  ctx.save();
  const textOriginX = textRegion.x + textOffsetX;
  const textOriginY = textRegion.y + textOffsetY;
  ctx.translate(textOriginX, textOriginY);
  ctx.scale(textScale, textScale);

  let curY = 0;

  // Category (Glowing Tech Badge with Pulsing Live Dot)
  if (props.category) {
    const catText = props.category.toUpperCase().trim();
    const catFont = isPortrait ? 18 : Math.max(12, 14 * textScale);
    ctx.font = `700 ${catFont}px "Inter", monospace`;
    const catWidth = ctx.measureText(catText).width + (isPortrait ? 50 : 38) * textScale;
    const catHeight = (isPortrait ? 38 : 28) * textScale;

    ctx.save();
    roundRectPath(ctx, 0, curY, catWidth, catHeight, isPortrait ? 8 : 6);
    ctx.fillStyle = accent + '18';
    ctx.fill();
    ctx.strokeStyle = accent + '60';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Glowing Dot
    ctx.beginPath();
    ctx.arc((isPortrait ? 18 : 14) * textScale, curY + catHeight / 2, (isPortrait ? 4.5 : 3.5) * textScale, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(catText, (isPortrait ? 32 : 24) * textScale, curY + catHeight / 2);
    ctx.restore();

    curY += catHeight + (isPortrait ? 28 : 22) * textScale;
  }

  // Title (Ultra Crisp Modern Geometric Sans)
  const titleLength = props.title?.length || 0;
  let titleSize = isPortrait ? 78 : 60;
  if (titleLength > 30) titleSize *= 0.88;
  if (titleLength > 50) titleSize *= 0.78;
  titleSize = clamp(titleSize, isPortrait ? 46 : 32, isPortrait ? 98 : 74);

  ctx.font = `800 ${titleSize}px "Inter", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  curY = wrapText(ctx, props.title || '', 0, curY, textRegion.w, titleSize * 1.14, 4) + (isPortrait ? 24 : 16) * textScale;

  // Subtitle
  if (props.subtitle) {
    const subSize = isPortrait ? 28 : Math.max(16, 22 * textScale);
    ctx.font = `400 ${subSize}px "Inter", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    curY = wrapText(ctx, props.subtitle, 0, curY, textRegion.w, (isPortrait ? 40 : 32) * textScale, 3) + (isPortrait ? 30 : 24) * textScale;
  }

  // Keyword Pills (Terminal Parameter Tags)
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills
      .split(/[,•]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 5);

    const pillFont = isPortrait ? 18 : Math.max(12, 13 * textScale);
    ctx.font = `500 ${pillFont}px "Inter", monospace`;
    const pillH = (isPortrait ? 38 : 28) * textScale;
    const gapX = (isPortrait ? 12 : 10) * textScale;
    const gapY = (isPortrait ? 12 : 10) * textScale;

    let px = 0;
    let py = curY + 6;

    pills.forEach((pill) => {
      const pillLabel = pill;
      const metrics = ctx.measureText(pillLabel);
      const pillW = metrics.width + (isPortrait ? 32 : 22) * textScale;

      if (px + pillW > textRegion.w && px > 0) {
        px = 0;
        py += pillH + gapY;
      }

      ctx.save();
      roundRectPath(ctx, px, py, pillW, pillH, isPortrait ? 8 : 6);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = accent;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pillLabel, px + pillW / 2, py + pillH / 2);
      ctx.restore();

      px += pillW + gapX;
    });
  }

  ctx.restore();

  // --- 8. TERMINAL COMMAND / FOOTER LINKS ---
  if (props.showFooterLinks !== false && props.footerLinks && props.footerLinks.length > 0) {
    const rawLinks = props.footerLinks.slice(0, 4).filter(Boolean);
    if (rawLinks.length > 0) {
      ctx.save();
      const footerY = isPortrait ? height - outerPad - 16 : height - outerPad - 6;
      const fontSz = isPortrait ? 16 : 12;
      ctx.font = `600 ${fontSz}px "Inter", monospace`;

      // Subtle command terminal divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(outerPad, footerY - (isPortrait ? 24 : 18));
      ctx.lineTo(width - outerPad, footerY - (isPortrait ? 24 : 18));
      ctx.stroke();

      let curX = outerPad;
      rawLinks.forEach((link, idx) => {
        const { label } = getLinkIconAndLabel(link);
        const promptSymbol = '>';
        const text = `${promptSymbol} ${label}`;
        const metrics = ctx.measureText(text);
        const itemW = metrics.width + (isPortrait ? 26 : 18);
        const itemH = isPortrait ? 34 : 24;

        if (curX + itemW > width - outerPad && idx > 0) return;

        // Terminal parameter pill
        roundRectPath(ctx, curX, footerY - itemH / 2, itemW, itemH, isPortrait ? 6 : 4);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fill();
        ctx.strokeStyle = accent + '30';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing prompt arrow
        ctx.fillStyle = accent;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(promptSymbol, curX + (isPortrait ? 10 : 8), footerY);

        // Command text
        const promptW = ctx.measureText(promptSymbol + ' ').width;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label, curX + (isPortrait ? 10 : 8) + promptW, footerY);

        curX += itemW + (isPortrait ? 14 : 10);
      });

      ctx.restore();
    }
  }
};
