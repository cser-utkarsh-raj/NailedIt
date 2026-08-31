import React, { useEffect, useRef } from 'react';
import { AspectRatio, BgStyle, ExportFormat, IconMotif, VisualBrandingMode } from '../types';

interface ThumbnailCanvasProps {
  template?: string;
  title: string;
  subtitle?: string;
  category: string;
  bgStyle: BgStyle;
  iconMotif?: IconMotif;
  aspectRatio?: AspectRatio;
  visualMode?: VisualBrandingMode;
  thematicArt?: string;
  brandName?: string;
  siteUrl?: string;
  customOverlayImage?: string | null;
  speakerName?: string;
  speakerRole?: string;
  speakerImageUrl?: string | null;
  logoImageUrl?: string | null;
  showSpeaker?: boolean;
  keyPills?: string;
  showKeyPills?: boolean;
  onExportReady?: (dataUrl: string, webpUrl?: string, webpSizeKb?: number) => void;
  className?: string;
  id?: string;
}

export const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = ({
  template = "professional",
  title,
  subtitle = '',
  category,
  bgStyle,
  iconMotif = 'bank',
  aspectRatio = 'og',
  visualMode = 'speaker_portrait',
  thematicArt = 'banking_pillars',
  brandName = 'BANKING DIGESTS',
  siteUrl = 'www.bankingdigests.com',
  customOverlayImage,
  speakerName = 'Faculty & Banking Expert',
  speakerRole = 'Credit & Legal Digest',
  speakerImageUrl = null,
  logoImageUrl = '/logo.png',
  showSpeaker = true,
  keyPills = 'HYPOTHECATION • PLEDGE • MORTGAGE • LIEN • ASSIGNMENT',
  showKeyPills = true,
  onExportReady,
  className = '',
  id = 'bdtg-canvas'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    let width = 1200;
    let height = 630;
    if (aspectRatio === 'youtube') {
      width = 1280;
      height = 720;
    } else if (aspectRatio === 'square') {
      width = 1080;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    // Themes
    let primaryColor = '#0b1528';
    let secondaryColor = '#162238';
    let tertiaryColor = '#050b14';
    let accentColor = '#f59e0b';
    let badgeBg = '#d97706';
    let badgeText = '#ffffff';

    if (bgStyle === 'rbi') {
      primaryColor = '#4c0519';
      secondaryColor = '#1c030a';
      tertiaryColor = '#080104';
      accentColor = '#f59e0b';
      badgeBg = '#d97706';
      badgeText = '#ffffff';
    } else if (bgStyle === 'emerald') {
      primaryColor = '#064e3b';
      secondaryColor = '#022c22';
      tertiaryColor = '#011710';
      accentColor = '#10b981';
      badgeBg = '#10b981';
      badgeText = '#ffffff';
    } else if (bgStyle === 'digital') {
      primaryColor = '#0f172a';
      secondaryColor = '#020617';
      tertiaryColor = '#000000';
      accentColor = '#06b6d4';
      badgeBg = '#0284c7';
      badgeText = '#ffffff';
    } else if (bgStyle === 'dark') {
      primaryColor = '#18181b';
      secondaryColor = '#09090b';
      tertiaryColor = '#000000';
      accentColor = '#e2e8f0';
      badgeBg = '#334155';
      badgeText = '#ffffff';
    } else if (bgStyle === 'corporate') {
      primaryColor = '#1e3a8a';
      secondaryColor = '#0f172a';
      tertiaryColor = '#020617';
      accentColor = '#38bdf8';
      badgeBg = '#2563eb';
      badgeText = '#ffffff';
    }

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(0.55, secondaryColor);
    gradient.addColorStop(1, tertiaryColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Geometric Grid Lines & Thematic Watermark
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Thematic Background Elements & Watermark
    ctx.save();
    ctx.fillStyle = `${accentColor}0a`;
    ctx.strokeStyle = `${accentColor}14`;
    ctx.lineWidth = 2;
    // Central radial background glow
    const radial = ctx.createRadialGradient(width * 0.82, height * 0.35, 10, width * 0.82, height * 0.35, 420);
    radial.addColorStop(0, `${accentColor}25`);
    radial.addColorStop(0.6, `${accentColor}08`);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    const drawVisuals = (
      loadedSpeakerImg: HTMLImageElement | null = null,
      loadedLogoImg: HTMLImageElement | null = null
    ) => {
      // 3b. Draw Subtle Background Official Watermark Logo
      if (loadedLogoImg) {
        ctx.save();
        ctx.globalAlpha = 0.07;
        const bgLogoSize = Math.min(width, height) * 0.65;
        const bgLogoX = width * 0.68 - bgLogoSize / 2;
        const bgLogoY = height * 0.48 - bgLogoSize / 2;
        ctx.drawImage(loadedLogoImg, bgLogoX, bgLogoY, bgLogoSize, bgLogoSize);
        ctx.restore();
      }

      // Left Accent Pillar Bar
      ctx.save();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      const barX = 70;
      const barY = 70;
      const barW = 8;
      const barH = height - 145;
      const barR = 4;
      if (ctx.roundRect) {
        ctx.roundRect(barX, barY, barW, barH, barR);
      } else {
        ctx.rect(barX, barY, barW, barH);
      }
      ctx.fill();
      ctx.restore();

      // Top Left Header: Official Banking Digests Logo Watermark
      ctx.save();
      const logoBoxX = 98;
      const logoBoxY = 65;
      const logoBoxW = 44;
      const logoBoxH = 44;

      if (loadedLogoImg) {
        // Logo Container with Gold Accent Border
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = `${accentColor}88`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(logoBoxX, logoBoxY, logoBoxW, logoBoxH, 10);
        } else {
          ctx.rect(logoBoxX, logoBoxY, logoBoxW, logoBoxH);
        }
        ctx.fill();
        ctx.stroke();

        // Draw Official Banking Digests Logo Emblem
        ctx.drawImage(loadedLogoImg, logoBoxX + 3, logoBoxY + 3, logoBoxW - 6, logoBoxH - 6);
      } else {
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(logoBoxX + 22, logoBoxY + 22, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BD', logoBoxX + 22, logoBoxY + 23);
      }
      ctx.restore();

      // Brand Title & Tagline
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(brandName.toUpperCase(), 154, 78);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('KNOWLEDGE & INSIGHTS FOR BANKERS', 155, 100);
      ctx.restore();

      // Category Pill Badge
      const catUpper = (category || 'BANKING & FINANCE').toUpperCase();
      ctx.save();
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const catMetrics = ctx.measureText(catUpper);
      const pillWidth = Math.max(catMetrics.width + 28, 120);
      const pillHeight = 30;
      const pillX = 100;
      const pillY = 130;

      ctx.fillStyle = badgeBg;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 6);
      } else {
        ctx.rect(pillX, pillY, pillWidth, pillHeight);
      }
      ctx.fill();

      ctx.fillStyle = badgeText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(catUpper, pillX + pillWidth / 2, pillY + pillHeight / 2 + 1);
      ctx.restore();

      // Topic Motif / Emblem Icon (Top Right)
      const motifSymbols: Record<IconMotif, string> = {
        bank: '🏛️',
        rupee: '₹',
        shield: '🛡️',
        chart: '📈',
        chip: '⚡',
        doc: '📋',
        lock: '🔒',
        scales: '⚖️'
      };
      const motifChar = motifSymbols[iconMotif] || '🏛️';

      ctx.save();
      const motifX = width - 110;
      const motifY = 85;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.arc(motifX, motifY, 34, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(motifChar, motifX, motifY + 1);
      ctx.restore();

      // Effective right reserved width based on visual mode
      const isRightPanelActive = visualMode === 'speaker_portrait' || visualMode === 'official_logo';
      const rightReservedWidth = isRightPanelActive ? 300 : 130;

      // Post Title Typography with Auto-Wrapping
      ctx.save();
      ctx.fillStyle = '#ffffff';
      const titleFontSize = aspectRatio === 'youtube' ? 46 : (aspectRatio === 'square' ? 52 : (isRightPanelActive ? 42 : 48));
      ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      const currentTitle = title && title.trim() !== '' ? title : 'Banking Digests Post Headline';
      const titleX = 100;
      const titleY = 180;
      const maxLineWidth = width - titleX - rightReservedWidth;
      const lineHeight = titleFontSize * 1.25;

      const words = currentTitle.split(' ');
      let line = '';
      let currentY = titleY;
      const lines: string[] = [];

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxLineWidth && i > 0) {
          lines.push(line.trim());
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      const maxDisplayLines = aspectRatio === 'square' ? 5 : (isRightPanelActive ? 3 : 4);
      for (let i = 0; i < Math.min(lines.length, maxDisplayLines); i++) {
        let displayLine = lines[i];
        if (i === maxDisplayLines - 1 && lines.length > maxDisplayLines) {
          displayLine += '...';
        }
        ctx.fillText(displayLine, titleX, currentY);
        currentY += lineHeight;
      }
      ctx.restore();

      // Optional Subtitle
      if (subtitle && subtitle.trim() !== '') {
        ctx.save();
        ctx.fillStyle = accentColor;
        ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(subtitle, titleX, currentY + 12);
        currentY += 38;
        ctx.restore();
      }

      // Key Charge / Topic Micro-Pills (e.g., Hypothecation, Pledge, Mortgage...)
      if (showKeyPills && keyPills && keyPills.trim() !== '') {
        ctx.save();
        const pills = keyPills.split(/[•|,]/).map((p) => p.trim()).filter(Boolean);
        let pillStartX = titleX;
        const pillPosY = currentY + 16;

        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        for (const pill of pills) {
          const m = ctx.measureText(pill);
          const pW = m.width + 20;
          const pH = 24;

          if (pillStartX + pW > width - rightReservedWidth) break;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(pillStartX, pillPosY, pW, pH, 12);
          } else {
            ctx.rect(pillStartX, pillPosY, pW, pH);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#e2e8f0';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pill, pillStartX + pW / 2, pillPosY + pH / 2);

          pillStartX += pW + 8;
        }
        ctx.restore();
      }

      // Visual Branding Right Panel (Faculty / Logo Crest / Minimal)
      if (visualMode === 'speaker_portrait') {
        ctx.save();
        const cardW = 220;
        const cardH = 265;
        const cardX = width - cardW - 70;
        const cardY = 168;

        // Card Container
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = `${accentColor}66`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(cardX, cardY, cardW, cardH, 16);
        } else {
          ctx.rect(cardX, cardY, cardW, cardH);
        }
        ctx.fill();
        ctx.stroke();

        // Speaker Avatar Circle
        const avatarCenterX = cardX + cardW / 2;
        const avatarCenterY = cardY + 75;
        const avatarRadius = 52;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.clip();

        if (loadedSpeakerImg) {
          ctx.drawImage(
            loadedSpeakerImg,
            avatarCenterX - avatarRadius,
            avatarCenterY - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
          );
        } else {
          // Placeholder executive faculty avatar
          const avGrad = ctx.createLinearGradient(
            avatarCenterX - avatarRadius,
            avatarCenterY - avatarRadius,
            avatarCenterX + avatarRadius,
            avatarCenterY + avatarRadius
          );
          avGrad.addColorStop(0, '#1e293b');
          avGrad.addColorStop(1, '#0f172a');
          ctx.fillStyle = avGrad;
          ctx.fillRect(
            avatarCenterX - avatarRadius,
            avatarCenterY - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
          );

          ctx.fillStyle = accentColor;
          ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('👨‍💼', avatarCenterX, avatarCenterY);
        }
        ctx.restore();

        // Avatar Rim
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Speaker Name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(speakerName || 'Faculty / Expert', avatarCenterX, cardY + 145);

        // Speaker Role
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(speakerRole || 'Credit & Legal Digest', avatarCenterX, cardY + 168);

        // Verification Pill
        ctx.fillStyle = `${accentColor}22`;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        const vPillW = 150;
        const vPillH = 22;
        const vPillX = avatarCenterX - vPillW / 2;
        const vPillY = cardY + 202;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(vPillX, vPillY, vPillW, vPillH, 11);
        } else {
          ctx.rect(vPillX, vPillY, vPillW, vPillH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = accentColor;
        ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('★ EXPERT MASTERCLASS', avatarCenterX, vPillY + vPillH / 2);

        ctx.restore();
      } else if (visualMode === 'official_logo') {
        // Official Banking Digests Logo Crest Panel
        ctx.save();
        const cardW = 220;
        const cardH = 265;
        const cardX = width - cardW - 70;
        const cardY = 168;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = `${accentColor}88`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(cardX, cardY, cardW, cardH, 16);
        } else {
          ctx.rect(cardX, cardY, cardW, cardH);
        }
        ctx.fill();
        ctx.stroke();

        const crestCenterX = cardX + cardW / 2;
        const crestCenterY = cardY + 75;

        // Crest Outer Rim Glow
        ctx.fillStyle = `${accentColor}15`;
        ctx.beginPath();
        ctx.arc(crestCenterX, crestCenterY, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (loadedLogoImg) {
          // Draw Official Logo inside Crest
          const crestLogoSize = 80;
          ctx.drawImage(
            loadedLogoImg,
            crestCenterX - crestLogoSize / 2,
            crestCenterY - crestLogoSize / 2,
            crestLogoSize,
            crestLogoSize
          );
        } else {
          ctx.fillStyle = accentColor;
          ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('BD', crestCenterX, crestCenterY);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('BANKING DIGESTS', crestCenterX, cardY + 145);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('Official Editorial Seal', crestCenterX, cardY + 168);

        ctx.fillStyle = `${accentColor}25`;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        const pillW = 160;
        const pillH = 22;
        const pillX = crestCenterX - pillW / 2;
        const pillY = cardY + 202;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(pillX, pillY, pillW, pillH, 11);
        } else {
          ctx.rect(pillX, pillY, pillW, pillH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = accentColor;
        ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓ VERIFIED COMPENDIUM', crestCenterX, pillY + pillH / 2);

        ctx.restore();
      }

      // Bottom Footer Bar with Divider & Verified Site URL Stamp
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, height - 65);
      ctx.lineTo(width - 100, height - 65);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('OFFICIAL BANKING STUDY & DIGEST COMPENDIUM', 100, height - 40);

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(siteUrl.toLowerCase(), width - 100, height - 40);
      ctx.restore();

      // Export handler (PNG and WebP)
      if (onExportReady) {
        const pngUrl = canvas.toDataURL('image/png');
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const webpUrl = reader.result as string;
                const sizeKb = Math.round(blob.size / 1024);
                onExportReady(pngUrl, webpUrl, sizeKb);
              };
              reader.readAsDataURL(blob);
            } else {
              onExportReady(pngUrl, pngUrl, Math.round((pngUrl.length * 3) / 4 / 1024));
            }
          }, 'image/webp', 0.90);
        } catch {
          onExportReady(pngUrl, pngUrl, Math.round((pngUrl.length * 3) / 4 / 1024));
        }
      }
    };

    // Preload Logo Image and Speaker Image
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';

    const renderChainWithLogo = (loadedLogo: HTMLImageElement | null) => {
      if (speakerImageUrl && visualMode === 'speaker_portrait') {
        const sImg = new Image();
        sImg.crossOrigin = 'anonymous';
        sImg.onload = () => drawVisuals(sImg, loadedLogo);
        sImg.onerror = () => drawVisuals(null, loadedLogo);
        sImg.src = speakerImageUrl;
      } else {
        drawVisuals(null, loadedLogo);
      }
    };

    const startRendering = () => {
      logoImg.onload = () => {
        if (customOverlayImage) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            ctx.globalAlpha = 0.35;
            ctx.drawImage(img, 0, 0, width, height);
            ctx.restore();
            renderChainWithLogo(logoImg);
          };
          img.onerror = () => {
            renderChainWithLogo(logoImg);
          };
          img.src = customOverlayImage;
        } else {
          renderChainWithLogo(logoImg);
        }
      };
      logoImg.onerror = () => {
        renderChainWithLogo(null);
      };
      logoImg.src = logoImageUrl || '';
    };

    startRendering();
  }, [
    title,
    subtitle,
    category,
    bgStyle,
    iconMotif,
    aspectRatio,
    visualMode,
    thematicArt,
    brandName,
    siteUrl,
    customOverlayImage,
    speakerName,
    speakerRole,
    speakerImageUrl,
    keyPills,
    showKeyPills,
    onExportReady
  ]);

  return (
    <div className={`relative w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-700 shadow-2xl ${className}`}>
      <canvas
        id={id}
        ref={canvasRef}
        className="w-full h-auto block"
      />
    </div>
  );
};
