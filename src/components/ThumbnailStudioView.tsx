import React, { useState, useCallback } from 'react';
import { 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Type, 
  User, 
  Briefcase, 
  Image as ImageIcon, 
  LayoutTemplate, 
  Palette, 
  ImagePlus, 
  Box, 
  Sparkles, 
  Sliders, 
  Layers, 
  Proportions as AspectRatioIcon,
  RotateCcw,
  Tag,
  Monitor,
  Smartphone,
  BookOpen,
  Shuffle,
  Eye,
  Edit3,
  Link as LinkIcon,
  Globe,
  Plus
} from 'lucide-react';
import { PostData, AspectRatio, BgStyle, CanvasTemplate } from '../types';
import { ThumbnailCanvas } from './ThumbnailCanvas';

interface Props {
  post: PostData;
  onUpdatePost: (updates: Partial<PostData>) => void;
}

interface TemplateOption {
  id: CanvasTemplate;
  label: string;
  desc: string;
}

const templates: TemplateOption[] = [
  { id: 'professional', label: 'Professional', desc: 'Clean executive layout' },
  { id: 'minimalistic', label: 'Minimalistic', desc: 'Modern Swiss typography' },
  { id: 'tech_saas', label: 'Tech', desc: 'Developer code aesthetic' },
  { id: 'youtube_bold', label: 'Creator', desc: 'High contrast impact' },
  { id: 'ethereal', label: 'Elegant', desc: 'Soft glowing atmosphere' },
  { id: 'bohemian', label: 'Editorial', desc: 'Artisan magazine composition' },
];

interface BgOption {
  id: BgStyle;
  label: string;
  desc: string;
  color: string;
  dotColor: string;
  border: string;
}

const bgStyles: BgOption[] = [
  { id: 'midnight', label: 'Midnight', desc: 'Indigo & Celestial', color: 'from-slate-950 via-indigo-600 to-sky-400', dotColor: '#6366F1', border: 'border-indigo-500' },
  { id: 'obsidian', label: 'Obsidian', desc: 'Charcoal & Amber', color: 'from-zinc-950 via-zinc-800 to-amber-400', dotColor: '#F59E0B', border: 'border-amber-500' },
  { id: 'corporate', label: 'Corporate', desc: 'Classic Royal Blue', color: 'from-slate-900 via-blue-600 to-sky-400', dotColor: '#2563EB', border: 'border-blue-500' },
  { id: 'emerald', label: 'Emerald', desc: 'Botanical Sage', color: 'from-zinc-950 via-emerald-600 to-teal-300', dotColor: '#10B981', border: 'border-emerald-500' },
  { id: 'crimson', label: 'Crimson', desc: 'Desert Rose & Coral', color: 'from-zinc-950 via-rose-600 to-orange-400', dotColor: '#F43F5E', border: 'border-rose-500' },
  { id: 'digital', label: 'Digital', desc: 'Aegean Aqua Cyan', color: 'from-slate-950 via-cyan-500 to-teal-200', dotColor: '#06B6D4', border: 'border-cyan-500' },
];

const aspectRatios: { id: AspectRatio; label: string; icon: any; dim: string }[] = [
  { id: 'youtube', label: 'YouTube (16:9)', icon: Monitor, dim: '1280 × 720' },
  { id: 'og', label: 'Blog (1.91:1)', icon: BookOpen, dim: '1200 × 630' },
  { id: 'reels', label: 'Reels (9:16)', icon: Smartphone, dim: '1080 × 1920' },
];

