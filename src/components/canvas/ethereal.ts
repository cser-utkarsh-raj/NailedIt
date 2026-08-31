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

export const renderEthereal = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {
  const isPortrait = height > width;

  // 1. PALETTE SYSTEM
  const palettes = {
    midnight: {
      bg: '#0F1221',
      orb1: 'rgba(99, 102, 241, 0.28)',
      orb2: 'rgba(236, 72, 153, 0.20)',
      ink: '#F8FAFC',
      muted: '#CBD5E1',
      accent: '#A5B4FC',
      border: 'rgba(255, 255, 255, 0.12)',
      pillBg: 'rgba(255, 255, 255, 0.08)',
      pillBorder: 'rgba(255, 255, 255, 0.16)',
      halo: 'rgba(165, 180, 252, 0.35)',
    },
    obsidian: {
      bg: '#0A0A0E',
      orb1: 'rgba(139, 92, 246, 0.22)',
      orb2: 'rgba(59, 130, 246, 0.18)',
      ink: '#FFFFFF',
      muted: '#94A3B8',
      accent: '#C4B5FD',
      border: 'rgba(255, 255, 255, 0.10)',
      pillBg: 'rgba(255, 255, 255, 0.06)',
      pillBorder: 'rgba(255, 255, 255, 0.14)',
      halo: 'rgba(196, 181, 253, 0.30)',
    },
    crimson: {
      bg: '#FFF1F2',
      orb1: 'rgba(244, 63, 94, 0.18)',
      orb2: 'rgba(251, 146, 60, 0.15)',
      ink: '#4C0519',
      muted: '#9F1239',
      accent: '#E11D48',
      border: 'rgba(225, 29, 72, 0.15)',
      pillBg: 'rgba(255, 255, 255, 0.70)',
      pillBorder: 'rgba(225, 29, 72, 0.20)',
      halo: 'rgba(244, 63, 94, 0.25)',
    },
    emerald: {
      bg: '#F0FDF4',
      orb1: 'rgba(16, 185, 129, 0.18)',
      orb2: 'rgba(14, 165, 233, 0.15)',
      ink: '#064E3B',
      muted: '#047857',
      accent: '#059669',
      border: 'rgba(5, 150, 105, 0.15)',
      pillBg: 'rgba(255, 255, 255, 0.75)',
      pillBorder: 'rgba(5, 150, 105, 0.20)',
      halo: 'rgba(16, 185, 129, 0.25)',
    },
    corporate: {
      bg: '#F8FAFC',
      orb1: 'rgba(59, 130, 246, 0.16)',
      orb2: 'rgba(147, 51, 234, 0.12)',
      ink: '#0F172A',
      muted: '#475569',
      accent: '#2563EB',
      border: 'rgba(37, 99, 235, 0.15)',
      pillBg: 'rgba(255, 255, 255, 0.75)',
      pillBorder: 'rgba(37, 99, 235, 0.20)',
      halo: 'rgba(59, 130, 246, 0.25)',
    },
    digital: {
      bg: '#050B14',
      orb1: 'rgba(6, 182, 212, 0.25)',
      orb2: 'rgba(99, 102, 241, 0.22)',
      ink: '#F0FDF4',
      muted: '#7DD3FC',
      accent: '#38BDF8',
      border: 'rgba(56, 189, 248, 0.15)',
      pillBg: 'rgba(255, 255, 255, 0.07)',
      pillBorder: 'rgba(56, 189, 248, 0.25)',
      halo: 'rgba(56, 189, 248, 0.35)',
    },
  };

  const palette = palettes[props.bgStyle as keyof typeof palettes] || palettes.midnight;

  // 2. BACKGROUND RENDERING (Dreamy Atmosphere)
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Aura Orbs
  const orbRadius1 = Math.max(width, height) * 0.55;
  const orbGrad1 = ctx.createRadialGradient(
    isPortrait ? width * 0.8 : width * 0.75,
    isPortrait ? height * 0.3 : height * 0.35,
    0,
    isPortrait ? width * 0.8 : width * 0.75,
    isPortrait ? height * 0.3 : height * 0.35,
    orbRadius1
  );
  orbGrad1.addColorStop(0, palette.orb1);
  orbGrad1.addColorStop(1, 'transparent');
  ctx.fillStyle = orbGrad1;
  ctx.fillRect(0, 0, width, height);

  const orbRadius2 = Math.max(width, height) * 0.45;
  const orbGrad2 = ctx.createRadialGradient(
    width * 0.2,
    height * 0.8,
    0,
    width * 0.2,
    height * 0.8,
    orbRadius2
  );
  orbGrad2.addColorStop(0, palette.orb2);
  orbGrad2.addColorStop(1, 'transparent');
  ctx.fillStyle = orbGrad2;
  ctx.fillRect(0, 0, width, height);

  // Hairline Delicate Arch/Frame border
  const framePad = Math.max(24, Math.min(width, height) * (isPortrait ? 0.04 : 0.035));
  ctx.save();
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 1;
  roundRectPath(ctx, framePad, framePad, width - framePad * 2, height - framePad * 2, 16);
  ctx.stroke();
  ctx.restore();

  // 3. LAYOUT REGIONS
  const innerPad = framePad + Math.min(width, height) * 0.04;
  const hasSpeaker = Boolean(props.showSpeaker && props.speakerImageUrl);
  let textRegion: Rect;
  let imageRegion: Rect;

  if (isPortrait) {
    if (hasSpeaker) {
      textRegion = {
        x: innerPad,
        y: innerPad + 20,
        w: width - innerPad * 2,
        h: height * 0.44,
      };
      imageRegion = {
        x: innerPad,
        y: height * 0.49,
        w: width - innerPad * 2,
        h: height * 0.44,
      };
    } else {
      textRegion = {
        x: innerPad,
        y: innerPad + 30,
        w: width - innerPad * 2,
        h: height - innerPad * 2 - 60,
      };
      imageRegion = { x: 0, y: 0, w: 0, h: 0 };
    }
  } else {
    if (hasSpeaker) {
      textRegion = {
        x: innerPad,
        y: innerPad,
        w: width * 0.52,
        h: height - innerPad * 2,
      };
      imageRegion = {
        x: width * 0.58,
        y: innerPad + 10,
        w: width * 0.35,
        h: height - innerPad * 2 - 20,
      };
    } else {
      textRegion = {
        x: innerPad + 20,
        y: innerPad + 10,
        w: width - innerPad * 2 - 40,
        h: height - innerPad * 2 - 20,
      };
      imageRegion = { x: 0, y: 0, w: 0, h: 0 };
    }
  }

  // 4. SPEAKER IMAGE (Clean Sophisticated Frame)
  if (hasSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = clamp(props.speakerScale || 1, 0.5, 3);
      const sx = props.speakerX || 0;
      const sy = props.speakerY || 0;

      const portalW = imageRegion.w;
      const portalH = imageRegion.h;
      const portalX = imageRegion.x;
      const portalY = imageRegion.y;
      const cornerRadius = 20;

      // Soft Ambient Glow
      ctx.save();
      ctx.shadowColor = palette.halo;
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      roundRectPath(ctx, portalX, portalY, portalW, portalH, cornerRadius);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Image Masking inside Card
      ctx.save();
      roundRectPath(ctx, portalX, portalY, portalW, portalH, cornerRadius);
      ctx.clip();

      const cx = portalX + portalW / 2;
      const cy = portalY + portalH / 2;
      ctx.translate(cx + sx, cy + sy);
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -portalW / 2, -portalH / 2, portalW, portalH, 'center', 'smart');
      ctx.restore();

      // Delicate Hairline Border
      ctx.save();
      roundRectPath(ctx, portalX, portalY, portalW, portalH, cornerRadius);
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
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

      const baseLogoX = innerPad;
      const baseLogoY = innerPad;

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

  // Category (Editorial Wide Letter Spaced)
  if (props.category) {
    const catSize = isPortrait ? 22 : Math.max(14, 18 * textScale);
    ctx.font = `400 ${catSize}px "Playfair Display", serif`;
    ctx.fillStyle = palette.accent;
    ctx.textBaseline = 'top';
    drawLetterSpacedText(ctx, props.category.toUpperCase().trim(), 0, curY, (isPortrait ? 9 : 8) * textScale, 'left');
    curY += (isPortrait ? 40 : 34) * textScale;
  }

  // Main Title (Italic Ethereal Serif)
  const titleLength = props.title?.length || 0;
  let titleSize = isPortrait ? 78 : 64;
  if (titleLength > 30) titleSize *= 0.88;
  if (titleLength > 50) titleSize *= 0.78;
  titleSize = clamp(titleSize, isPortrait ? 46 : 34, isPortrait ? 98 : 76);

  ctx.font = `italic 400 ${titleSize}px "Playfair Display", serif`;
  ctx.fillStyle = palette.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  curY = wrapText(ctx, props.title || '', 0, curY, textRegion.w, titleSize * 1.14, 4) + (isPortrait ? 24 : 18) * textScale;

  // Subtitle
  if (props.subtitle) {
    const subSize = isPortrait ? 28 : Math.max(16, 22 * textScale);
    ctx.font = `300 ${subSize}px "Inter", sans-serif`;
    ctx.fillStyle = palette.muted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    curY = wrapText(ctx, props.subtitle, 0, curY, textRegion.w, (isPortrait ? 40 : 32) * textScale, 3) + (isPortrait ? 32 : 26) * textScale;
  }

  // Keyword Pills (Frosted Glass Aesthetic)
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills
      .split(/[,•]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 5);

    const pillFont = isPortrait ? 18 : Math.max(12, 14 * textScale);
    ctx.font = `400 ${pillFont}px "Inter", sans-serif`;
    const pillH = (isPortrait ? 38 : 28) * textScale;
    const gapX = (isPortrait ? 12 : 10) * textScale;
    const gapY = (isPortrait ? 12 : 10) * textScale;

    let px = 0;
    let py = curY + 6;

    pills.forEach((pill) => {
      const metrics = ctx.measureText(pill);
      const pillW = metrics.width + (isPortrait ? 32 : 24) * textScale;

      if (px + pillW > textRegion.w && px > 0) {
        px = 0;
        py += pillH + gapY;
      }

      ctx.save();
      roundRectPath(ctx, px, py, pillW, pillH, pillH / 2);
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

  // --- 8. CELESTIAL ETHEREAL FOOTER LINKS ---
  if (props.showFooterLinks !== false && props.footerLinks && props.footerLinks.length > 0) {
    const rawLinks = props.footerLinks.slice(0, 4).filter(Boolean);
    if (rawLinks.length > 0) {
      ctx.save();
      const footerY = isPortrait ? height - innerPad - 14 : height - innerPad - 4;
      const fontSz = isPortrait ? 18 : 13;
      ctx.font = `italic 400 ${fontSz}px "Playfair Display", serif`;

      // Delicate ethereal hairline divider
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(innerPad, footerY - (isPortrait ? 24 : 18));
      ctx.lineTo(width - innerPad, footerY - (isPortrait ? 24 : 18));
      ctx.stroke();

      let curX = innerPad;
      rawLinks.forEach((link, idx) => {
        const { label } = getLinkIconAndLabel(link);
        const starGlyph = '✦';
        const text = `${starGlyph}  ${label}`;
        const metrics = ctx.measureText(text);
        const itemW = metrics.width + (isPortrait ? 30 : 22);
        const itemH = isPortrait ? 34 : 24;

        if (curX + itemW > width - innerPad && idx > 0) return;

        // Frosted curved capsule
        roundRectPath(ctx, curX, footerY - itemH / 2, itemW, itemH, itemH / 2);
        ctx.fillStyle = palette.pillBg;
        ctx.fill();
        ctx.strokeStyle = palette.pillBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Star glyph
        ctx.fillStyle = palette.accent;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(starGlyph, curX + (isPortrait ? 12 : 9), footerY);

        // Label
        const starW = ctx.measureText(starGlyph + '  ').width;
        ctx.fillStyle = palette.ink;
        ctx.fillText(label, curX + (isPortrait ? 12 : 9) + starW, footerY);

        curX += itemW + (isPortrait ? 14 : 10);
      });

      ctx.restore();
    }
  }
};
