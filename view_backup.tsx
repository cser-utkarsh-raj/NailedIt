import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Check, 
  Sliders, 
  Layers, 
  UserCheck, 
  Tag, 
  Image as ImageIcon,
  Copy,
  ExternalLink,
  ShieldCheck,
  Eye,
  Zap,
  Youtube,
  Globe,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AspectRatio, BgStyle, IconMotif, PostData, VisualBrandingMode } from '../types';
import { ThumbnailCanvas } from './ThumbnailCanvas';
import { analyzeHeading } from '../utils/smartTopicAnalyzer';

interface ThumbnailStudioViewProps {
  post: PostData;
  onUpdatePost: (updates: Partial<PostData>) => void;
}

export const TOPIC_PRESETS = [
  {
    name: 'Types of Charges on Securities',
    title: 'Types of Charges on Securities in Loan Accounts',
    subtitle: 'Hypothecation, Pledge, Mortgage, Lien & Assignment',
    category: 'BANKING LAW & CREDIT APPRAISAL',
    style: 'navy' as BgStyle,
    icon: 'scales' as IconMotif,
    visualMode: 'speaker_portrait' as VisualBrandingMode,
    showSpeaker: true,
    speakerName: 'Banking Faculty',
    speakerRole: 'Credit Risk & Legal Digest',
    showKeyPills: true,
    keyPills: 'HYPOTHECATION • PLEDGE • MORTGAGE • LIEN • ASSIGNMENT'
  },
  {
    name: 'RBI Master Direction on Lending',
    title: 'RBI Master Direction on Credit & Lending Norms',
    subtitle: 'Operational Guidelines, Risk Categorization & Circular Analysis',
    category: 'RBI CIRCULARS & GUIDELINES',
    style: 'rbi' as BgStyle,
    icon: 'shield' as IconMotif,
    visualMode: 'official_logo' as VisualBrandingMode,
    showSpeaker: false,
    showKeyPills: true,
    keyPills: 'PRUDENTIAL NORMS • SMA / NPA • LARGE EXPOSURES'
  },
  {
    name: 'MSME & Priority Sector',
    title: 'MSME Policy & Priority Sector Lending Norms',
    subtitle: 'Credit Appraisal, Subsidies & Classification Criteria',
    category: 'MSME & GOVT SCHEMES',
    style: 'emerald' as BgStyle,
    icon: 'chart' as IconMotif,
    visualMode: 'speaker_portrait' as VisualBrandingMode,
    showSpeaker: true,
    speakerName: 'Dr. R. K. Sharma',
    speakerRole: 'Chief Advisor, MSME Cell',
    showKeyPills: true,
    keyPills: 'CGTMSE • RESTRUCTURE • CLUSTER FINANCING'
  },
  {
    name: 'Bank Guarantee & Indemnity',
    title: 'Bank Guarantee and Indemnity Contract',
    subtitle: 'Legal Framework, Invocation Rules & Supreme Court Precedents',
    category: 'BANKING LAW & PRACTICE',
    style: 'navy' as BgStyle,
    icon: 'bank' as IconMotif,
    visualMode: 'official_logo' as VisualBrandingMode,
    showSpeaker: false,
    showKeyPills: true,
    keyPills: 'PERFORMANCE BG • FINANCIAL BG • INJUNCTION NORMS'
  },
  {
    name: 'Digital Banking & Cyber Security',
    title: 'Core Banking Solutions & 24x7 Digital Banking',
    subtitle: 'API Banking, UPI Interoperability & Cyber Risk Defense',
    category: 'DIGITAL BANKING & FINTECH',
    style: 'digital' as BgStyle,
    icon: 'chip' as IconMotif,
    visualMode: 'speaker_portrait' as VisualBrandingMode,
    showSpeaker: true,
    speakerName: 'Fintech Faculty',
    speakerRole: 'Cyber Resilience Lead',
    showKeyPills: true,
    keyPills: 'API GATEWAY • ZERO TRUST • FRAUD MONITORING'
  }
];