const samplePresets: Partial<PostData>[] = [
  {
    template: 'professional',
    bgStyle: 'midnight',
    title: 'HOW TO SCALE YOUR BUSINESS',
    subtitle: 'Proven strategies for sustainable growth and leadership',
    category: 'MASTERCLASS',
    brandName: 'GROWTH LAB',
    speakerName: 'Sarah Jenkins',
    speakerRole: 'Managing Director',
    keyPills: 'STRATEGY • GROWTH • LEADERSHIP',
    showKeyPills: true,
    footerLinks: ['growthlab.io', '@sarahjenkins', 'youtube.com/@growthlab'],
    showFooterLinks: true,
  },
  {
    template: 'minimalistic',
    bgStyle: 'obsidian',
    title: 'THE ESSENTIAL DESIGN GUIDE',
    subtitle: 'Mastering visual balance, typography, and clean layout structure',
    category: 'CREATIVE SERIES',
    brandName: 'STUDIO JOURNAL',
    speakerName: 'Alex Rivera',
    speakerRole: 'Creative Director',
    keyPills: 'DESIGN • TYPOGRAPHY • LAYOUT',
    showKeyPills: true,
    footerLinks: ['@alexrivera', 'studiojournal.com', '@studio.design'],
    showFooterLinks: true,
  },
  {
    template: 'tech_saas',
    bgStyle: 'digital',
    title: 'BUILDING MODERN APPLICATIONS',
    subtitle: 'Step-by-step workflow from initial concept to public launch',
    category: 'HANDS-ON WORKSHOP',
    brandName: 'DEV PULSE',
    speakerName: 'David Chen',
    speakerRole: 'Lead Engineer',
    keyPills: 'WORKFLOW • ARCHITECTURE • LAUNCH',
    showKeyPills: true,
    footerLinks: ['github.com/devpulse', '@davidchen', 'devpulse.app'],
    showFooterLinks: true,
  },
  {
    template: 'youtube_bold',
    bgStyle: 'crimson',
    title: 'HOW I DOUBLED RESULTS IN 30 DAYS',
    subtitle: 'The exact framework and daily routine I followed',
    category: 'CASE STUDY',
    brandName: 'CREATOR HUB',
    speakerName: 'Marcus Vance',
    speakerRole: 'Host & Creator',
    keyPills: 'PRODUCTIVITY • ROUTINE • RESULTS',
    showKeyPills: true,
    footerLinks: ['youtube.com/@marcus', '@marcusvance', 'creatorhub.com'],
    showFooterLinks: true,
  },
  {
    template: 'ethereal',
    bgStyle: 'emerald',
    title: 'THE ART OF MINDFUL LIVING',
    subtitle: 'Daily practices for mental clarity, focus, and work-life balance',
    category: 'LIFESTYLE & WELLNESS',
    brandName: 'SERENITY LIFE',
    speakerName: 'Elena Brooks',
    speakerRole: 'Wellness Coach',
    keyPills: 'WELLNESS • BALANCE • FOCUS',
    showKeyPills: true,
    footerLinks: ['serenitylife.co', '@elenabrooks', 'podcast.apple.com'],
    showFooterLinks: true,
  },
  {
    template: 'bohemian',
    bgStyle: 'corporate',
    title: 'STORIES BEHIND GREAT IDEAS',
    subtitle: 'Deep conversations with innovators shaping today\'s culture',
    category: 'EXCLUSIVE INTERVIEW',
    brandName: 'THE DISPATCH',
    speakerName: 'Jordan Hayes',
    speakerRole: 'Senior Editor',
    keyPills: 'STORIES • CULTURE • INSIGHTS',
    showKeyPills: true,
    footerLinks: ['thedispatch.mag', '@jordanhayes', 'dispatch.substack.com'],
    showFooterLinks: true,
  },
];

