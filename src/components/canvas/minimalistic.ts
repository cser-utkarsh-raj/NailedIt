import { CanvasTemplateProps } from '../../types';
import {
  loadImage,
  wrapText,
  drawContainImage,
  drawCoverImage,
  drawLetterSpacedText,
  clamp,
  Rect,
  getLinkIconAndLabel,
} from '../../utils/canvasUtils';

export const renderMinimalistic = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {
  const isPortrait = height > width;

  // 1. DIVERSE ARCHITECTURAL PALETTES (Dark, Warm, Deep Color & Light Variations)
  const palettes = {
    obsidian: {
      bg: '#09090B',
      cardBg: '#121216',
      ink: '#FAFAFA',
      muted: '#A1A1AA',
      line: 'rgba(255, 255, 255, 0.12)',
      accent: '#FACC15', // Bauhaus Amber/Yellow
      pillBg: 'rgba(255, 255, 255, 0.08)',
      pillBorder: 'rgba(255, 255, 255, 0.20)',
    },
    midnight: {
      bg: '#0B132B',
      cardBg: '#111C38',
      ink: '#F8FAFC',
      muted: '#94A3B8',
      line: 'rgba(255, 255, 255, 0.14)',
      accent: '#38BDF8', // Cyan Highlight
      pillBg: 'rgba(56, 189, 248, 0.10)',
      pillBorder: 'rgba(56, 189, 248, 0.30)',
    },
    crimson: {
      bg: '#16080D',
      cardBg: '#220E15',
      ink: '#FFF1F2',
      muted: '#FDA4AF',
      line: 'rgba(251, 113, 133, 0.18)',
      accent: '#F43F5E', // Vivid Rose
      pillBg: 'rgba(244, 63, 94, 0.12)',
      pillBorder: 'rgba(244, 63, 94, 0.35)',
    },
    emerald: {
      bg: '#071A14',
      cardBg: '#0E2920',
      ink: '#ECFDF5',
      muted: '#A7F3D0',
      line: 'rgba(52, 211, 153, 0.18)',
      accent: '#34D399', // Mint Sage
      pillBg: 'rgba(52, 211, 153, 0.12)',
      pillBorder: 'rgba(52, 211, 153, 0.30)',
    },
    digital: {
      bg: '#EAE6DC', // Bauhaus Warm Concrete
      cardBg: '#DFD8CA',
      ink: '#18181B',
      muted: '#52525B',
      line: 'rgba(0, 0, 0, 0.15)',
      accent: '#2563EB', // Cobalt Blue
      pillBg: '#FFFFFF',
      pillBorder: '#18181B',
    },
    corporate: {
    bg: '#081832',
    cardBg: '#10264A',
    ink: '#F8FAFF',
    muted: '#B8C8E0',
    line: 'rgba(148, 163, 184, 0.22)',
    accent: '#4F8CFF',
    pillBg: 'rgba(79, 140, 255, 0.10)',
    pillBorder: 'rgba(96, 165, 250, 0.34)',
  },
  };

  const palette = palettes[props.bgStyle as keyof typeof palettes] || palettes.obsidian;

  // 2. BACKGROUND & ARCHITECTURAL GRID
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  const padX = Math.max(34, width * (isPortrait ? 0.06 : 0.05));
  const topY = Math.max(34, height * (isPortrait ? 0.05 : 0.06));
  const botY = height - topY;

  // Ruled Editorial Grid Lines
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX, 0); ctx.lineTo(padX, height);
  ctx.moveTo(width - padX, 0); ctx.lineTo(width - padX, height);
  ctx.moveTo(0, topY); ctx.lineTo(width, topY);
  ctx.moveTo(0, botY); ctx.lineTo(width, botY);
  ctx.stroke();

  // Color Swatch Accent Indicator
  ctx.fillStyle = palette.accent;
  ctx.fillRect(padX, topY - 4, 36, 4);

  // Crosshair Markers at Grid Intersections
  const crossSize = 6;
  const drawCross = (cx: number, cy: number) => {
    ctx.beginPath();
    ctx.moveTo(cx - crossSize, cy); ctx.lineTo(cx + crossSize, cy);
    ctx.moveTo(cx, cy - crossSize); ctx.lineTo(cx, cy + crossSize);
    ctx.stroke();
  };
  drawCross(padX, topY);
  drawCross(width - padX, topY);
  drawCross(padX, botY);
  drawCross(width - padX, botY);

  // 3. LAYOUT REGIONS
  let textRegion: Rect;
  let imageRegion: Rect;

  if (isPortrait) {
    textRegion = {
      x: padX + 20,
      y: topY + 28,
      w: width - (padX * 2) - 40,
      h: height * 0.44,
    };
    imageRegion = {
      x: padX + 20,
      y: height * 0.49,
      w: width - (padX * 2) - 40,
      h: botY - height * 0.49 - 16,
    };
  } else {
    textRegion = {
      x: padX + 28,
      y: topY + 32,
      w: width * 0.50,
      h: botY - topY - 64,
    };
    imageRegion = {
      x: width * 0.58,
      y: topY + 32,
      w: width - padX - width * 0.58 - 24,
      h: botY - topY - 64,
    };
  }

  // 4. SPEAKER IMAGE (Swiss Framing with Technical Metadata)
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = clamp(props.speakerScale || 1, 0.5, 3);
      const sx = props.speakerX || 0;
      const sy = props.speakerY || 0;

      // Speaker Name Header (if provided)
      if (props.speakerName) {
        ctx.font = `700 ${isPortrait ? 18 : 12}px "Space Grotesk", "Inter", sans-serif`;
        ctx.fillStyle = palette.muted;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(props.speakerName.toUpperCase(), imageRegion.x, imageRegion.y - 8);
      }

      // Image Container Background Card
      ctx.fillStyle = palette.cardBg;
      ctx.fillRect(imageRegion.x, imageRegion.y, imageRegion.w, imageRegion.h);

      // Image Viewport
      ctx.save();
      ctx.beginPath();
      ctx.rect(imageRegion.x, imageRegion.y, imageRegion.w, imageRegion.h);
      ctx.clip();

      const cx = imageRegion.x + imageRegion.w / 2;
      const cy = imageRegion.y + imageRegion.h / 2;
      ctx.translate(cx + sx, cy + sy);
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -imageRegion.w / 2, -imageRegion.h / 2, imageRegion.w, imageRegion.h, 'center', 'smart');
      ctx.restore();

      // Sharp Minimal Frame
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(imageRegion.x, imageRegion.y, imageRegion.w, imageRegion.h);

      // Accent Accent Notch on Speaker Frame
      ctx.fillStyle = palette.accent;
      ctx.fillRect(imageRegion.x, imageRegion.y, 4, isPortrait ? 36 : 24);
    } catch {}
  }

  // 5. INDEPENDENT LOGO LAYER
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const logoScale = clamp(props.logoScale || 1, 0.5, 3);
      const logoSize = Math.min(75, width * 0.15);
      const lx = props.logoX || 0;
      const ly = props.logoY || 0;

      const baseLogoX = padX + (isPortrait ? 20 : 28);
      const baseLogoY = topY + (isPortrait ? 28 : 32);

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

  // Category (Crisp Monospace / Swiss Geometric Eyebrow)
  if (props.category) {
    const catSize = isPortrait ? 18 : Math.max(12, 13 * textScale);
    ctx.font = `800 ${catSize}px "Space Grotesk", "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = palette.accent;
    ctx.textBaseline = 'top';
    drawLetterSpacedText(ctx, props.category.toUpperCase().trim(), 0, curY, (isPortrait ? 4.5 : 3.5) * textScale, 'left');
    curY += (isPortrait ? 34 : 28) * textScale;
  }

  // Title (Heavy Swiss Sans 900)
  const titleLength = props.title?.length || 0;
  let titleSize = isPortrait ? 78 : 64;
  if (titleLength > 30) titleSize *= 0.88;
  if (titleLength > 50) titleSize *= 0.78;
  titleSize = clamp(titleSize, isPortrait ? 46 : 34, isPortrait ? 100 : 76);

  ctx.font = `900 ${titleSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
  ctx.fillStyle = palette.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  curY = wrapText(ctx, props.title || '', 0, curY, textRegion.w, titleSize * 1.12, 4) + (isPortrait ? 24 : 16) * textScale;

  // Modernist Geometric Divider Line
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = isPortrait ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(0, curY);
  ctx.lineTo(Math.min(isPortrait ? 90 : 60, textRegion.w * 0.2), curY);
  ctx.stroke();
  curY += (isPortrait ? 28 : 20) * textScale;

  // Subtitle
  if (props.subtitle) {
    const subSize = isPortrait ? 28 : Math.max(16, 21 * textScale);
    ctx.font = `400 ${subSize}px "Inter", sans-serif`;
    ctx.fillStyle = palette.muted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    curY = wrapText(ctx, props.subtitle, 0, curY, textRegion.w, (isPortrait ? 40 : 30) * textScale, 3) + (isPortrait ? 30 : 26) * textScale;
  }

  // Keyword Pills (Clean Boxed Swiss Badges)
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills
      .split(/[,•]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 5);

    const pillFont = isPortrait ? 17 : Math.max(11, 12 * textScale);
    ctx.font = `700 ${pillFont}px "Space Grotesk", "Plus Jakarta Sans", sans-serif`;
    const pillH = (isPortrait ? 36 : 26) * textScale;
    const gapX = (isPortrait ? 12 : 8) * textScale;
    const gapY = (isPortrait ? 12 : 8) * textScale;

    let px = 0;
    let py = curY + 6;

    pills.forEach((pill) => {
      const metrics = ctx.measureText(pill.toUpperCase());
      const pillW = metrics.width + (isPortrait ? 30 : 20) * textScale;

      if (px + pillW > textRegion.w && px > 0) {
        px = 0;
        py += pillH + gapY;
      }

      ctx.save();
      ctx.fillStyle = palette.pillBg;
      ctx.fillRect(px, py, pillW, pillH);
      ctx.strokeStyle = palette.pillBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, pillW, pillH);

      ctx.fillStyle = palette.ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pill.toUpperCase(), px + pillW / 2, py + pillH / 2);
      ctx.restore();

      px += pillW + gapX;
    });
  }

  ctx.restore();

  // --- 8. SWISS MODERNIST FOOTER LINKS ---
  if (props.showFooterLinks !== false && props.footerLinks && props.footerLinks.length > 0) {
    const rawLinks = props.footerLinks.slice(0, 4).filter(Boolean);
    if (rawLinks.length > 0) {
      ctx.save();
      const footerY = botY - (isPortrait ? 20 : 12);
      const fontSz = isPortrait ? 16 : 12;
      ctx.font = `600 ${fontSz}px "Space Grotesk", "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = palette.muted;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      let curX = padX + 24;
      rawLinks.forEach((link) => {
        const { label } = getLinkIconAndLabel(link);
        const itemW = ctx.measureText(label).width + (isPortrait ? 24 : 16);
        const itemH = isPortrait ? 32 : 22;
        if (curX + itemW > width - padX - 20 && curX > padX + 24) return;
        ctx.fillStyle = palette.cardBg;
        ctx.fillRect(curX, footerY - itemH / 2, itemW, itemH);
        ctx.strokeStyle = palette.pillBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(curX, footerY - itemH / 2, itemW, itemH);
        ctx.fillStyle = palette.ink;
        ctx.fillText(label, curX + (isPortrait ? 10 : 8), footerY);
        curX += itemW + (isPortrait ? 10 : 8);
      });
      ctx.restore();
    }
  }

};
