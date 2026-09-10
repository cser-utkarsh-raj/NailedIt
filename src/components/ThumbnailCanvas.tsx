import React, { useEffect, useRef } from 'react';
import { PostData } from '../types';
import { renderPremium } from './canvas/premium';

interface ThumbnailCanvasProps extends Omit<PostData, 'id'> {
  id?: number | string;
  onExportReady?: (dataUrl: string, webpUrl?: string, webpSizeKb?: number) => void;
  className?: string;
}

const FONT_READY = typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();

export const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderSeqRef = useRef(0);
  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportCallbackRef = useRef(props.onExportReady);

  useEffect(() => { exportCallbackRef.current = props.onExportReady; }, [props.onExportReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
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
        await renderPremium(ctx, width, height, props);
        if (renderSeqRef.current !== currentSeq) return;

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
                }, 'image/webp', .92);
              };
              pngReader.readAsDataURL(pngBlob);
            }, 'image/png');
          }, 300);
        }
      } catch (err) { console.error('Premium renderer error:', err); }
    };

    const frameId = requestAnimationFrame(executeRender);
    return () => { cancelAnimationFrame(frameId); if (exportTimerRef.current) clearTimeout(exportTimerRef.current); };
  }, [props.template, props.aspectRatio, props.title, props.subtitle, props.category, props.brandName, props.bgStyle, props.speakerName, props.speakerRole, props.speakerImageUrl, props.showSpeaker, props.keyPills, props.showKeyPills, props.logoImageUrl, props.footerLinks, props.showFooterLinks, props.logoScale, props.logoX, props.logoY, props.speakerScale, props.speakerX, props.speakerY, props.textScale, props.textX, props.textY]);

  return <canvas id={props.id} ref={canvasRef} className={`rounded-lg shadow-2xl ring-1 ring-white/10 object-contain transition-all duration-150 ${props.className || ''}`} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', aspectRatio: props.aspectRatio === 'youtube' ? '1280 / 720' : props.aspectRatio === 'reels' ? '1080 / 1920' : '1200 / 630' }} />;
};
