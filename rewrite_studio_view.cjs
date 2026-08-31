const fs = require('fs');

const studioView = `
import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  Check, 
  Copy,
  Youtube,
  Globe,
  Smartphone
} from 'lucide-react';
import { AspectRatio, BgStyle, PostData } from '../types';
import { ThumbnailCanvas } from './ThumbnailCanvas';

interface ThumbnailStudioViewProps {
  post: PostData;
  onUpdatePost: (updates: Partial<PostData>) => void;
}

export const ThumbnailStudioView: React.FC<ThumbnailStudioViewProps> = ({
  post,
  onUpdatePost
}) => {
  const [canvasPngUrl, setCanvasPngUrl] = useState<string | null>(null);
  const [canvasWebpUrl, setCanvasWebpUrl] = useState<string | null>(null);
  const [webpSizeKb, setWebpSizeKb] = useState<number>(38);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDownloadWebP = () => {
    if (!canvasWebpUrl) return;
    const link = document.createElement('a');
    link.download = \`\${post.title.substring(0, 30).replace(/\\s+/g, '-')}-thumbnail.webp\`;
    link.href = canvasWebpUrl;
    link.click();
  };

  const handleDownloadPng = () => {
    if (!canvasPngUrl) return;
    const link = document.createElement('a');
    link.download = \`\${post.title.substring(0, 30).replace(/\\s+/g, '-')}-thumbnail.png\`;
    link.href = canvasPngUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    if (!canvasPngUrl) return;
    try {
      const res = await fetch(canvasPngUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    } catch (e) {
      console.error('Failed to copy image to clipboard:', e);
    }
  };

  const handleSpeakerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpdatePost({ speakerImageUrl: ev.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpdatePost({ logoImageUrl: ev.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1600px] mx-auto w-full h-full p-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          
          {/* Left Column: Data Entry & Controls */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className="bg-[#000080] text-white font-bold p-1 flex items-center gap-2 mb-2">
                <span className="text-xl">🎛️</span>
                <span>Canvas Properties</span>
              </div>

              {/* Template Selector */}
              <div className="space-y-1.5 pb-4 border-b-2 border-gray-400">
                <label className="text-xs font-black uppercase tracking-widest text-black">
                  Canvas Template:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'professional', label: 'Professional' },
                    { id: 'ethereal', label: 'Ethereal' },
                    { id: 'bohemian', label: 'Bohemian' },
                    { id: 'minimalistic', label: 'Minimalistic' },
                    { id: 'youtube_bold', label: 'YouTube Bold' },
                    { id: 'tech_saas', label: 'Tech SaaS' }
                  ].map((tpl) => {
                    const isSel = post.template === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => onUpdatePost({ template: tpl.id as any })}
                        className={\`px-3 py-2 text-left font-bold text-xs uppercase tracking-wider border-2 border-t-white border-l-white border-b-gray-800 border-r-gray-800 transition \${
                          isSel ? 'bg-[#000080] text-white inset-shadow' : 'bg-[#c0c0c0] text-black hover:bg-[#d0d0d0]'
                        }\`}
                      >
                        {tpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Aspect Ratio Selector */}
              <div className="space-y-1.5 pb-4 border-b-2 border-gray-400">
                <label className="text-xs font-black text-black uppercase tracking-widest">
                  Export Target:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'og', label: 'Blog / Web', sub: '1200 × 630', icon: Globe },
                    { id: 'youtube', label: 'YouTube', sub: '1280 × 720', icon: Youtube },
                    { id: 'reels', label: 'IG Reels', sub: '1080 × 1920', icon: Smartphone }
                  ].map((fmt) => {
                    const isSel = (post.aspectRatio || 'og') === fmt.id;
                    const IconC = fmt.icon;
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => onUpdatePost({ aspectRatio: fmt.id as AspectRatio })}
                        className={\`p-3 rounded-none border-2 text-left transition cursor-pointer flex flex-col justify-between \${
                          isSel
                            ? 'bg-[#ff99cc] border-t-gray-800 border-l-gray-800 border-b-white border-r-white text-black inset-shadow'
                            : 'bg-[#c0c0c0] border-t-white border-l-white border-b-gray-800 border-r-gray-800 hover:bg-[#d0d0d0] text-black'
                        }\`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <IconC className={\`w-4 h-4 \${isSel ? 'text-[#000080]' : 'text-black'}\`} />
                          <span className="font-bold text-[11px] leading-tight">{fmt.label}</span>
                        </div>
                        <span className={\`text-[10px] \${isSel ? 'text-black' : 'text-black'}\`}>{fmt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Palette */}
              <div className="space-y-1.5 pb-4 border-b-2 border-gray-400">
                <label className="text-xs font-bold uppercase tracking-widest text-[#000080]">
                  Color Theme:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'midnight', label: 'Midnight Blue' },
                    { id: 'crimson', label: 'Crimson Red' },
                    { id: 'obsidian', label: 'Obsidian Dark' },
                    { id: 'corporate', label: 'Corporate' },
                    { id: 'digital', label: 'Digital Cyan' },
                    { id: 'emerald', label: 'Emerald Green' },
                  ].map((style) => {
                    const isSel = post.bgStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => onUpdatePost({ bgStyle: style.id as any })}
                        className={\`py-2 text-center text-xs font-bold font-mono transition border-2 \${
                          isSel ? 'bg-[#000080] text-white border-gray-800 inset-shadow' : 'bg-[#c0c0c0] text-black border-t-white border-l-white border-b-gray-800 border-r-gray-800 hover:bg-[#d0d0d0]'
                        }\`}
                      >
                        {style.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="bg-[#000080] text-white font-bold p-1 flex items-center gap-2 mb-2">
                <span className="text-xl">📝</span>
                <span>Content Editor</span>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black uppercase tracking-widest">
                  Primary Title:
                </label>
                <textarea
                  rows={2}
                  value={post.title}
                  onChange={(e) => onUpdatePost({ title: e.target.value })}
                  className="w-full bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none p-2.5 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold resize-none"
                  placeholder="Enter primary hook or title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-black uppercase tracking-widest">
                    Category Tag:
                  </label>
                  <input
                    type="text"
                    value={post.category}
                    onChange={(e) => onUpdatePost({ category: e.target.value })}
                    className="w-full bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none px-3 py-2 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold"
                    placeholder="e.g. TECHNOLOGY"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-black uppercase tracking-widest">
                    Brand Name:
                  </label>
                  <input
                    type="text"
                    value={post.brandName}
                    onChange={(e) => onUpdatePost({ brandName: e.target.value })}
                    className="w-full bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none px-3 py-2 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold"
                    placeholder="e.g. ACME CORP"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-black uppercase tracking-widest">
                  Subtitle / Hook:
                </label>
                <input
                  type="text"
                  value={post.subtitle || ''}
                  onChange={(e) => onUpdatePost({ subtitle: e.target.value })}
                  className="w-full bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none px-3 py-2 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold"
                  placeholder="Supporting text for context"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-400">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={post.showSpeaker}
                    onChange={(e) => onUpdatePost({ showSpeaker: e.target.checked })}
                    className="w-4 h-4 rounded-none accent-[#000080] cursor-pointer"
                  />
                  <span className="text-xs font-black text-black uppercase tracking-widest group-hover:text-[#000080]">
                    Enable Subject / Author Details
                  </span>
                </label>
                
                {post.showSpeaker && (
                  <div className="grid grid-cols-2 gap-3 pl-6 border-l-2 border-[#000080] ml-2">
                    <input
                      type="text"
                      value={post.speakerName || ''}
                      onChange={(e) => onUpdatePost({ speakerName: e.target.value })}
                      className="bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none px-3 py-2 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold"
                      placeholder="e.g. Sarah Jenkins"
                    />
                    <input
                      type="text"
                      value={post.speakerRole || ''}
                      onChange={(e) => onUpdatePost({ speakerRole: e.target.value })}
                      className="bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none px-3 py-2 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold"
                      placeholder="e.g. Principal Architect"
                    />
                  </div>
                )}
              </div>

              {/* Uploads in Side-by-side Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-400">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-black uppercase tracking-widest block mb-1.5">
                    Upload Subject Photo:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSpeakerPhotoUpload}
                    className="w-full text-xs text-black file:mr-2 file:py-1 file:px-2 file:rounded-none file:border-2 file:border-t-white file:border-l-white file:border-b-gray-800 file:border-r-gray-800 file:text-xs file:font-bold file:bg-[#c0c0c0] file:text-black hover:file:bg-[#d0d0d0] font-bold cursor-pointer bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white p-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-black uppercase tracking-widest block mb-1.5">
                    Upload Custom Logo:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-black file:mr-2 file:py-1 file:px-2 file:rounded-none file:border-2 file:border-t-white file:border-l-white file:border-b-gray-800 file:border-r-gray-800 file:text-xs file:font-bold file:bg-[#c0c0c0] file:text-black hover:file:bg-[#d0d0d0] font-bold cursor-pointer bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white p-1"
                  />
                </div>
              </div>

              {/* Key Pills Bar */}
              <div className="space-y-1.5 pt-4 border-t border-gray-400">
                <label className="text-xs font-black text-black uppercase tracking-widest">
                  Topic Micro-Pills (Separated by • or comma):
                </label>
                <input
                  type="text"
                  value={post.keyPills || ''}
                  onChange={(e) => onUpdatePost({ keyPills: e.target.value, showKeyPills: true })}
                  className="w-full bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white rounded-none px-3 py-2 text-sm text-black focus:outline-none focus:bg-[#000080] focus:text-white outline-none transition font-bold"
                  placeholder="REACT • NODEJS • API"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live High-Resolution Canvas & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-gray-400 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-none bg-[#00ff00] border-2 border-gray-800" />
                  <h2 className="text-xs font-black text-black uppercase tracking-widest">
                    Canvas Output
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-black">
                  <span>Target:</span>
                  <span className="font-mono text-[#000080] font-bold uppercase">
                    {post.aspectRatio === 'youtube' ? 'YouTube 16:9' : post.aspectRatio === 'reels' ? 'IG Reels 9:16' : 'Web 1.91:1'}
                  </span>
                </div>
              </div>

              {/* The Live Canvas */}
              <div className="w-full bg-[#008080] rounded-none overflow-hidden border-t-4 border-l-4 border-gray-800 border-b-4 border-r-4 border-white p-2">
                <ThumbnailCanvas
                  template={post.template}
                  title={post.title}
                  subtitle={post.subtitle}
                  category={post.category}
                  bgStyle={post.bgStyle}
                  aspectRatio={post.aspectRatio}
                  brandName={post.brandName}
                  speakerName={post.speakerName}
                  speakerRole={post.speakerRole}
                  speakerImageUrl={post.speakerImageUrl}
                  logoImageUrl={post.logoImageUrl}
                  showSpeaker={post.showSpeaker}
                  keyPills={post.keyPills}
                  showKeyPills={post.showKeyPills}
                  onExportReady={(pngUrl, webpUrl, sizeKb) => {
                    setCanvasPngUrl(pngUrl);
                    if (webpUrl) setCanvasWebpUrl(webpUrl);
                    if (sizeKb) setWebpSizeKb(sizeKb);
                  }}
                  key={\`studio-canvas-\${refreshKey}\`}
                />
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t-2 border-gray-400 mt-2 p-2 bg-[#d0d0d0]">
                <button
                  onClick={handleDownloadWebP}
                  className="flex-1 px-4 py-2.5 bg-[#000080] hover:bg-[#0000a0] active:bg-[#000060] text-white text-sm font-bold rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white transition flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WebP ({webpSizeKb} KB)</span>
                </button>
                <button
                  onClick={handleDownloadPng}
                  className="px-4 py-2.5 bg-[#c0c0c0] hover:bg-[#d0d0d0] active:bg-[#a0a0a0] text-black text-sm font-bold rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white transition flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>PNG</span>
                </button>
                <button
                  onClick={handleCopyImage}
                  className="px-4 py-2.5 bg-[#c0c0c0] hover:bg-[#d0d0d0] active:bg-[#a0a0a0] text-black text-sm font-bold rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white transition flex items-center gap-1.5 uppercase tracking-wider"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-4 h-4 text-[#ff00ff]" />
                      <span className="text-[#ff00ff]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="p-2.5 bg-[#c0c0c0] hover:bg-[#d0d0d0] active:bg-[#a0a0a0] text-black rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white transition"
                  title="Re-render Canvas"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/ThumbnailStudioView.tsx', studioView);
