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

const FONT_READY = typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();

const renderSpeakerIdentity = (ctx: CanvasRenderingContext2D, width: number, height: number, props: ThumbnailCanvasProps) => {
  if (!props.showSpeaker) return;
  const needsName = props.template === 'youtube_bold' || props.template === 'tech_saas';
  const needsRole = props.template === 'minimalistic' || props.template === 'bohemian' || props.template === 'youtube_bold' || props.template === 'tech_saas';
  if ((!needsName || !props.speakerName) && (!needsRole || !props.speakerRole)) return;

  const portrait = height > width;
  const cardW = Math.min(portrait ? width * .82 : 350, width - 48);
  const cardH = portrait ? 88 : 68;
  const x = portrait ? (width - cardW) / 2 : width * .58;
  const y = Math.max(24, height - cardH - (portrait ? 88 : 58));
  const accent = props.bgStyle === 'crimson' ? '#FB7185' : props.bgStyle === 'emerald' ? '#34D399' : props.bgStyle === 'digital' ? '#22D3EE' : props.bgStyle === 'corporate' ? '#5B9CFF' : props.bgStyle === 'obsidian' ? '#FACC15' : '#818CF8';

  ctx.save();
  roundRectPath(ctx, x, y, cardW, cardH, 12);
  ctx.fillStyle = 'rgba(8, 18, 36, 0.92)';
  ctx.fill();
  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = accent;
  roundRectPath(ctx, x, y, 3, cardH, 2);
  ctx.fill();

  let cy = y + 15;
  if (needsName && props.speakerName) {
    ctx.font = `700 ${portrait ? 21 : 16}px "Plus Jakarta Sans", "Inter", sans-serif`;
    ctx.fillStyle = '#F8FAFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(props.speakerName, x + 17, cy, cardW - 28);
    cy += portrait ? 29 : 23;
  }
  if (needsRole && props.speakerRole) {
    ctx.font = `600 ${portrait ? 13 : 11}px "Plus Jakarta Sans", "Inter", sans-serif`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(props.speakerRole.toUpperCase(), x + 17, cy, cardW - 28);
  }
  ctx.restore();
};

const applyThemeTone = (ctx: CanvasRenderingContext2D, width: number, height: number, bgStyle: PostData['bgStyle']) => {
  if (bgStyle !== 'midnight' && bgStyle !== 'corporate') return;
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (bgStyle === 'midnight') {
    gradient.addColorStop(0, 'rgba(49,46,129,.22)');
    gradient.addColorStop(.55, 'rgba(30,64,175,.10)');
    gradient.addColorStop(1, 'rgba(14,116,144,.08)');
  } else {
    gradient.addColorStop(0, 'rgba(30,64,175,.16)');
    gradient.addColorStop(.5, 'rgba(37,99,235,.08)');
    gradient.addColorStop(1, 'rgba(14,30,55,.12)');
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

  useEffect(() => { exportCallbackRef.current = props.onExportReady; }, [props.onExportReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1200, height = 630;
    if (props.aspectRatio === 'youtube') { width = 1280; height = 720; }
    else if (props.aspectRatio === 'reels') { width = 1080; height = 1920; }

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
                  if (!webpBlob || renderSeqRef.current !== currentSeq) { exportCallbackRef.current?.(pngUrl); return; }
                  const webpReader = new FileReader();
                  webpReader.onloadend = () => exportCallbackRef.current?.(pngUrl, String(webpReader.result || ''), Math.round(webpBlob.size / 1024));
                  webpReader.readAsDataURL(webpBlob);
                }, 'image/webp', .9);
              };
              pngReader.readAsDataURL(pngBlob);
            }, 'image/png');
          }, 450);
        }
      } catch (err) { console.error('Template rendering error:', err); }
    };

    const frameId = requestAnimationFrame(executeRender);
    return () => { cancelAnimationFrame(frameId); if (exportTimerRef.current) clearTimeout(exportTimerRef.current); };
  }, [props.template, props.aspectRatio, props.title, props.subtitle, props.category, props.brandName, props.bgStyle, props.speakerName, props.speakerRole, props.speakerImageUrl, props.showSpeaker, props.keyPills, props.showKeyPills, props.logoImageUrl, props.footerLinks, props.showFooterLinks, props.logoScale, props.logoX, props.logoY, props.speakerScale, props.speakerX, props.speakerY, props.textScale, props.textX, props.textY]);

  return <canvas id={props.id} ref={canvasRef} className={`rounded-lg shadow-2xl ring-1 ring-white/10 object-contain transition-all duration-150 ${props.className || ''}`} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', aspectRatio: props.aspectRatio === 'youtube' ? '1280 / 720' : props.aspectRatio === 'reels' ? '1080 / 1920' : '1200 / 630' }} />;
};
