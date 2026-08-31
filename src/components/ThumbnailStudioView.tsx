import React, { useState, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Copy, Check, Type, User, Briefcase, FileImage, Image as ImageIcon, LayoutTemplate, Palette, Type as TypeIcon, ImagePlus, Box } from 'lucide-react';
import { PostData, AspectRatio, BgStyle, CanvasTemplate } from '../types';
import { ThumbnailCanvas } from './ThumbnailCanvas';

interface Props {
  post: PostData;
  onUpdatePost: (updates: Partial<PostData>) => void;
}

const templates: { id: CanvasTemplate; label: string }[] = [
  { id: 'professional', label: 'Professional' },
  { id: 'ethereal', label: 'Ethereal' },
  { id: 'bohemian', label: 'Bohemian' },
  { id: 'minimalistic', label: 'Minimalistic' },
  { id: 'youtube_bold', label: 'YouTube Bold' },
  { id: 'tech_saas', label: 'Tech SaaS' },
];

const bgStyles: { id: BgStyle; label: string }[] = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'crimson', label: 'Crimson' },
  { id: 'obsidian', label: 'Obsidian' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'digital', label: 'Digital' },
  { id: 'emerald', label: 'Emerald' },
];

const aspectRatios: { id: AspectRatio; label: string }[] = [
  { id: 'og', label: 'Blog (1.91:1)' },
  { id: 'youtube', label: 'YouTube (16:9)' },
  { id: 'reels', label: 'Reels (9:16)' },
];