const KeywordInput = ({ post, onUpdatePost }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const pills = post.keyPills ? post.keyPills.split(/[,•]/).map(p => p.trim()).filter(Boolean) : [];

  const handleAdd = () => {
    const textToAdd = inputValue.trim();
    if (textToAdd && pills.length < 4) {
      const newPills = [...pills, textToAdd];
      onUpdatePost({ keyPills: newPills.join(' • ') });
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
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
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-indigo-600" />
          Tags
        </label>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-medium">{pills.length}/4</span>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={post.showKeyPills}
              onChange={(e) => onUpdatePost({ showKeyPills: e.target.checked })}
              className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            Show
          </label>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pills.map((pill, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-200 shadow-2xs">
            {pill}
            <button type="button" onClick={() => removePill(idx)} className="text-indigo-400 hover:text-indigo-700 font-bold ml-0.5">×</button>
          </span>
        ))}
      </div>
      {pills.length < 4 && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a tag..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xs rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-2xs"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      )}
    </div>
  );
};

const FooterLinksInput = ({ post, onUpdatePost }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const links = (post.footerLinks || []).slice(0, 4);

  const handleAdd = () => {
    const textToAdd = inputValue.trim();
    if (textToAdd && links.length < 4) {
      const newLinks = [...links, textToAdd];
      onUpdatePost({ footerLinks: newLinks });
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeLink = (idx: number) => {
    const newLinks = [...links];
    newLinks.splice(idx, 1);
    onUpdatePost({ footerLinks: newLinks });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
          Footer Links
        </label>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-medium">{links.length}/4</span>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={post.showFooterLinks !== false}
              onChange={(e) => onUpdatePost({ showFooterLinks: e.target.checked })}
              className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            Show
          </label>
        </div>
      </div>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {links.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-md border border-slate-200 shadow-2xs">
              <Globe className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate max-w-[150px]">{item}</span>
              <button
                type="button"
                onClick={() => removeLink(idx)}
                className="text-slate-400 hover:text-rose-600 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {links.length < 4 && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. @handle, domain.com, channel..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xs rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-2xs"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export const ThumbnailStudioView = ({ post, onUpdatePost }: Props) => {
  const [activeTab, setActiveTab] = useState<'style' | 'content' | 'media' | 'layout'>('style');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [canvasPngUrl, setCanvasPngUrl] = useState<string | null>(null);
  const [canvasWebpUrl, setCanvasWebpUrl] = useState<string | null>(null);
  const [webpSizeKb, setWebpSizeKb] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleSpeakerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdatePost({ speakerImageUrl: url, showSpeaker: true });
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
    a.download = `thumbnail-${post.id || 'export'}.png`;
    a.click();
  };

  const handleDownloadWebP = () => {
    if (!canvasWebpUrl && !canvasPngUrl) return;
    const a = document.createElement('a');
    a.href = canvasWebpUrl || canvasPngUrl!;
    a.download = `thumbnail-${post.id || 'export'}.webp`;
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
      console.error('Failed to copy image', err);
    }
  };

  const applyRandomPreset = () => {
    const random = samplePresets[Math.floor(Math.random() * samplePresets.length)];
    onUpdatePost(random);
  };

  const resetTextTransform = () => {
    onUpdatePost({ textScale: 1, textX: 0, textY: 0 });
  };

  const resetSpeakerTransform = () => {
    onUpdatePost({ speakerScale: 1, speakerX: 0, speakerY: 0 });
  };

  const resetLogoTransform = () => {
    onUpdatePost({ logoScale: 1, logoX: 0, logoY: 0 });
  };

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col min-h-0">
      
      {/* Mobile / Tablet View Switcher (< lg) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 rounded-xl mb-2.5 shrink-0 border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'editor'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'preview'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Output Preview</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Left Control Panel */}
        <div className={`${mobileView === 'editor' ? 'flex' : 'hidden'} lg:flex lg:col-span-5 xl:col-span-5 flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0`}>
          
            {/* Navigation Tabs Header */}
          <div className="flex border-b border-slate-100 bg-slate-50/80 p-1.5 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'style'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <ImagePlus className="w-3.5 h-3.5" />
              <span>Assets</span>
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'layout'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Transform</span>
            </button>
          </div>

          {/* Scrollable Tab Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            
            {/* TAB 1: CANVAS & THEME */}
            {activeTab === 'style' && (
              <div className="space-y-6">
                
                {/* Template Selection Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <LayoutTemplate className="w-3.5 h-3.5 text-indigo-600" />
                      Templates
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {templates.map((tpl) => {
                      const isSelected = post.template === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => onUpdatePost({ template: tpl.id })}
                          className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                              : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className={`font-bold text-xs ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                              {tpl.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{tpl.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palette Swatches */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-600" />
                    Theme
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {bgStyles.map((bg) => {
                      const isSelected = post.bgStyle === bg.id;
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => onUpdatePost({ bgStyle: bg.id })}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                            isSelected
                              ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/50 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-gradient-to-tr ${bg.color} border-2 border-white shadow-xs shrink-0 ring-1 ring-slate-300`}
                          />
                          <div className="min-w-0 flex-1">
                            <span className={`block text-xs truncate ${isSelected ? 'font-bold text-indigo-950' : 'font-semibold text-slate-800'}`}>
                              {bg.label}
                            </span>
                            <span className="block text-[10px] text-slate-500 truncate leading-tight">
                              {bg.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <AspectRatioIcon className="w-3.5 h-3.5 text-indigo-600" />
                    Layout
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                    {aspectRatios.map((ratio) => {
                      const Icon = ratio.icon;
                      const isSelected = post.aspectRatio === ratio.id;
                      return (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => onUpdatePost({ aspectRatio: ratio.id })}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-white text-indigo-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px]">{ratio.label.split(' ')[0]}</span>
                          <span className="text-[9px] text-slate-400 font-normal">{ratio.dim}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: CONTENT & COPY */}
            {activeTab === 'content' && (
              <div className="space-y-5">
                
                {/* Main Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Headline / Title</label>
                    <span className="text-[10px] text-slate-400 font-medium">{(post.title || '').length} chars</span>
                  </div>
                  <textarea
                    value={post.title}
                    onChange={(e) => onUpdatePost({ title: e.target.value })}
                    rows={3}
                    placeholder="Enter prominent thumbnail headline..."
                    className="w-full text-sm font-semibold rounded-xl border border-slate-200 p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-2xs resize-none"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subtitle / Secondary Hook</label>
                  <input
                    type="text"
                    value={post.subtitle || ''}
                    onChange={(e) => onUpdatePost({ subtitle: e.target.value })}
                    placeholder="Brief contextual supporting text..."
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-2xs"
                  />
                </div>

                {/* Category & Brand Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category Tag</label>
                    <input
                      type="text"
                      value={post.category || ''}
                      onChange={(e) => onUpdatePost({ category: e.target.value })}
                      placeholder="e.g. TECH & DESIGN"
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brand Name</label>
                    <input
                      type="text"
                      value={post.brandName || ''}
                      onChange={(e) => onUpdatePost({ brandName: e.target.value })}
                      placeholder="e.g. STUDIO LABS"
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* Tags / Pills Input */}
                <div className="pt-3 border-t border-slate-100">
                  <KeywordInput post={post} onUpdatePost={onUpdatePost} />
                </div>

                {/* Footer Links Input */}
                <div className="pt-3 border-t border-slate-100">
                  <FooterLinksInput post={post} onUpdatePost={onUpdatePost} />
                </div>

              </div>
            )}

            {/* TAB 3: MEDIA & ASSETS */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                
                {/* Speaker Photo Card */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Subject Photo</h4>
                        <p className="text-[10px] text-slate-500">Portrait or featured speaker</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={post.showSpeaker}
                        onChange={(e) => onUpdatePost({ showSpeaker: e.target.checked })}
                        className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      Enable
                    </label>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSpeakerPhotoUpload}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                  />

                  {post.showSpeaker && (
                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Subject Name</label>
                          <input
                            type="text"
                            value={post.speakerName || ''}
                            onChange={(e) => onUpdatePost({ speakerName: e.target.value })}
                            placeholder="Full Name"
                            className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-900 bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Role / Title</label>
                          <input
                            type="text"
                            value={post.speakerRole || ''}
                            onChange={(e) => onUpdatePost({ speakerRole: e.target.value })}
                            placeholder="Designation"
                            className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      {/* Photo Positioning Sliders */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Transform & Position</span>
                          <button
                            type="button"
                            onClick={resetSpeakerTransform}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Reset
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                              <span>Scale</span>
                              <span>{(post.speakerScale || 1).toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="3"
                              step="0.05"
                              value={post.speakerScale || 1}
                              onChange={(e) => onUpdatePost({ speakerScale: parseFloat(e.target.value) })}
                              className="w-full accent-indigo-600"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                              <span>Pan X</span>
                              <span>{post.speakerX || 0}</span>
                            </div>
                            <input
                              type="range"
                              min="-400"
                              max="400"
                              step="5"
                              value={post.speakerX || 0}
                              onChange={(e) => onUpdatePost({ speakerX: parseInt(e.target.value) })}
                              className="w-full accent-indigo-600"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                              <span>Pan Y</span>
                              <span>{post.speakerY || 0}</span>
                            </div>
                            <input
                              type="range"
                              min="-400"
                              max="400"
                              step="5"
                              value={post.speakerY || 0}
                              onChange={(e) => onUpdatePost({ speakerY: parseInt(e.target.value) })}
                              className="w-full accent-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Logo Card */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Custom Brand Logo</h4>
                      <p className="text-[10px] text-slate-500">Vector PNG or SVG badge</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-black cursor-pointer"
                  />

                  {post.logoImageUrl && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Logo Transform</span>
                        <button
                          type="button"
                          onClick={resetLogoTransform}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          Reset
                        </button>
                      </div>
                      {/* Quick Placement Presets */}
                      <div className="pt-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quick Placement</span>
                        <div className="grid grid-cols-4 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onUpdatePost({ logoX: 0, logoY: 0 })}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded text-center transition-colors"
                          >
                            Top Left
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdatePost({
                              logoX: post.aspectRatio === 'reels' ? 860 : post.aspectRatio === 'youtube' ? 1060 : 960,
                              logoY: 0
                            })}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded text-center transition-colors"
                          >
                            Top Right
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdatePost({
                              logoX: 0,
                              logoY: post.aspectRatio === 'reels' ? 1680 : post.aspectRatio === 'youtube' ? 560 : 520
                            })}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded text-center transition-colors"
                          >
                            Bottom Left
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdatePost({
                              logoX: post.aspectRatio === 'reels' ? 860 : post.aspectRatio === 'youtube' ? 1060 : 960,
                              logoY: post.aspectRatio === 'reels' ? 1680 : post.aspectRatio === 'youtube' ? 560 : 520
                            })}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded text-center transition-colors"
                          >
                            Bottom Right
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                            <span>Scale</span>
                            <span>{(post.logoScale || 1).toFixed(2)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.4"
                            max="3"
                            step="0.05"
                            value={post.logoScale || 1}
                            onChange={(e) => onUpdatePost({ logoScale: parseFloat(e.target.value) })}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                            <span>Pan X</span>
                            <span>{post.logoX || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="1400"
                            step="5"
                            value={post.logoX || 0}
                            onChange={(e) => onUpdatePost({ logoX: parseInt(e.target.value) })}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                            <span>Pan Y</span>
                            <span>{post.logoY || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="1850"
                            step="5"
                            value={post.logoY || 0}
                            onChange={(e) => onUpdatePost({ logoY: parseInt(e.target.value) })}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: LAYOUT & TRANSFORM */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                
                {/* Text Block Positioning */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Type className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Typography Transform</h4>
                        <p className="text-[10px] text-slate-500">Scale and adjust text bounding box</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetTextTransform}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600 font-semibold">
                        <span>Font Size Scaling</span>
                        <span className="text-indigo-600">{(post.textScale || 1).toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={post.textScale || 1}
                        onChange={(e) => onUpdatePost({ textScale: parseFloat(e.target.value) })}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600 font-semibold">
                          <span>Pan X</span>
                          <span className="text-indigo-600">{post.textX || 0}px</span>
                        </div>
                        <input
                          type="range"
                          min="-300"
                          max="300"
                          step="5"
                          value={post.textX || 0}
                          onChange={(e) => onUpdatePost({ textX: parseInt(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600 font-semibold">
                          <span>Pan Y</span>
                          <span className="text-indigo-600">{post.textY || 0}px</span>
                        </div>
                        <input
                          type="range"
                          min="-300"
                          max="300"
                          step="5"
                          value={post.textY || 0}
                          onChange={(e) => onUpdatePost({ textY: parseInt(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Quick View Button on Mobile (< lg) */}
          <div className="lg:hidden p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>View Output & Export</span>
            </button>
            <button
              type="button"
              onClick={applyRandomPreset}
              title="Shuffle preset"
              aria-label="Shuffle preset"
              className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-2xs hover:bg-slate-100 active:scale-98 transition flex items-center justify-center cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: High-Res Interactive Canvas & Export Toolbar */}
        <div className={`${mobileView === 'preview' ? 'flex' : 'hidden'} lg:flex lg:col-span-7 xl:col-span-7 flex-col h-full overflow-hidden min-h-0`}>
          
          {/* Top Canvas Bar */}
          <div className="flex items-center justify-between bg-white px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-t-2xl border border-slate-200 border-b-0 shadow-2xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                Output
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 sm:px-2.5 py-1 rounded-md border border-slate-200">
                {post.aspectRatio === 'youtube' ? '1280 × 720 (16:9)' : post.aspectRatio === 'reels' ? '1080 × 1920 (9:16)' : '1200 × 630 (1.91:1)'}
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 sm:px-2.5 py-1 rounded-md border border-indigo-100">
                {templates.find(t => t.id === post.template)?.label || post.template}
              </span>
            </div>
          </div>
          
          {/* Canvas Viewport Stage with Dynamic Adaptability */}
          <div className="flex-1 bg-slate-900 border border-slate-200 rounded-b-2xl flex items-center justify-center p-2 sm:p-3 lg:p-4 overflow-hidden shadow-inner relative min-h-0">
            {/* Subtle stage grid pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <div className="w-full h-full flex items-center justify-center max-w-full max-h-full overflow-hidden relative z-10">
              <ThumbnailCanvas
                {...post}
                onExportReady={(pngUrl, webpUrl, sizeKb) => {
                  setCanvasPngUrl(pngUrl);
                  if (webpUrl) setCanvasWebpUrl(webpUrl);
                  if (sizeKb) setWebpSizeKb(sizeKb);
                }}
              />
            </div>
          </div>

          {/* Action Export Buttons Toolbar */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3 shrink-0">
            <button
              onClick={handleDownloadWebP}
              className="col-span-2 sm:flex-1 px-4 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="truncate">Download WebP {webpSizeKb > 0 ? `(${webpSizeKb} KB)` : ''}</span>
            </button>
            <button
              onClick={handleDownloadPng}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500 shrink-0" />
              <span>PNG</span>
            </button>
            <button
              onClick={handleCopyImage}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={applyRandomPreset}
              title="Shuffle preset"
              aria-label="Shuffle preset"
              className="col-span-2 sm:col-span-1 p-2.5 sm:p-3 bg-white hover:bg-slate-50 hover:text-indigo-600 active:scale-[0.98] text-slate-700 rounded-xl border border-slate-200 shadow-2xs transition flex items-center justify-center cursor-pointer"
            >
              <Shuffle className="w-4 h-4 shrink-0" />
              <span className="sm:hidden ml-1.5 text-xs font-bold">Shuffle</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
