const fs = require('fs');

let app = `
import React, { useState } from 'react';
import { ThumbnailStudioView } from './components/ThumbnailStudioView';
import { PostData } from './types';

export default function App() {
  const [post, setPost] = useState<PostData>({
    id: 1042,
    template: 'professional',
    title: 'The Future of Web Development',
    subtitle: 'Serverless architecture and modern frameworks',
    category: 'TECH & ENGINEERING',
    content: \`A comprehensive guide to scaling your applications using modern web development practices and tools.\`,
    bgStyle: 'midnight',
    customBgUrl: null,
    featuredImageUrl: null,
    brandName: 'TECH INSIGHTS',
    siteUrl: 'www.techinsights.com',
    showSpeaker: true,
    speakerName: 'Sarah Jenkins',
    speakerRole: 'Principal Architect',
    speakerImageUrl: null,
    exportFormat: 'png',
    showKeyPills: true,
    keyPills: 'SERVERLESS • REACT • API',
    logoImageUrl: null,
  });

  const handleUpdatePost = (updates: Partial<PostData>) => {
    setPost((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="w-full h-screen flex flex-col font-mono bg-[#ffb3c6] text-black antialiased overflow-hidden select-none"
         style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.3) 25%, rgba(0, 255, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.3) 75%, rgba(0, 255, 255, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.3) 25%, rgba(0, 255, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.3) 75%, rgba(0, 255, 255, 0.3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}>
      
      {/* Vaporwave / Win95 Top Navigation Bar */}
      <header className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 px-4 py-2 m-2 flex items-center justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-4">
           {/* Retro Icon */}
           <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-[#000080] border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white overflow-hidden text-2xl">
            💾
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-sans font-black text-2xl tracking-tighter uppercase flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]" style={{ WebkitTextStroke: '1px #000080' }}>
                Vapor<span className="text-purple-600">Gen</span>
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#000080] uppercase tracking-widest mt-1 hidden sm:block">
              Custom Thumbnail Generator
            </p>
          </div>
        </div>
        
        {/* Retro Window Controls */}
        <div className="hidden md:flex gap-1">
           <div className="w-6 h-6 flex items-center justify-center bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 font-bold text-xs pb-1">_</div>
           <div className="w-6 h-6 flex items-center justify-center bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 font-bold text-xs">□</div>
           <div className="w-6 h-6 flex items-center justify-center bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 font-bold text-xs">X</div>
        </div>
      </header>

      {/* Main Single-View Content Screen */}
      <main className="flex-1 overflow-hidden flex flex-col p-2 pt-0">
        <ThumbnailStudioView
          post={post}
          onUpdatePost={handleUpdatePost}
        />
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', app);
