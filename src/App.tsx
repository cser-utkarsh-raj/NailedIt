import React, { useState } from 'react';
import { ThumbnailStudioView } from './components/ThumbnailStudioView';
import { DotFooter } from './components/DotFooter';
import { PostData } from './types';
import { Target, Layers } from 'lucide-react';

export default function App() {
  const [post, setPost] = useState<PostData>({
    id: 1042,
    template: 'professional',
    title: 'THE FUTURE OF WEB DEV',
    subtitle: 'Serverless architecture and modern frameworks',
    category: 'TECH & ENGINEERING',
    bgStyle: 'midnight',
    aspectRatio: 'youtube',
    brandName: 'TECH INSIGHTS',
    showSpeaker: true,
    speakerName: 'Sarah Jenkins',
    speakerRole: 'Principal Architect',
    speakerImageUrl: null,
    showKeyPills: true,
    keyPills: 'SERVERLESS • REACT • API',
    logoImageUrl: null,
  });

  const handleUpdatePost = (updates: Partial<PostData>) => {
    setPost((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="w-full h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md">
            <Target className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">NailedIt</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Thumbnail Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Workspace</span>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition">Save Project</button>
        </div>
      </header>
      <main className="flex-1 min-h-0 overflow-hidden p-6 relative">
        <ThumbnailStudioView post={post} onUpdatePost={handleUpdatePost} />
      </main>
      <DotFooter />
    </div>
  );
}
