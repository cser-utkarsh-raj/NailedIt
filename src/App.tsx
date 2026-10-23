import React, { useRef, useState } from 'react';
import { Download, FolderOpen, Sparkles, Wand2 } from 'lucide-react';
import { ThumbnailStudioView } from './components/ThumbnailStudioView';
import { DotFooter } from './components/DotFooter';
import { NailedItLogo } from './components/NailedItLogo';
import { PostData } from './types';
import { generateDesign } from './utils/autoDesign';

export default function App() {
  const [post, setPost] = useState<PostData>({
    id: 1042,
    template: 'professional',
    title: 'HOW TO SCALE YOUR BUSINESS',
    subtitle: 'Proven strategies for sustainable growth and leadership',
    category: 'MASTERCLASS',
    bgStyle: 'midnight',
    aspectRatio: 'youtube',
    brandName: 'GROWTH LAB',
    showSpeaker: true,
    speakerName: 'Sarah Jenkins',
    speakerRole: 'Managing Director',
    speakerImageUrl: null,
    showKeyPills: true,
    keyPills: 'STRATEGY • GROWTH • LEADERSHIP',
    logoImageUrl: null,
    footerLinks: ['growthlab.io', '@sarahjenkins', 'youtube.com/@growthlab'],
    showFooterLinks: true,
  });
  const [designing, setDesigning] = useState(false);
  const [designMessage, setDesignMessage] = useState('');
  const [projectMessage, setProjectMessage] = useState('');
  const projectInputRef = useRef<HTMLInputElement>(null);

  const handleUpdatePost = (updates: Partial<PostData>) => {
    setPost((prev) => {
      const isShufflePreset = Boolean(
        updates.template && updates.bgStyle && updates.title && updates.subtitle &&
        updates.category && updates.brandName && updates.speakerName && updates.speakerRole
      );
      if (isShufflePreset) return { ...prev, template: updates.template!, bgStyle: updates.bgStyle! };
      return { ...prev, ...updates };
    });
  };

  const handleAutoDesign = async () => {
    if (!post.title.trim()) return;
    setDesigning(true);
    setDesignMessage('Analyzing your content…');
    const plan = await generateDesign(post);
    handleUpdatePost({
      template: plan.template,
      bgStyle: plan.bgStyle,
      title: plan.title,
      subtitle: plan.subtitle,
      category: plan.category,
      keyPills: plan.keyPills,
      showKeyPills: plan.showKeyPills,
      textScale: plan.textScale,
    });
    setDesignMessage('Designed. Tweak anything you want.');
    setDesigning(false);
    window.setTimeout(() => setDesignMessage(''), 2200);
  };

  const handleSaveProject = () => {
    const project = {
      format: 'nailedit-project',
      version: 1,
      savedAt: new Date().toISOString(),
      post,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nailedit-${post.id || 'project'}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setProjectMessage('Project file saved');
    window.setTimeout(() => setProjectMessage(''), 2500);
  };

  const handleOpenProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const project = JSON.parse(await file.text());
      const candidate = project?.post;
      const validTemplates = ['professional', 'ethereal', 'bohemian', 'minimalistic', 'youtube_bold', 'tech_saas'];
      const validBackgrounds = ['midnight', 'crimson', 'obsidian', 'corporate', 'digital', 'emerald'];
      if (
        project?.format !== 'nailedit-project' || project?.version !== 1 ||
        !candidate || typeof candidate !== 'object' ||
        typeof candidate.id !== 'number' || typeof candidate.title !== 'string' ||
        typeof candidate.subtitle !== 'string' || typeof candidate.category !== 'string' ||
        typeof candidate.brandName !== 'string' || !validTemplates.includes(candidate.template) ||
        !validBackgrounds.includes(candidate.bgStyle)
      ) {
        throw new Error('This is not a supported NailedIt project file.');
      }
      setPost(candidate as PostData);
      setProjectMessage('Project opened');
    } catch (error) {
      setProjectMessage(error instanceof Error ? error.message : 'Could not open this project file.');
    }
    window.setTimeout(() => setProjectMessage(''), 3500);
  };

  return (
    <div className="w-full h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <NailedItLogo size={42} className="shadow-md rounded-2xl shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">NailedIt</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight truncate">AI Thumbnail Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {designMessage && <span className="hidden sm:block text-[11px] font-semibold text-slate-500 animate-pulse">{designMessage}</span>}
          {projectMessage && <span role="status" aria-live="polite" className="sr-only md:not-sr-only md:text-[11px] md:font-semibold md:text-slate-500">{projectMessage}</span>}
          <input ref={projectInputRef} type="file" accept="application/json,.json" onChange={handleOpenProject} className="sr-only" aria-label="Open a NailedIt project file" />
          <button
            type="button"
            onClick={() => projectInputRef.current?.click()}
            aria-label="Open project"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2.5 transition cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Open</span>
          </button>
          <button
            type="button"
            onClick={handleAutoDesign}
            disabled={designing || !post.title.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2.5 shadow-lg shadow-indigo-900/10 transition-all active:scale-[.98] cursor-pointer"
          >
            {designing ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Wand2 className="w-4 h-4" />}
            {designing ? 'Designing…' : 'Auto Design'}
          </button>
          <button type="button" onClick={handleSaveProject} aria-label="Save project" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save Project</span>
          </button>
        </div>
      </header>
      <main className="flex-1 min-h-0 overflow-hidden p-2 sm:p-4 lg:p-5 relative">
        <ThumbnailStudioView post={post} onUpdatePost={handleUpdatePost} />
      </main>
      <DotFooter />
    </div>
  );
}

