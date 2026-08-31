import React, { useEffect, useRef } from 'react';
import { PostData } from '../types';
import { roundRectPath } from '../utils/canvasUtils';

interface ThumbnailCanvasProps extends Omit<PostData, 'id'> {
  id?: number | string;
  onExportReady?: (dataUrl: string, webpUrl?: string, webpSizeKb?: number) => void;
  className?: string;
}

import { renderProfessional } from './canvas/professional';
import { renderEthereal } from './canvas/ethereal';
import { renderBohemian } from './canvas/bohemian';
import { renderMinimalistic } from './canvas/minimalistic';
import { renderYoutubeBold } from './canvas/youtubeBold';
import { renderTechSaaS } from './canvas/techSaas';

const FONT_READY = typeof document !== 'undefined' && document.fonts
  ? document.fonts.ready
  : Promise.resolve();

const renderSpeakerIdentity = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: ThumbnailCanvasProps
) => {
  if (!props.showSpeaker) return;

  // Professional already renders both fields; minimalistic and bohemian
  // already render the name. This layer fills only the missing metadata.
  const needsName = props.template === 'ethereal' || props.template === 'youtube_bold' || props.template === 'tech_saas';
  const needsRole = props.template !== 'professional';
  if ((!needsName || !props.speakerName) && (!needsRole || !props.speakerRole)) return;

  const isPortrait = height > width;
  const cardW = Math.min(isPortrait ? width * 0.82 : 350, width - 48);
  const cardH = isPortrait ? 92 : 76;
  const x = isPortrait ? (width - cardW) / 2 : width * 0.58;
  const y = Math.max(24, height - cardH - (isPortrait ? 88 : 58));
  const dark = props.template === 'ethereal' || props.template === 'youtube_bold' || props.template === 'tech_saas';
  const accent = props.bgStyle === 'crimson' ? '#FB7185'
    : props.bgStyle === 'emerald' ? '#34D399'
    : props.bgStyle === 'digital' ? '#22D3EE'
    : props.bgStyle === 'corporate' ? '#A16207'
    : props.bgStyle === 'obsidian' ? '#FACC15'
    : '#818CF8';

  ctx.save();
  roundRectPath(ctx, x, y, cardW, cardH, 14);
  ctx.fillStyle = dark ? 'rgba(7, 10, 18, 0.84)' : 'rgba(255, 255, 255, 0.94)';
  ctx.fill();
  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 1.25;
  ctx.stroke();
  ctx.fillStyle = accent;
  roundRectPath(ctx, x, y, 4, cardH, 2);
  ctx.fill();

  let cy = y + 17;
  if (needsName && props.speakerName) {
    ctx.font = `700 ${isPortrait ? 22 : 17}px "Plus Jakarta Sans", "Inter", sans-serif`;
    ctx.fillStyle = dark ? '#FFFFFF' : '#111827';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(props.speakerName, x + 18, cy, cardW - 30);
    cy += isPortrait ? 31 : 25;
  }
  if (needsRole && props.speakerRole) {
    ctx.font = `600 ${isPortrait ? 15 : 12}px "Plus Jakarta Sans", "Inter", sans-serif`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(props.speakerRole.toUpperCase(), x + 18, cy, cardW - 30);
  }
  ctx.restore();
};