const KeywordInput = ({ post, onUpdatePost }: Props) => {
  const [inputValue, setInputValue] = useState('');
  
  const pills = post.keyPills ? post.keyPills.split(/[,•]/).map(p => p.trim()).filter(Boolean) : [];

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newPills = [...pills, inputValue.trim()];
      onUpdatePost({ keyPills: newPills.join(' • ') });
      setInputValue('');
    }
  };

  const removePill = (idx: number) => {
    const newPills = [...pills];
    newPills.splice(idx, 1);
    onUpdatePost({ keyPills: newPills.join(' • ') });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <TypeIcon className="w-4 h-4 text-indigo-500" />
          Tags / Keywords
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={post.showKeyPills}
            onChange={(e) => onUpdatePost({ showKeyPills: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          Show
        </label>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {pills.map((pill, idx) => (
          <div key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-200">
            {pill}
            <button onClick={() => removePill(idx)} className="ml-1 text-indigo-400 hover:text-indigo-600">×</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type and press enter..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAdd}
        className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
      />
    </div>
  );
};

export const ThumbnailStudioView = ({ post, onUpdatePost }: Props) => {
  const [canvasPngUrl, setCanvasPngUrl] = useState<string | null>(null);
  const [canvasWebpUrl, setCanvasWebpUrl] = useState<string | null>(null);
  const [webpSizeKb, setWebpSizeKb] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleShuffle = () => setRefreshKey(prev => prev + 1);

  const handleSpeakerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdatePost({ speakerImageUrl: url });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdatePost({ logoImageUrl: url });
    }
  };

  const handleDownloadPng = () => {
    if (!canvasPngUrl) return;
    const a = document.createElement('a');
    a.href = canvasPngUrl;
    a.download = `thumbnail-${post.id}.png`;
    a.click();
  };

  const handleDownloadWebP = () => {
    if (!canvasWebpUrl) return;
    const a = document.createElement('a');
    a.href = canvasWebpUrl;
    a.download = `thumbnail-${post.id}.webp`;
    a.click();
  };

  const handleCopyImage = async () => {
    if (!canvasPngUrl) return;
    try {
      const res = await fetch(canvasPngUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-500" />
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="p-5 space-y-5">
        {children}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Left Column: Editor Config (Scrollable) */}
        <div className="lg:col-span-5 xl:col-span-4 h-full overflow-y-auto pr-2 pb-10 space-y-6">
          
          <Section title="Design Layout" icon={LayoutTemplate}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Template</label>
                <select
                  value={post.template}
                  onChange={(e) => onUpdatePost({ template: e.target.value as CanvasTemplate })}
                  className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  {templates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Background</label>
                <select
                  value={post.bgStyle}
                  onChange={(e) => onUpdatePost({ bgStyle: e.target.value as BgStyle })}
                  className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  {bgStyles.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Format / Ratio</label>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => onUpdatePost({ aspectRatio: ratio.id })}
                    className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${post.aspectRatio === ratio.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Content Strategy" icon={Type}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Title</label>
              <textarea
                value={post.title}
                onChange={(e) => onUpdatePost({ title: e.target.value })}
                className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-sm min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category Tag</label>
                <input
                  type="text"
                  value={post.category}
                  onChange={(e) => onUpdatePost({ category: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand Name</label>
                <input
                  type="text"
                  value={post.brandName}
                  onChange={(e) => onUpdatePost({ brandName: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtitle (Optional)</label>
              <input
                type="text"
                value={post.subtitle}
                onChange={(e) => onUpdatePost({ subtitle: e.target.value })}
                className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            <div className="pt-4 border-t border-slate-100">
              <KeywordInput post={post} onUpdatePost={onUpdatePost} />
            </div>
            
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Text Offset & Scale</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scale</label>
                  <input type="range" min="0.5" max="2" step="0.05" value={post.textScale || 1} onChange={(e) => onUpdatePost({ textScale: parseFloat(e.target.value) })} className="w-full accent-indigo-600" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pan X</label>
                  <input type="range" min="-300" max="300" step="10" value={post.textX || 0} onChange={(e) => onUpdatePost({ textX: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pan Y</label>
                  <input type="range" min="-300" max="300" step="10" value={post.textY || 0} onChange={(e) => onUpdatePost({ textY: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Media & Branding" icon={ImagePlus}>
            <div className="space-y-4">
              {/* Speaker */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    Subject Photo
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={post.showSpeaker}
                      onChange={(e) => onUpdatePost({ showSpeaker: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    Show
                  </label>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSpeakerPhotoUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {post.speakerImageUrl && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                        <input
                          type="text"
                          value={post.speakerName || ''}
                          onChange={(e) => onUpdatePost({ speakerName: e.target.value })}
                          className="w-full text-xs rounded-md border border-slate-300 px-2 py-1.5 text-slate-900 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Role</label>
                        <input
                          type="text"
                          value={post.speakerRole || ''}
                          onChange={(e) => onUpdatePost({ speakerRole: e.target.value })}
                          className="w-full text-xs rounded-md border border-slate-300 px-2 py-1.5 text-slate-900 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Role"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scale</label>
                        <input type="range" min="0.5" max="3" step="0.05" value={post.speakerScale || 1} onChange={(e) => onUpdatePost({ speakerScale: parseFloat(e.target.value) })} className="w-full accent-indigo-600" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pan X</label>
                        <input type="range" min="-500" max="500" step="10" value={post.speakerX || 0} onChange={(e) => onUpdatePost({ speakerX: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pan Y</label>
                        <input type="range" min="-500" max="500" step="10" value={post.speakerY || 0} onChange={(e) => onUpdatePost({ speakerY: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Box className="w-4 h-4 text-indigo-500" />
                  Custom Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {post.logoImageUrl && (
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scale</label>
                      <input type="range" min="0.5" max="3" step="0.05" value={post.logoScale || 1} onChange={(e) => onUpdatePost({ logoScale: parseFloat(e.target.value) })} className="w-full accent-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pan X</label>
                      <input type="range" min="-500" max="500" step="10" value={post.logoX || 0} onChange={(e) => onUpdatePost({ logoX: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pan Y</label>
                      <input type="range" min="-500" max="500" step="10" value={post.logoY || 0} onChange={(e) => onUpdatePost({ logoY: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column: Live High-Resolution Canvas & Actions */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full overflow-hidden pb-4">
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-t-xl border border-slate-200 border-b-0 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              Live Output
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Format:</span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {post.aspectRatio === 'youtube' ? 'YouTube (16:9)' : post.aspectRatio === 'reels' ? 'Reels (9:16)' : 'Blog (1.91:1)'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-100 border border-slate-200 rounded-b-xl flex items-center justify-center p-8 overflow-hidden shadow-inner relative min-h-0">
            <div className="w-full h-full flex items-center justify-center shadow-lg rounded-md overflow-hidden bg-white">
              <ThumbnailCanvas
                {...post}
                onExportReady={(pngUrl, webpUrl, sizeKb) => {
                  setCanvasPngUrl(pngUrl);
                  if (webpUrl) setCanvasWebpUrl(webpUrl);
                  if (sizeKb) setWebpSizeKb(sizeKb);
                }}
                key={`studio-canvas-${refreshKey}`}
              />
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={handleDownloadWebP}
              className="flex-1 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download WebP ({webpSizeKb} KB)</span>
            </button>
            <button
              onClick={handleDownloadPng}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>PNG</span>
            </button>
            <button
              onClick={handleCopyImage}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-2"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image</span>
                </>
              )}
            </button>
            <button
              onClick={handleShuffle}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-lg border border-slate-200 shadow-sm transition"
              title="Force Render Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
