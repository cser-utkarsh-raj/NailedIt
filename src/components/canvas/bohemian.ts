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

export const renderBohemian = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {
  const isPortrait = height > width;

  // 1. DIVERSE & VIBRANT BOHEMIAN EDITORIAL COLOR PALETTES
  const palettes = {
    // 1. Midnight: Indigo Dusk & Golden Ochre Celestial
    midnight: {
      background: '#131826',
      paper: '#1C2337',
      ink: '#F8F6F0',
      muted: '#A5B0CE',
      accent: '#F59E0B', // Golden Ochre
      accentSoft: 'rgba(245, 158, 11, 0.18)',
      line: 'rgba(255, 255, 255, 0.15)',
      pillBg: 'rgba(245, 158, 11, 0.12)',
      pillBorder: 'rgba(245, 158, 11, 0.35)',
    },
    // 2. Obsidian: Espresso Noir & Terracotta Amber
    obsidian: {
      background: '#1A1614',
      paper: '#26201D',
      ink: '#FAF8F5',
      muted: '#BAAEA6',
      accent: '#E07A5F', // Warm Terracotta
      accentSoft: 'rgba(224, 122, 95, 0.18)',
      line: 'rgba(255, 255, 255, 0.14)',
      pillBg: 'rgba(224, 122, 95, 0.12)',
      pillBorder: 'rgba(224, 122, 95, 0.35)',
    },
    // 3. Corporate: Classic Warm Sand Dune & Earth Clay
    corporate: {
      background: '#F5EFE6',
      paper: '#ECE3D4',
      ink: '#2C2117',
      muted: '#736050',
      accent: '#B85D36', // Rich Terracotta Clay
      accentSoft: '#DFB19B',
      line: '#B8A492',
      pillBg: '#FAF5EE',
      pillBorder: '#B85D36',
    },
    // 4. Emerald: Sage Grove & Forest Botanicals
    emerald: {
      background: '#EAEFE8',
      paper: '#DDE6DA',
      ink: '#1D3025',
      muted: '#526A5A',
      accent: '#2F5C40', // Deep Forest Pine
      accentSoft: '#A8C3B1',
      line: '#88A390',
      pillBg: '#F3F7F2',
      pillBorder: '#2F5C40',
    },
    // 5. Crimson: Desert Rose & Burnt Sienna Sunset
    crimson: {
      background: '#FDF1EF',
      paper: '#F6DFDB',
      ink: '#3B171E',
      muted: '#804853',
      accent: '#C8485B', // Desert Rose Rust
      accentSoft: '#E8A3AE',
      line: '#D2959F',
      pillBg: '#FFF6F5',
      pillBorder: '#C8485B',
    },
    // 6. Digital: Aegean Turquoise Coastal Sand
    digital: {
      background: '#EFF6F7',
      paper: '#DCEBED',
      ink: '#122A2E',
      muted: '#4A6E75',
      accent: '#187A88', // Deep Aegean Sea
      accentSoft: '#85C3CB',
      line: '#76A9B2',
      pillBg: '#F7FBFC',
      pillBorder: '#187A88',
    },
  };

  const palette = palettes[props.bgStyle as keyof typeof palettes] || palettes.corporate;

  // 2. BACKGROUND & REFINED EDITORIAL BACKDROP
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  // Subtle warm ambient radial wash
  const ambientGrad = ctx.createRadialGradient(
    width * 0.5,
    isPortrait ? height * 0.35 : height * 0.5,
    10,
    width * 0.5,
    isPortrait ? height * 0.35 : height * 0.5,
    Math.max(width, height) * 0.7
  );
  ambientGrad.addColorStop(0, palette.paper);
  ambientGrad.addColorStop(1, palette.background);
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);

  // Delicate Minimalist Outer Border Frame
  const borderPad = Math.max(16, Math.min(width, height) * 0.025);
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(borderPad, borderPad, width - borderPad * 2, height - borderPad * 2);

  // 3. LAYOUT REGIONS
  const outerPad = Math.max(34, Math.min(width, height) * (isPortrait ? 0.06 : 0.055));
  let textRegion: Rect;
  let imageRegion: Rect;

  if (isPortrait) {
    textRegion = {
      x: outerPad,
      y: outerPad + 40,
      w: width - outerPad * 2,
      h: height * 0.44,
    };
    imageRegion = {
      x: outerPad,
      y: height * 0.50,
      w: width - outerPad * 2,
      h: height * 0.43,
    };
  } else {
    textRegion = {
      x: outerPad,
      y: outerPad + 60,
      w: width * 0.52,
      h: height - outerPad * 2 - 60,
    };
    imageRegion = {
      x: width * 0.57,
      y: outerPad,
      w: width * 0.37,
      h: height - outerPad * 2,
    };
  }

  // 4. INDEPENDENT LOGO LAYER
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

  // 5. INDEPENDENT SPEAKER PHOTO LAYER
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = clamp(props.speakerScale || 1, 0.5, 3);
      const sx = props.speakerX || 0;
      const sy = props.speakerY || 0;

      const frameW = imageRegion.w;
      const frameH = imageRegion.h;
      const frameX = imageRegion.x;
      const frameY = imageRegion.y;
      const radius = isPortrait ? 28 : Math.min(frameW / 2, 24);

      // Clean Backdrop Card
      ctx.save();
      roundRectPath(ctx, frameX, frameY, frameW, frameH, radius);
      ctx.fillStyle = palette.paper;
      ctx.fill();
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Speaker Mask Viewport
      ctx.save();
      const photoPad = isPortrait ? 8 : 10;
      roundRectPath(ctx, frameX + photoPad, frameY + photoPad, frameW - photoPad * 2, frameH - photoPad * 2, radius - 4);
      ctx.clip();

      const cx = frameX + frameW / 2;
      const cy = frameY + frameH / 2;
      ctx.translate(cx + sx, cy + sy);
      ctx.scale(sScale, sScale);
      drawCoverImage(ctx, speaker, -frameW / 2, -frameH / 2, frameW, frameH, 'center', 'smart');
      ctx.restore();

      // Delicate Accent Ring
      roundRectPath(ctx, frameX, frameY, frameW, frameH, radius);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Speaker Name Tag if available
      if (props.speakerName) {
        ctx.save();
        ctx.font = `600 ${isPortrait ? 20 : 13}px "Cormorant Garamond", serif`;
        ctx.fillStyle = palette.ink;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(props.speakerName.toUpperCase(), frameX + frameW / 2, frameY + frameH + (isPortrait ? 14 : 10));
        ctx.restore();
      }
    } catch {}
  }

  // 6. INDEPENDENT TEXT BLOCK (Only text shifts when moving textX/Y or textScale)
  const textScale = clamp(props.textScale || 1, 0.6, 2);
  const textOffsetX = props.textX || 0;
  const textOffsetY = props.textY || 0;

  ctx.save();
  const textOriginX = textRegion.x + textOffsetX;
  const textOriginY = textRegion.y + textOffsetY;
  ctx.translate(textOriginX, textOriginY);
  ctx.scale(textScale, textScale);

  let curY = 0;

  // Brand Name (Artisanal Letter-Spaced Eyebrow)
  if (props.brandName) {
    const brandSize = isPortrait ? 22 : Math.max(12, 14 * textScale);
    ctx.font = `600 ${brandSize}px "Cormorant Garamond", serif`;
    ctx.fillStyle = palette.muted;
    ctx.textBaseline = 'top';
    drawLetterSpacedText(ctx, props.brandName.toUpperCase().trim(), 0, curY, (isPortrait ? 5 : 4) * textScale, 'left');
    curY += (isPortrait ? 36 : 24) * textScale;
  }

  // Category Tag (Boho Terracotta Eyebrow)
  if (props.category) {
    const catSize = isPortrait ? 24 : Math.max(13, 16 * textScale);
    ctx.font = `700 ${catSize}px "Cormorant Garamond", serif`;
    ctx.fillStyle = palette.accent;
    ctx.textBaseline = 'top';
    drawLetterSpacedText(ctx, `— ${props.category.toUpperCase().trim()} —`, 0, curY, (isPortrait ? 4 : 3) * textScale, 'left');
    curY += (isPortrait ? 42 : 30) * textScale;
  }

  // Main Title (Cormorant Garamond Luxury Editorial Title)
  const titleLength = props.title?.length || 0;
  let titleSize = isPortrait ? 82 : 62;
  if (titleLength > 30) titleSize *= 0.88;
  if (titleLength > 50) titleSize *= 0.78;
  titleSize = clamp(titleSize, isPortrait ? 48 : 34, isPortrait ? 104 : 76);

  ctx.font = `700 ${titleSize}px "Cormorant Garamond", serif`;
  ctx.fillStyle = palette.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  curY = wrapText(ctx, props.title || '', 0, curY, textRegion.w, titleSize * 1.15, 4) + (isPortrait ? 24 : 16) * textScale;

  // Subtle Organic Divider Line
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = isPortrait ? 2 : 1.2;
  ctx.beginPath();
  ctx.moveTo(0, curY);
  ctx.lineTo(Math.min(isPortrait ? 100 : 70, textRegion.w * 0.22), curY);
  ctx.stroke();
  curY += (isPortrait ? 30 : 22) * textScale;

  // Subtitle
  if (props.subtitle) {
    const subSize = isPortrait ? 30 : Math.max(16, 22 * textScale);
    ctx.font = `italic 400 ${subSize}px "Cormorant Garamond", serif`;
    ctx.fillStyle = palette.muted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    curY = wrapText(ctx, props.subtitle, 0, curY, textRegion.w, (isPortrait ? 42 : 30) * textScale, 3) + (isPortrait ? 32 : 24) * textScale;
  }

  // Keyword Pills (Warm Organic Botanical Badges)
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills
      .split(/[,•]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 5);

    const pillFont = isPortrait ? 20 : Math.max(11, 13 * textScale);
    ctx.font = `600 ${pillFont}px "Cormorant Garamond", serif`;
    const pillH = (isPortrait ? 38 : 26) * textScale;
    const gapX = (isPortrait ? 12 : 8) * textScale;
    const gapY = (isPortrait ? 12 : 8) * textScale;

    let px = 0;
    let py = curY + 6;

    pills.forEach((pill) => {
      const pillText = pill.toUpperCase();
      const metrics = ctx.measureText(pillText);
      const pillW = metrics.width + (isPortrait ? 34 : 24) * textScale;

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
      ctx.fillText(pillText, px + pillW / 2, py + pillH / 2);
      ctx.restore();

      px += pillW + gapX;
    });
  }

  ctx.restore();

  // --- 8. ARTISAN EDITORIAL FOOTER LINKS ---
  if (props.showFooterLinks !== false && props.footerLinks && props.footerLinks.length > 0) {
    const rawLinks = props.footerLinks.slice(0, 4).filter(Boolean);
    if (rawLinks.length > 0) {
      ctx.save();
      const footerY = isPortrait ? height - outerPad - 16 : height - outerPad - 6;
      const fontSz = isPortrait ? 18 : 13;
      ctx.font = `600 ${fontSz}px "Cormorant Garamond", serif`;

      // Delicate bookish hairline divider
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(outerPad, footerY - (isPortrait ? 24 : 18));
      ctx.lineTo(width - outerPad, footerY - (isPortrait ? 24 : 18));
      ctx.stroke();

      let curX = outerPad;
      rawLinks.forEach((link, idx) => {
        const { label } = getLinkIconAndLabel(link);
        const dash = '—';
        const text = `${dash}  ${label.toUpperCase()}`;
        const metrics = ctx.measureText(text);
        const itemW = metrics.width + (isPortrait ? 30 : 22);
        const itemH = isPortrait ? 34 : 24;

        if (curX + itemW > width - outerPad && idx > 0) return;

        // Artisan pill
        roundRectPath(ctx, curX, footerY - itemH / 2, itemW, itemH, itemH / 2);
        ctx.fillStyle = palette.pillBg;
        ctx.fill();
        ctx.strokeStyle = palette.pillBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dash prefix
        ctx.fillStyle = palette.accent;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(dash, curX + (isPortrait ? 12 : 9), footerY);

        // Text
        const dashW = ctx.measureText(dash + '  ').width;
        ctx.fillStyle = palette.ink;
        ctx.fillText(label.toUpperCase(), curX + (isPortrait ? 12 : 9) + dashW, footerY);

        curX += itemW + (isPortrait ? 14 : 10);
      });

      ctx.restore();
    }
  }
};