const applyThemeTone = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgStyle: PostData['bgStyle']
) => {
  if (bgStyle !== 'midnight' && bgStyle !== 'corporate') return;

  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (bgStyle === 'midnight') {
    gradient.addColorStop(0, 'rgba(49, 46, 129, 0.22)');
    gradient.addColorStop(0.55, 'rgba(30, 64, 175, 0.10)');
    gradient.addColorStop(1, 'rgba(14, 116, 144, 0.08)');
  } else {
    // Corporate is deliberately neutral/warm rather than another blue preset.
    gradient.addColorStop(0, 'rgba(180, 140, 82, 0.20)');
    gradient.addColorStop(0.5, 'rgba(120, 113, 108, 0.10)');
    gradient.addColorStop(1, 'rgba(45, 55, 72, 0.14)');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
};

export const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderSeqRef = useRef(0);
  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportCallbackRef = useRef(props.onExportReady);

  useEffect(() => {
    exportCallbackRef.current = props.onExportReady;
  }, [props.onExportReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1200;
    let height = 630;
    if (props.aspectRatio === 'youtube') {
      width = 1280;
      height = 720;
    } else if (props.aspectRatio === 'reels') {
      width = 1080;
      height = 1920;
    }

    const dpr = 2;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    renderSeqRef.current += 1;
    const currentSeq = renderSeqRef.current;

    const executeRender = async () => {
      try {
        await FONT_READY;
        if (renderSeqRef.current !== currentSeq) return;

        switch (props.template) {
          case 'ethereal': await renderEthereal(ctx, width, height, props); break;
          case 'bohemian': await renderBohemian(ctx, width, height, props); break;
          case 'minimalistic': await renderMinimalistic(ctx, width, height, props); break;
          case 'youtube_bold': await renderYoutubeBold(ctx, width, height, props); break;
          case 'tech_saas': await renderTechSaaS(ctx, width, height, props); break;
          case 'professional':
          default: await renderProfessional(ctx, width, height, props); break;
        }

        if (renderSeqRef.current !== currentSeq) return;

        renderSpeakerIdentity(ctx, width, height, props);
        applyThemeTone(ctx, width, height, props.bgStyle);

        if (exportCallbackRef.current) {
          if (exportTimerRef.current) clearTimeout(exportTimerRef.current);
          exportTimerRef.current = setTimeout(() => {
            if (renderSeqRef.current !== currentSeq) return;
            canvas.toBlob((pngBlob) => {
              if (!pngBlob || renderSeqRef.current !== currentSeq) return;
              const pngReader = new FileReader();
              pngReader.onloadend = () => {
                const pngUrl = String(pngReader.result || '');
                canvas.toBlob((webpBlob) => {
                  if (!webpBlob || renderSeqRef.current !== currentSeq) {
                    exportCallbackRef.current?.(pngUrl);
                    return;
                  }
                  const webpReader = new FileReader();
                  webpReader.onloadend = () => {
                    exportCallbackRef.current?.(pngUrl, String(webpReader.result || ''), Math.round(webpBlob.size / 1024));
                  };
                  webpReader.readAsDataURL(webpBlob);
                }, 'image/webp', 0.9);
              };
              pngReader.readAsDataURL(pngBlob);
            }, 'image/png');
          }, 450);
        }
      } catch (err) {
        console.error('Template rendering error:', err);
      }
    };

    const frameId = requestAnimationFrame(executeRender);
    return () => {
      cancelAnimationFrame(frameId);
      if (exportTimerRef.current) clearTimeout(exportTimerRef.current);
    };
  }, [
    props.template,
    props.aspectRatio,
    props.title,
    props.subtitle,
    props.category,
    props.brandName,
    props.bgStyle,
    props.speakerName,
    props.speakerRole,
    props.speakerImageUrl,
    props.showSpeaker,
    props.keyPills,
    props.showKeyPills,
    props.logoImageUrl,
    props.footerLinks,
    props.showFooterLinks,
    props.logoScale,
    props.logoX,
    props.logoY,
    props.speakerScale,
    props.speakerX,
    props.speakerY,
    props.textScale,
    props.textX,
    props.textY,
  ]);

  return (
    <canvas
      id={props.id}
      ref={canvasRef}
      className={`rounded-lg shadow-2xl ring-1 ring-white/10 object-contain transition-all duration-150 ${props.className || ''}`}
      style={{
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        aspectRatio: props.aspectRatio === 'youtube' ? '1280 / 720' : props.aspectRatio === 'reels' ? '1080 / 1920' : '1200 / 630'
      }}
    />
  );
};