export const ThumbnailStudioView: React.FC<ThumbnailStudioViewProps> = ({
  post,
  onUpdatePost
}) => {
  const [canvasPngUrl, setCanvasPngUrl] = useState<string | null>(null);
  const [canvasWebpUrl, setCanvasWebpUrl] = useState<string | null>(null);
  const [webpSizeKb, setWebpSizeKb] = useState<number>(38);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [magicHeadingInput, setMagicHeadingInput] = useState('');

  const handleMagicAnalyze = () => {
    if (!magicHeadingInput.trim()) return;
    const analyzed = analyzeHeading(magicHeadingInput);
    onUpdatePost({
      title: magicHeadingInput,
      category: analyzed.category,
      subtitle: analyzed.subtitle,
      bgStyle: analyzed.bgStyle,
      iconMotif: analyzed.iconMotif,
      showKeyPills: true,
      keyPills: analyzed.keyPills,
      speakerImageUrl: null, // Reset to null or keep previous
      visualMode: post.visualMode || 'speaker_portrait'
    });
    setMagicHeadingInput('');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleSpeakerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdatePost({
        speakerImageUrl: ev.target?.result as string,
        visualMode: 'speaker_portrait'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdatePost({
        logoImageUrl: ev.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadWebP = () => {
    const url = canvasWebpUrl || canvasPngUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `bankingdigests-${(post.title || 'thumbnail').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const handleDownloadPng = () => {
    if (!canvasPngUrl) return;
    const a = document.createElement('a');
    a.href = canvasPngUrl;
    a.download = `bankingdigests-${(post.title || 'thumbnail').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleCopyImage = async () => {
    const url = canvasPngUrl;
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-stone-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Magic 1-Click Heading Input Bar */}
        <div className="bg-white border border-[#EAE4D9] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A98467]" />
              <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                Magic Thumbnail Generator
              </h2>
            </div>
            <span className="text-[11px] bg-stone-100 border border-[#EAE4D9] text-stone-600 px-2.5 py-0.5 rounded-full font-semibold">
              Enter post heading
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={magicHeadingInput}
              onChange={(e) => setMagicHeadingInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMagicAnalyze()}
              placeholder="e.g. 'SARFAESI Act and Recovery of NPA Accounts by Banks'..."
              className="flex-1 bg-white border border-[#EAE4D9] rounded-lg px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:border-[#A98467] outline-none transition"
            />
            <button
              onClick={handleMagicAnalyze}
              disabled={!magicHeadingInput.trim()}
              className="px-6 py-3 bg-[#8C6E53] hover:bg-[#735A43] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Auto-Generate</span>
            </button>
          </div>
        </div>

        {/* Top Topic Presets Bar */}
        <div className="bg-white border border-[#EAE4D9] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Curated Presets
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {TOPIC_PRESETS.map((preset, idx) => {
              const isSelected = post.title === preset.title;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onUpdatePost({
                      title: preset.title,
                      subtitle: preset.subtitle,
                      category: preset.category,
                      bgStyle: preset.style,
                      iconMotif: preset.icon,
                      visualMode: preset.visualMode,
                      showSpeaker: preset.showSpeaker ?? false,
                      speakerName: preset.speakerName ?? 'Banking Faculty',
                      speakerRole: preset.speakerRole ?? 'Credit Risk & Legal Digest',
                      showKeyPills: preset.showKeyPills ?? false,
                      keyPills: preset.keyPills ?? ''
                    });
                  }}
                  className={`p-2.5 text-left rounded-lg border text-xs transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-100 border-[#D5CDBD] text-stone-900 font-semibold'
                      : 'bg-white border-[#EAE4D9] hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <span className="font-bold text-[11px] line-clamp-1 block mb-1">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-stone-500 line-clamp-1">
                    {preset.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Grid: Controls on Left, Live Canvas on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Format & Visual Branding Selector */}
            <div className="bg-white border border-[#EAE4D9] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-stone-400" />
                  Format & Layout Target
                </span>
                <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">
                  Multi-Channel
                </span>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500">
                  Export Target:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'og', label: 'WordPress Blog', sub: '1200 × 630 WebP', icon: Globe },
                    { id: 'youtube', label: 'YouTube Video', sub: '1280 × 720 (16:9)', icon: Youtube },
                    { id: 'square', label: 'Square Social', sub: '1080 × 1080', icon: Square }
                  ].map((fmt) => {
                    const isSel = (post.aspectRatio || 'og') === fmt.id;
                    const IconC = fmt.icon;
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => onUpdatePost({ aspectRatio: fmt.id as AspectRatio })}
                        className={`p-3 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSel
                            ? 'bg-[#F4F1EA] border-[#D5CDBD] text-stone-900 shadow-inner'
                            : 'bg-white border-[#EAE4D9] hover:border-[#D5CDBD] text-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <IconC className={`w-4 h-4 ${isSel ? 'text-[#8C6E53]' : 'text-stone-400'}`} />
                          <span className="font-bold text-[11px] leading-tight">{fmt.label}</span>
                        </div>
                        <span className={`text-[10px] ${isSel ? 'text-stone-600' : 'text-stone-500'}`}>{fmt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visual Branding Mode */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-500">
                    Visual Branding Accent:
                  </label>
                  <span className="text-[10px] text-[#A98467] font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Official Watermark Integrated
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'speaker_portrait', label: 'Faculty Portrait', sub: 'Gold-rim avatar' },
                    { id: 'official_logo', label: 'Official Logo', sub: 'Watermark' },
                    { id: 'emblem_minimal', label: 'Minimalist Motif', sub: 'Topic emblem' }
                  ].map((mode) => {
                    const isSel = (post.visualMode || 'speaker_portrait') === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => onUpdatePost({ visualMode: mode.id as VisualBrandingMode })}
                        className={`p-3 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSel
                            ? 'bg-[#F4F1EA] border-[#D5CDBD] text-stone-900 shadow-inner'
                            : 'bg-white border-[#EAE4D9] hover:border-[#D5CDBD] text-stone-600'
                        }`}
                      >
                        <span className="font-bold text-[11px] leading-tight mb-1">{mode.label}</span>
                        <span className={`text-[10px] ${isSel ? 'text-stone-600' : 'text-stone-500'}`}>{mode.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Essential Content Box */}
            <div className="bg-white border border-[#EAE4D9] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-stone-400" />
                  Thumbnail Content & Styling
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-500">
                  Article Title / Headline:
                </label>
                <textarea
                  value={post.title}
                  onChange={(e) => onUpdatePost({ title: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-[#EAE4D9] rounded-lg p-2.5 text-sm text-stone-900 focus:border-[#A98467] outline-none transition font-medium resize-none"
                  placeholder="e.g. Types of Charges on Securities in Loan Accounts"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-500">
                  Subtitle / Key Takeaway:
                </label>
                <input
                  type="text"
                  value={post.subtitle || ''}
                  onChange={(e) => onUpdatePost({ subtitle: e.target.value })}
                  className="w-full bg-white border border-[#EAE4D9] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-[#A98467] outline-none transition"
                  placeholder="e.g. Hypothecation, Pledge, Mortgage, Lien & Assignment"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-500">
                  Category Tag Badge:
                </label>
                <input
                  type="text"
                  value={post.category}
                  onChange={(e) => onUpdatePost({ category: e.target.value })}
                  className="w-full bg-white border border-[#EAE4D9] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-[#A98467] outline-none uppercase transition"
                  placeholder="e.g. BANKING LAW & CREDIT APPRAISAL"
                />
              </div>

              {/* Color Theme & Motif */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">
                    Theme Palette:
                  </label>
                  <select
                    value={post.bgStyle}
                    onChange={(e) => onUpdatePost({ bgStyle: e.target.value as BgStyle })}
                    className="w-full bg-white border border-[#EAE4D9] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-[#A98467] outline-none transition"
                  >
                    <option value="navy">Navy & Gold (Default)</option>
                    <option value="rbi">RBI Maroon & Gold</option>
                    <option value="emerald">Emerald MSME & Growth</option>
                    <option value="digital">Digital Fintech Cyan</option>
                    <option value="corporate">Corporate Royal Blue</option>
                    <option value="dark">Executive Dark</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">
                    Emblem Motif:
                  </label>
                  <select
                    value={post.iconMotif || 'scales'}
                    onChange={(e) => onUpdatePost({ iconMotif: e.target.value as IconMotif })}
                    className="w-full bg-white border border-[#EAE4D9] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-[#A98467] outline-none transition"
                  >
                    <option value="scales">⚖️ Scales of Justice</option>
                    <option value="lock">🔒 Security & Lien</option>
                    <option value="bank">🏛️ Central Bank Columns</option>
                    <option value="rupee">₹ Indian Rupee</option>
                    <option value="shield">🛡️ Regulatory Compliance</option>
                    <option value="chart">📈 Market Growth</option>
                    <option value="chip">⚡ Digital & Fintech</option>
                    <option value="doc">📋 Official Circular</option>
                  </select>
                </div>
              </div>

              {/* Speaker Customization (if visualMode === speaker_portrait) */}
              {post.visualMode === 'speaker_portrait' && (
                <div className="space-y-3 pt-4 border-t border-[#EAE4D9]">
                  <label className="text-xs font-semibold text-stone-500">
                    Faculty Portrait & Bio:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={post.speakerName || ''}
                      onChange={(e) => onUpdatePost({ speakerName: e.target.value })}
                      className="bg-white border border-[#EAE4D9] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-[#A98467] outline-none transition"
                      placeholder="e.g. Banking Faculty"
                    />
                    <input
                      type="text"
                      value={post.speakerRole || ''}
                      onChange={(e) => onUpdatePost({ speakerRole: e.target.value })}
                      className="bg-white border border-[#EAE4D9] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-[#A98467] outline-none transition"
                      placeholder="e.g. Credit Risk Digest"
                    />
                  </div>

                  <div className="pt-1">
                    <label className="text-xs font-medium text-stone-500 block mb-1.5">
                      Upload Custom Photo:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSpeakerPhotoUpload}
                      className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F4F1EA] file:text-[#8C6E53] hover:file:bg-[#EAE4D9] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Always show the Logo Watermark upload in both modes, but put it below */}
              <div className="space-y-3 pt-4 border-t border-[#EAE4D9]">
                <div className="pt-1">
                  <label className="text-xs font-medium text-stone-500 block mb-1.5">
                    Upload Custom Logo (Watermark):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F4F1EA] file:text-[#8C6E53] hover:file:bg-[#EAE4D9] cursor-pointer"
                  />
                </div>
              </div>

              {/* Key Pills Bar */}
              <div className="space-y-1.5 pt-4 border-t border-[#EAE4D9]">
                <label className="text-xs font-semibold text-stone-500">
                  Topic Micro-Pills (Separated by • or comma):
                </label>
                <input
                  type="text"
                  value={post.keyPills || ''}
                  onChange={(e) => onUpdatePost({ keyPills: e.target.value, showKeyPills: true })}
                  className="w-full bg-white border border-[#EAE4D9] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-[#A98467] outline-none transition"
                  placeholder="HYPOTHECATION • PLEDGE • MORTGAGE • LIEN"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live High-Resolution Canvas & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-[#EAE4D9] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A98467] animate-pulse" />
                  <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Canvas Preview
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>Format:</span>
                  <span className="font-mono text-stone-900 font-bold uppercase">
                    {post.aspectRatio === 'youtube' ? 'YouTube 16:9' : post.aspectRatio === 'square' ? 'Square 1:1' : 'WebP'}
                  </span>
                </div>
              </div>

              {/* The Live Canvas */}
              <div className="w-full bg-[#FAF8F5] rounded-lg overflow-hidden border border-[#EAE4D9]">
                <ThumbnailCanvas
                  title={post.title}
                  subtitle={post.subtitle}
                  category={post.category}
                  bgStyle={post.bgStyle}
                  iconMotif={post.iconMotif}
                  aspectRatio={post.aspectRatio}
                  visualMode={post.visualMode || 'speaker_portrait'}
                  brandName={post.brandName}
                  siteUrl={post.siteUrl}
                  customOverlayImage={post.customBgUrl}
                  speakerName={post.speakerName}
                  speakerRole={post.speakerRole}
                  speakerImageUrl={post.speakerImageUrl}
                  logoImageUrl={post.logoImageUrl}
                  showSpeaker={post.visualMode === 'speaker_portrait'}
                  keyPills={post.keyPills}
                  showKeyPills={post.showKeyPills}
                  onExportReady={(pngUrl, webpUrl, sizeKb) => {
                    setCanvasPngUrl(pngUrl);
                    if (webpUrl) setCanvasWebpUrl(webpUrl);
                    if (sizeKb) setWebpSizeKb(sizeKb);
                  }}
                  key={`studio-canvas-${refreshKey}`}
                />
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadWebP}
                  className="flex-1 px-4 py-2.5 bg-[#8C6E53] hover:bg-[#735A43] text-white text-sm font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WebP ({webpSizeKb} KB)</span>
                </button>

                <button
                  onClick={handleDownloadPng}
                  className="px-4 py-2.5 bg-white hover:bg-[#FAF8F5] text-stone-700 text-sm font-semibold rounded-lg border border-[#EAE4D9] transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-stone-400" />
                  <span>PNG</span>
                </button>

                <button
                  onClick={handleCopyImage}
                  className="px-4 py-2.5 bg-white hover:bg-[#FAF8F5] text-stone-700 text-sm font-semibold rounded-lg border border-[#EAE4D9] transition flex items-center gap-1.5"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-4 h-4 text-[#A98467]" />
                      <span className="text-[#A98467]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="p-2.5 bg-white hover:bg-[#FAF8F5] text-stone-500 rounded-lg border border-[#EAE4D9] transition"
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
