import React, { useEffect, useRef } from 'react';
import { PostData } from '../types';

interface ThumbnailCanvasProps extends Omit<PostData, 'id'> {
  id?: number | string;
  onExportReady?: (dataUrl: string, webpUrl?: string, webpSizeKb?: number) => void;
  className?: string;
}

// --- IMPORT TEMPLATES ---
import { renderProfessional } from './canvas/professional';
import { renderEthereal } from './canvas/ethereal';
import { renderBohemian } from './canvas/bohemian';
import { renderMinimalistic } from './canvas/minimalistic';
import { renderYoutubeBold } from './canvas/youtubeBold';
import { renderTechSaaS } from './canvas/techSaas';

export const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderSeqRef = useRef<number>(0);
  const exportTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // High DPI crisp rendering
    const dpr = 2;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    
    // Reset transform & scale to DPR
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    
    // Track sequence to discard stale async renders
    renderSeqRef.current += 1;
    const currentSeq = renderSeqRef.current;

    const executeRender = async () => {
      try {
        if (document.fonts) {
          await document.fonts.ready;
        }
        
        // If another render was queued in the meantime, abort this one
        if (renderSeqRef.current !== currentSeq) return;

        switch (props.template) {
          case 'ethereal':
            await renderEthereal(ctx, width, height, props);
            break;
          case 'bohemian':
            await renderBohemian(ctx, width, height, props);
            break;
          case 'minimalistic':
            await renderMinimalistic(ctx, width, height, props);
            break;
          case 'youtube_bold':
            await renderYoutubeBold(ctx, width, height, props);
            break;
          case 'tech_saas':
            await renderTechSaaS(ctx, width, height, props);
            break;
          case 'professional':
          default:
            await renderProfessional(ctx, width, height, props);
            break;
        }

        if (renderSeqRef.current !== currentSeq) return;

        // Debounce expensive toDataURL export generation so typing remains instant and buttery-smooth
        if (props.onExportReady) {
          if (exportTimerRef.current) {
            clearTimeout(exportTimerRef.current);
          }
          exportTimerRef.current = setTimeout(() => {
            if (renderSeqRef.current !== currentSeq) return;
            try {
              const pngUrl = canvas.toDataURL('image/png');
              let webpUrl = pngUrl;
              let webpSize = 0;
              try {
                webpUrl = canvas.toDataURL('image/webp', 0.9);
                const base64str = webpUrl.split(',')[1];
                if (base64str) {
                  const decoded = atob(base64str);
                  webpSize = Math.round(decoded.length / 1024);
                }
              } catch {
                // Ignore WebP error if unsupported
              }
              props.onExportReady?.(pngUrl, webpUrl, webpSize);
            } catch (err) {
              console.error('Export error: ', err);
            }
          }, 250);
        }
      } catch (err) {
        console.error("Template rendering error: ", err);
      }
    };
    
    // Execute on next animation frame
    const frameId = requestAnimationFrame(() => {
      executeRender();
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (exportTimerRef.current) {
        clearTimeout(exportTimerRef.current);
      }
    };
  }, [props]);

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
