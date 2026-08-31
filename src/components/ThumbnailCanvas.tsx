
import React, { useEffect, useRef } from 'react';
import { AspectRatio, BgStyle, PostData } from '../types';

interface ThumbnailCanvasProps extends PostData {
  onExportReady?: (dataUrl: string, webpUrl?: string, webpSizeKb?: number) => void;
  className?: string;
  id?: string;
}

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
};

// --- IMPORT TEMPLATES ---
import { renderProfessional } from './canvas/professional';
import { renderEthereal } from './canvas/ethereal';
import { renderBohemian } from './canvas/bohemian';
import { renderMinimalistic } from './canvas/minimalistic';
import { renderYoutubeBold } from './canvas/youtubeBold';
import { renderTechSaaS } from './canvas/techSaas';

export const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    
    // Support high DPI
    const dpr = 2; // Fixed resolution for export quality
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `100%`;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const render = async () => {
      try {
        await document.fonts.ready;
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

        // Export logic
        if (props.onExportReady) {
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
          } catch (e) {
            console.error('WebP export failed', e);
          }
          props.onExportReady(pngUrl, webpUrl, webpSize);
        }
      } catch (err) {
        console.error("Template rendering error: ", err);
      }
    };
    
    render();
  }, [props]);

  let displayClass = "max-w-full max-h-full object-contain";

  return (
    <canvas
      id={props.id}
      ref={canvasRef}
      className={`${displayClass} ${props.className || ''}`}
      style={{ 
        display: 'block', 
        width: '100%', 
        height: '100%',
        aspectRatio: props.aspectRatio === 'youtube' ? '1280 / 720' : props.aspectRatio === 'reels' ? '1080 / 1920' : '1200 / 630' 
      }}
    />
  );
};
