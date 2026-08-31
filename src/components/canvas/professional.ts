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

export const renderProfessional = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {
  const isPortrait = height > width;

  // 1. EXECUTIVE COLOR PALETTE
  const palettes = {
    midnight: {
      bgTop: '#090D16',
      bgBottom: '#0F172A',
      cardBg: 'rgba(15, 23, 42, 0.75)',
      cardBorder: 'rgba(255, 255, 255, 0.10)',
      ink: '#FFFFFF',
      muted: '#94A3B8',
      accent: '#38BDF8', // Executive Cyan/Sky
      accentSoft: 'rgba(56, 189, 248, 0.14)',
      pillBg: 'rgba(255, 255, 255, 0.05)',
      pillBorder: 'rgba(255, 255, 255, 0.12)',
      gold: '#F59E0B',
    },
    corporate: {
      bgTop: '#F8FAFC',
      bgBottom: '#EEF2F6',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(15, 23, 42, 0.08)',
      ink: '#0F172A',
      muted: '#475569',
      accent: '#2563EB', // Trust Royal Blue
      accentSoft: 'rgba(37, 99, 235, 0.08)',
      pillBg: '#F1F5F9',
      pillBorder: '#CBD5E1',
      gold: '#D97706',
    },
    obsidian: {
      bgTop: '#09090B',
      bgBottom: '#18181B',
      cardBg: 'rgba(24, 24, 27, 0.80)',
      cardBorder: 'rgba(255, 255, 255, 0.09)',
      ink: '#FAFAFA',
      muted: '#A1A1AA',
      accent: '#F4F4F5',
      accentSoft: 'rgba(255, 255, 255, 0.10)',
      pillBg: 'rgba(255, 255, 255, 0.06)',
      pillBorder: 'rgba(255, 255, 255, 0.12)',
      gold: '#FBBF24',
    },
    emerald: {
      bgTop: '#051A14',
      bgBottom: '#0D2E24',
      cardBg: 'rgba(13, 46, 36, 0.80)',
      cardBorder: 'rgba(52, 211, 153, 0.15)',
      ink: '#ECFDF5',
      muted: '#A7F3D0',
      accent: '#34D399',
      accentSoft: 'rgba(52, 211, 153, 0.15)',
      pillBg: 'rgba(255, 255, 255, 0.06)',
      pillBorder: 'rgba(52, 211, 153, 0.20)',
      gold: '#F59E0B',
    },
    crimson: {
      bgTop: '#1A080C',
      bgBottom: '#2D0D15',
      cardBg: 'rgba(45, 13, 21, 0.80)',
      cardBorder: 'rgba(251, 113, 133, 0.15)',
      ink: '#FFF1F2',
      muted: '#FECDD3',
      accent: '#FB7185',
      accentSoft: 'rgba(251, 113, 133, 0.15)',
      pillBg: 'rgba(255, 255, 255, 0.06)',
      pillBorder: 'rgba(251, 113, 133, 0.20)',
      gold: '#F43F5E',
    },
    digital: {
      bgTop: '#060E1A',
      bgBottom: '#0C1E36',
      cardBg: 'rgba(12, 30, 54, 0.80)',
      cardBorder: 'rgba(56, 189, 248, 0.15)',
      ink: '#F0F9FF',
      muted: '#BAE6FD',
      accent: '#0284C7',
      accentSoft: 'rgba(2, 132, 199, 0.18)',
      pillBg: 'rgba(255, 255, 255, 0.06)',
      pillBorder: 'rgba(56, 189, 248, 0.20)',
      gold: '#38BDF8',
    },
  };

  const palette = palettes[props.bgStyle as keyof typeof palettes] || palettes.midnight;

  // 2. BACKGROUND RENDERING
  ctx.clearRect(0, 0, width, height);

  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, palette.bgTop);
  bgGrad.addColorStop(1, palette.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft executive directional glow
  const glowGrad = ctx.createRadialGradient(
    isPortrait ? width * 0.5 : width * 0.82,
    isPortrait ? height * 0.25 : height * 0.35,
    0,
    isPortrait ? width * 0.5 : width * 0.82,
    isPortrait ? height * 0.25 : height * 0.35,
    Math.max(width, height) * 0.65
  );
  glowGrad.addColorStop(0, palette.accentSoft);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle architectural hairline grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridStep = Math.min(width, height) * 0.14;
  for (let x = 0; x < width; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 3. LAYOUT REGIONS
  const outerPad = Math.max(34, Math.min(width, height) * (isPortrait ? 0.05 : 0.06));

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
      w: width * 0.53,
      h: height - outerPad * 2,
    };
    imageRegion = {
      x: width * 0.57,
      y: outerPad,
      w: width * 0.37,
      h: height - outerPad * 2,
    };
  }

  // 4. SPEAKER SECTION (Executive Frosted Card)
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
      const radius = isPortrait ? 24 : 18;

      // Executive Card Container
      ctx.save();
      roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.fillStyle = palette.cardBg;
      ctx.fill();
      ctx.strokeStyle = palette.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Top subtle accent bar
      ctx.fillStyle = palette.accent;
      roundRectPath(ctx, cardX + cardW * 0.2, cardY, cardW * 0.6, isPortrait ? 4 : 3, 2);
      ctx.fill();
      ctx.restore();

      // Portrait Image Viewport
      const photoPad = Math.max(14, cardW * 0.035);
      const photoW = cardW - photoPad * 2;
      const photoH = isPortrait ? cardH * 0.74 : cardH * 0.72;
      const photoX = cardX + photoPad;
      const photoY = cardY + photoPad;
      const photoRadius = isPortrait ? 18 : 14;

      ctx.save();
      roundRectPath(ctx, photoX, photoY, photoW, photoH, photoRadius);
      ctx.clip();

      const cx = photoX + photoW / 2;
      const cy = photoY + photoH / 2;
      ctx.translate(cx + sx, cy + sy);
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -photoW / 2, -photoH / 2, photoW, photoH, 'center', 'smart');
      ctx.restore();

      // Inner stroke on photo
      ctx.save();
      roundRectPath(ctx, photoX, photoY, photoW, photoH, photoRadius);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Speaker Name & Role
      const infoY = photoY + photoH + (isPortrait ? 16 : 12);
      if (props.speakerName) {
        ctx.font = `700 ${isPortrait ? 24 : Math.max(16, cardW * 0.052)}px "Plus Jakarta Sans", "Inter", sans-serif`;
        ctx.fillStyle = palette.ink;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(props.speakerName, cardX + cardW / 2, infoY);
      }
      if (props.speakerRole) {
        ctx.font = `600 ${isPortrait ? 16 : Math.max(12, cardW * 0.036)}px "Plus Jakarta Sans", "Inter", sans-serif`;
        ctx.fillStyle = palette.accent;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(props.speakerRole.toUpperCase(), cardX + cardW / 2, infoY + (isPortrait ? 30 : Math.max(22, cardW * 0.065)));
      }
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

  if (props.brandName) {
    const brandSize = isPortrait ? 20 : Math.max(13, 15 * textScale);
    ctx.font = `800 ${brandSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
    ctx.fillStyle = palette.accent;
    ctx.textBaseline = 'top';
    drawLetterSpacedText(ctx, props.brandName.toUpperCase(), 0, curY, (isPortrait ? 4 : 3.5) * textScale, 'left');
    curY += (isPortrait ? 34 : 28) * textScale;
  }

  // Category Tag (Executive Sleek Capsule)
  if (props.category) {
    const catText = props.category.toUpperCase().trim();
    const catFontSize = isPortrait ? 18 : Math.max(12, 13 * textScale);
    ctx.font = `700 ${catFontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
    const catWidth = ctx.measureText(catText).width + (isPortrait ? 32 : 24) * textScale;
    const catHeight = (isPortrait ? 36 : 26) * textScale;

    ctx.save();
    roundRectPath(ctx, 0, curY, catWidth, catHeight, isPortrait ? 8 : 6);
    ctx.fillStyle = palette.accentSoft;
    ctx.fill();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(catText, catWidth / 2, curY + catHeight / 2 + 0.5);
    ctx.restore();

    curY += catHeight + (isPortrait ? 28 : 22) * textScale;
  }

  // Main Title (Elite Plus Jakarta Sans 800 ExtraBold)
  const titleLength = props.title?.length || 0;
  let titleSize = isPortrait ? 80 : 62;
  if (titleLength > 30) titleSize *= 0.88;
  if (titleLength > 50) titleSize *= 0.78;
  titleSize = clamp(titleSize, isPortrait ? 46 : 34, isPortrait ? 100 : 76);

  ctx.font = `800 ${titleSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
  ctx.fillStyle = palette.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  curY = wrapText(ctx, props.title || '', 0, curY, textRegion.w, titleSize * 1.16, 4) + (isPortrait ? 24 : 16) * textScale;

  // Subtitle
  if (props.subtitle) {
    const subSize = isPortrait ? 30 : Math.max(16, 22 * textScale);
    ctx.font = `400 ${subSize}px "Inter", sans-serif`;
    ctx.fillStyle = palette.muted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    curY = wrapText(ctx, props.subtitle, 0, curY, textRegion.w, (isPortrait ? 42 : 32) * textScale, 3) + (isPortrait ? 30 : 24) * textScale;
  }

  // Keyword Pills (Clean Corporate Badges)
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills
      .split(/[,•]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 5);

    const pillFont = isPortrait ? 18 : Math.max(12, 13 * textScale);
    ctx.font = `600 ${pillFont}px "Plus Jakarta Sans", "Inter", sans-serif`;
    const pillH = (isPortrait ? 38 : 28) * textScale;
    const gapX = (isPortrait ? 12 : 10) * textScale;
    const gapY = (isPortrait ? 12 : 10) * textScale;

    let px = 0;
    let py = curY + 6;

    pills.forEach((pill) => {
      const metrics = ctx.measureText(pill);
      const pillW = metrics.width + (isPortrait ? 34 : 24) * textScale;

      if (px + pillW > textRegion.w && px > 0) {
        px = 0;
        py += pillH + gapY;
      }

      ctx.save();
      roundRectPath(ctx, px, py, pillW, pillH, isPortrait ? 8 : 6);
      ctx.fillStyle = palette.pillBg;
      ctx.fill();
      ctx.strokeStyle = palette.pillBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = palette.ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pill, px + pillW / 2, py + pillH / 2);
      ctx.restore();

      px += pillW + gapX;
    });
  }

  ctx.restore();

  // --- 8. EXECUTIVE FOOTER LINKS BAR ---
  if (props.showFooterLinks !== false && props.footerLinks && props.footerLinks.length > 0) {
    const rawLinks = props.footerLinks.slice(0, 4).filter(Boolean);
    if (rawLinks.length > 0) {
      ctx.save();
      const footerY = isPortrait ? height - outerPad - 16 : height - outerPad - 6;
      const fontSz = isPortrait ? 18 : 13;
      ctx.font = `600 ${fontSz}px "Plus Jakarta Sans", "Inter", sans-serif`;

      // Delicate hairline divider rule
      ctx.strokeStyle = palette.cardBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(outerPad, footerY - (isPortrait ? 24 : 18));
      ctx.lineTo(width - outerPad, footerY - (isPortrait ? 24 : 18));
      ctx.stroke();

      let curX = outerPad;
      rawLinks.forEach((link, idx) => {
        const { icon, label } = getLinkIconAndLabel(link);
        const displayText = icon === '•' || label.startsWith('@') ? label : `${icon}  ${label}`;
        const metrics = ctx.measureText(displayText);
        const itemW = metrics.width + (isPortrait ? 28 : 20);
        const itemH = isPortrait ? 34 : 24;

        if (curX + itemW > width - outerPad && idx > 0) return; // Prevent horizontal overflow

        // Subtle capsule
        roundRectPath(ctx, curX, footerY - itemH / 2, itemW, itemH, isPortrait ? 8 : 6);
        ctx.fillStyle = palette.pillBg;
        ctx.fill();
        ctx.strokeStyle = palette.pillBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = idx === 0 ? palette.accent : palette.muted;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayText, curX + itemW / 2, footerY);

        curX += itemW + (isPortrait ? 14 : 10);
      });

      ctx.restore();
    }
  }
};
