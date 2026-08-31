import React, { useState } from 'react';
import { ThumbnailStudioView } from './components/ThumbnailStudioView';
import { DotFooter } from './components/DotFooter';
import { NailedItLogo } from './components/NailedItLogo';
import { PostData } from './types';

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

  const handleUpdatePost = (updates: Partial<PostData>) => {
    setPost((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="w-full h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <NailedItLogo size={42} className="shadow-md rounded-2xl shrink-0" />
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">NailedIt</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Custom Thumbnail Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition">Save Project</button>
        </div>
      </header>
      <main className="flex-1 min-h-0 overflow-hidden p-2 sm:p-4 lg:p-5 relative">
        <ThumbnailStudioView post={post} onUpdatePost={handleUpdatePost} />
      </main>
      <DotFooter />
    </div>
  );
}
