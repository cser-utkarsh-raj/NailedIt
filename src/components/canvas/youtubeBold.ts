import { CanvasTemplateProps } from '../../types';
import {
  loadImage,
  wrapText,
  drawContainImage,
  drawCoverImage,
  roundRectPath,
  clamp,
  Rect,
  getLinkIconAndLabel,
} from '../../utils/canvasUtils';

export const renderYoutubeBold = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {
  const isPortrait = height > width;

  // 1. PALETTE SYSTEM (High Voltage Contrast)
  const accents = {
    midnight: { bg: '#08080C', text: '#FFFFFF', accent: '#FFE600', blockText: '#000000', glow: '#6366F1' },
    crimson: { bg: '#0D0507', text: '#FFFFFF', accent: '#FF2A55', blockText: '#FFFFFF', glow: '#FF0055' },
    emerald: { bg: '#050D0A', text: '#FFFFFF', accent: '#00FF66', blockText: '#000000', glow: '#10B981' },
    digital: { bg: '#050D14', text: '#FFFFFF', accent: '#00F0FF', blockText: '#000000', glow: '#06B6D4' },
    obsidian: { bg: '#0A0A0A', text: '#FFFFFF', accent: '#FFCC00', blockText: '#000000', glow: '#FFFFFF' },
    corporate: { bg: '#0B1120', text: '#FFFFFF', accent: '#38BDF8', blockText: '#000000', glow: '#2563EB' },
  };

  const scheme = accents[props.bgStyle as keyof typeof accents] || accents.midnight;

  // 2. BACKGROUND RENDERING (Energetic Depth & Radial Burst)
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = scheme.bg;
  ctx.fillRect(0, 0, width, height);

  // High-Energy Radial Glow behind Speaker
  const glowX = isPortrait ? width * 0.5 : width * 0.75;
  const glowY = isPortrait ? height * 0.7 : height * 0.5;
  const glowR = Math.max(width, height) * 0.7;
  const bgGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
  bgGlow.addColorStop(0, scheme.glow + '35');
  bgGlow.addColorStop(0.6, scheme.glow + '08');
  bgGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = bgGlow;
  ctx.fillRect(0, 0, width, height);

  // Dynamic Angular Speed Accents
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 2;
  const lineSpacing = Math.min(width, height) * 0.15;
  for (let x = -width; x < width * 2; x += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height * 0.5, height);
    ctx.stroke();
  }
  ctx.restore();

  // 3. LAYOUT REGIONS
  const pad = Math.max(28, Math.min(width, height) * (isPortrait ? 0.05 : 0.055));
  let textRegion: Rect;
  let imageRegion: Rect;

  if (isPortrait) {
    textRegion = {
      x: pad,
      y: pad + 20,
      w: width - pad * 2,
      h: height * 0.44,
    };
    imageRegion = {
      x: 0,
      y: height * 0.46,
      w: width,
      h: height * 0.54,
    };
  } else {
    textRegion = {
      x: pad,
      y: pad,
      w: width * 0.56,
      h: height - pad * 2,
    };
    imageRegion = {
      x: width * 0.42,
      y: 0,
      w: width * 0.58,
      h: height,
    };
  }

  // 4. SPEAKER IMAGE (Creator Focus with Edge Fade)
  if (props.showSpeaker && props.speakerImageUrl) {
    try {
      const speaker = await loadImage(props.speakerImageUrl);
      const sScale = clamp(props.speakerScale || 1, 0.5, 3);
      const sx = props.speakerX || 0;
      const sy = props.speakerY || 0;

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

      // Smooth Bottom-to-Top & Left-to-Right Edge Shadow
      const shadowGrad = ctx.createLinearGradient(
        isPortrait ? 0 : imageRegion.x,
        isPortrait ? imageRegion.y : 0,
        isPortrait ? 0 : imageRegion.x + imageRegion.w * 0.45,
        isPortrait ? imageRegion.y + imageRegion.h * 0.45 : 0
      );
      shadowGrad.addColorStop(0, scheme.bg);
      shadowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(imageRegion.x, imageRegion.y, isPortrait ? imageRegion.w : imageRegion.w * 0.45, isPortrait ? imageRegion.h * 0.45 : imageRegion.h);
    } catch {}
  }

  // 5. INDEPENDENT LOGO LAYER
  if (props.logoImageUrl) {
    try {
      const logo = await loadImage(props.logoImageUrl);
      const logoScale = clamp(props.logoScale || 1, 0.5, 3);
      const logoSize = Math.min(85, width * 0.16);
      const lx = props.logoX || 0;
      const ly = props.logoY || 0;

      const baseLogoX = pad;
      const baseLogoY = pad;

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

  // 6. INDEPENDENT TEXT CONTENT (High-Impact Heavy Blocks)
  const textScale = clamp(props.textScale || 1, 0.6, 2);
  const textOffsetX = props.textX || 0;
  const textOffsetY = props.textY || 0;

  ctx.save();
  const textOriginX = textRegion.x + textOffsetX;
  const textOriginY = textRegion.y + textOffsetY;
  ctx.translate(textOriginX, textOriginY);
  ctx.scale(textScale, textScale);

  let curY = 0;

  // Category Badge (Bold Angled Eyebrow)
  if (props.category) {
    const catText = props.category.toUpperCase().trim();
    const catFont = isPortrait ? 22 : Math.max(14, 18 * textScale);
    ctx.font = `900 ${catFont}px "Montserrat", sans-serif`;
    const catWidth = ctx.measureText(catText).width + (isPortrait ? 40 : 30) * textScale;
    const catHeight = (isPortrait ? 46 : 36) * textScale;

    ctx.save();
    ctx.fillStyle = scheme.accent;
    roundRectPath(ctx, 0, curY, catWidth, catHeight, isPortrait ? 6 : 4);
    ctx.fill();

    ctx.fillStyle = scheme.blockText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(catText, catWidth / 2, curY + catHeight / 2);
    ctx.restore();

    curY += catHeight + (isPortrait ? 26 : 22) * textScale;
  }

  // Giant Main Title (High Impact Montserrat 900 with Solid Readability)
  const titleLength = props.title?.length || 0;
  let titleSize = isPortrait ? 84 : 72;
  if (titleLength > 24) titleSize *= 0.88;
  if (titleLength > 45) titleSize *= 0.78;
  titleSize = clamp(titleSize, isPortrait ? 48 : 38, isPortrait ? 104 : 88);

  ctx.font = `900 ${titleSize}px "Montserrat", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Draw title with bold contrast stroke and clean fill
  const words = (props.title || '').split(' ');
  let line = '';
  const lines: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > textRegion.w && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = test;
    }
  }
  if (line) lines.push(line.trim());

  lines.forEach((l) => {
    ctx.save();
    ctx.lineWidth = Math.max(6, titleSize * 0.12);
    ctx.strokeStyle = '#000000';
    ctx.strokeText(l, 0, curY);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(l, 0, curY);
    ctx.restore();
    curY += titleSize * 1.08;
  });

  curY += (isPortrait ? 20 : 14) * textScale;

  // Subtitle (Highlighter Accent Box)
  if (props.subtitle) {
    const subText = props.subtitle.toUpperCase().trim();
    const subFont = isPortrait ? 30 : Math.max(16, 24 * textScale);
    ctx.font = `900 ${subFont}px "Montserrat", sans-serif`;
    const subWidth = Math.min(ctx.measureText(subText).width + (isPortrait ? 36 : 24) * textScale, textRegion.w);
    const subHeight = (isPortrait ? 52 : 42) * textScale;

    ctx.save();
    ctx.fillStyle = scheme.accent;
    roundRectPath(ctx, 0, curY, subWidth, subHeight, isPortrait ? 6 : 4);
    ctx.fill();

    ctx.fillStyle = scheme.blockText;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(subText, (isPortrait ? 18 : 12) * textScale, curY + subHeight / 2, subWidth - (isPortrait ? 36 : 24) * textScale);
    ctx.restore();

    curY += subHeight + (isPortrait ? 26 : 20) * textScale;
  }

  // Keyword Pills (High-Contrast Creator Tags)
  if (props.showKeyPills && props.keyPills) {
    const pills = props.keyPills
      .split(/[,•]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 5);

    const pillFont = isPortrait ? 20 : Math.max(12, 14 * textScale);
    ctx.font = `800 ${pillFont}px "Montserrat", sans-serif`;
    const pillH = (isPortrait ? 40 : 30) * textScale;
    const gapX = (isPortrait ? 12 : 10) * textScale;
    const gapY = (isPortrait ? 12 : 10) * textScale;

    let px = 0;
    let py = curY + 6;

    pills.forEach((pill) => {
      const metrics = ctx.measureText(pill.toUpperCase());
      const pillW = metrics.width + (isPortrait ? 34 : 24) * textScale;

      if (px + pillW > textRegion.w && px > 0) {
        px = 0;
        py += pillH + gapY;
      }

      ctx.save();
      roundRectPath(ctx, px, py, pillW, pillH, isPortrait ? 6 : 4);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pill.toUpperCase(), px + pillW / 2, py + pillH / 2);
      ctx.restore();

      px += pillW + gapX;
    });
  }

  ctx.restore();

  // --- 8. CREATOR HIGH-IMPACT FOOTER BADGES ---
  if (props.showFooterLinks !== false && props.footerLinks && props.footerLinks.length > 0) {
    const rawLinks = props.footerLinks.slice(0, 4).filter(Boolean);
    if (rawLinks.length > 0) {
      ctx.save();
      const footerY = isPortrait ? height - pad - 16 : height - pad - 6;
      const fontSz = isPortrait ? 18 : 13;
      ctx.font = `900 ${fontSz}px "Montserrat", sans-serif`;

      let curX = pad;
      rawLinks.forEach((link, idx) => {
        const { icon, label } = getLinkIconAndLabel(link);
        const upperLabel = label.toUpperCase();
        const displayText = icon === '•' || upperLabel.startsWith('@') ? upperLabel : `${icon}  ${upperLabel}`;
        const metrics = ctx.measureText(displayText);
        const itemW = metrics.width + (isPortrait ? 28 : 20);
        const itemH = isPortrait ? 36 : 26;

        if (curX + itemW > width - pad && idx > 0) return;

        // Punchy capsule
        roundRectPath(ctx, curX, footerY - itemH / 2, itemW, itemH, isPortrait ? 6 : 4);
        if (idx === 0) {
          ctx.fillStyle = scheme.accent;
          ctx.fill();
          ctx.fillStyle = scheme.blockText;
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.fillStyle = '#000000';
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayText, curX + itemW / 2, footerY);

        curX += itemW + (isPortrait ? 14 : 10);
      });

      ctx.restore();
    }
  }
};
