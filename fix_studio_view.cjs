const fs = require('fs');

let content = fs.readFileSync('src/components/ThumbnailStudioView.tsx', 'utf8');

// 1. Rewrite TOPIC_PRESETS
const presetsRegex = /export const TOPIC_PRESETS = \[[\s\S]*?\];/;
const newPresets = `export const TOPIC_PRESETS = [
  {
    name: 'Professional',
    template: 'professional' as any,
    title: 'Financial Quarterly Report & Analysis',
    subtitle: 'Credit Risk, Markets & Growth Strategies',
    category: 'FINANCE & BANKING',
    style: 'midnight' as any,
    showSpeaker: false,
    showKeyPills: true,
    keyPills: 'Q3 EARNINGS • MARKET CAP • RISK'
  },
  {
    name: 'Ethereal',
    template: 'ethereal' as any,
    title: 'Mindful Morning Routines for Inner Peace',
    subtitle: 'Awaken your spirit with soft light and breathing',
    category: 'WELLNESS & MEDITATION',
    style: 'obsidian' as any,
    showSpeaker: false,
    showKeyPills: true,
    keyPills: 'BREATHWORK • CALM • FOCUS'
  },
  {
    name: 'Bohemian',
    template: 'bohemian' as any,
    title: 'Artisan Crafts & Woven Textiles',
    subtitle: 'A journey into handmade global traditions',
    category: 'ART & LIFESTYLE',
    style: 'emerald' as any,
    showSpeaker: true,
    speakerName: 'Maya Silva',
    speakerRole: 'Creative Director',
    showKeyPills: true,
    keyPills: 'HANDMADE • TEXTURES • EARTHY'
  },
  {
    name: 'Minimalistic',
    template: 'minimalistic' as any,
    title: 'Less is More: The Art of Essentialism',
    subtitle: 'Declutter your space, mind, and workflow',
    category: 'PRODUCTIVITY',
    style: 'corporate' as any,
    showSpeaker: false,
    showKeyPills: false,
    keyPills: ''
  },
  {
    name: 'YouTube Bold',
    template: 'youtube_bold' as any,
    title: 'I TRIED THE 5AM CLUB FOR 30 DAYS!',
    subtitle: 'You will not believe the results.',
    category: 'CHALLENGE',
    style: 'digital' as any,
    showSpeaker: true,
    speakerName: 'Alex Creator',
    speakerRole: 'Vlogger',
    showKeyPills: true,
    keyPills: 'MIND BLOWN • PRODUCTIVE • SECRETS'
  },
  {
    name: 'Tech SaaS',
    template: 'tech_saas' as any,
    title: 'Scaling Node.js Microservices to 10k QPS',
    subtitle: 'Architecture patterns for high availability',
    category: 'ENGINEERING BLOG',
    style: 'obsidian' as any,
    showSpeaker: true,
    speakerName: 'Sarah Jenkins',
    speakerRole: 'Principal Architect',
    showKeyPills: true,
    keyPills: 'AWS • KUBERNETES • REDIS'
  }
];`;
content = content.replace(presetsRegex, newPresets);

// 2. Remove Motif and other unused states from onUpdatePost in presets
content = content.replace(/iconMotif: analyzed\.iconMotif,/g, '');

// 3. Update Theme Palette section
const themePaletteRegex = /\{\/\* Theme Palette \*\/\}.*?<\/div>/s;
const newThemePalette = `{/* Theme Palette */}
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
              </div>`;
content = content.replace(themePaletteRegex, newThemePalette);

// 4. Update Emblem Motif Block -> Remove it entirely
const motifRegex = /\{\/\* Emblem Motif \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>/;
content = content.replace(motifRegex, '');

// 5. Faculty -> Subject / Author
content = content.replace(/Faculty Portrait \& Bio/g, 'Subject / Author Details');
content = content.replace(/Faculty Photo/g, 'Subject Photo');
content = content.replace(/Name \(e\.g\., Dr\. Sharma\)/g, 'Name');

// 6. Fix styling to Win95/Vaporwave
// Panels
content = content.replace(/bg-white border-2 border-black/g, 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800');
content = content.replace(/bg-neutral-100 rounded-none overflow-hidden border-4 border-black/g, 'bg-[#008080] border-t-4 border-l-4 border-gray-800 border-b-4 border-r-4 border-white p-2');

// Buttons
content = content.replace(/bg-\[\#E03C31\] hover:bg-\[\#C2281D\] disabled:opacity-50 text-white text-sm font-black tracking-wider uppercase rounded-none border-2 border-black shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]/g, 'bg-[#c0c0c0] hover:bg-[#d0d0d0] active:bg-[#a0a0a0] disabled:opacity-50 text-black text-sm font-bold rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white');
content = content.replace(/bg-white hover:bg-neutral-100 text-black text-sm font-black uppercase tracking-wider rounded-none border-2 border-black shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]/g, 'bg-[#c0c0c0] hover:bg-[#d0d0d0] text-black text-sm font-bold rounded-none border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800');

// Inputs
content = content.replace(/bg-white border-2 border-black/g, 'bg-white border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white');
content = content.replace(/focus:ring-2 focus:ring-\[\#005C8A\]/g, 'focus:outline-none focus:bg-[#000080] focus:text-white');

// Badges/Tags
content = content.replace(/bg-\[\#F2B705\]/g, 'bg-[#ff99cc]');
content = content.replace(/bg-\[\#005C8A\]/g, 'bg-[#00ffff]');

// Delete iconMotif from Canvas
content = content.replace(/iconMotif=\{post\.iconMotif\}/g, '');
content = content.replace(/aspectRatio=\{post\.aspectRatio\}/g, '');
content = content.replace(/visualMode=\{post\.visualMode\}/g, '');

// Clean up border-black instances remaining for dividers
content = content.replace(/border-black/g, 'border-gray-400');

// Title Bar for sidebar panels
content = content.replace(/className="h-full flex flex-col"/g, 'className="h-full flex flex-col font-mono"');
content = content.replace(/<div className="flex items-center gap-2 mb-4">/g, '<div className="bg-[#000080] text-white font-bold p-1 flex items-center gap-2 mb-4"><span className="text-xl">📺</span><span>');
content = content.replace(/<\/h2>[\s\S]*?<\/div>/, '</span></div>');

// Template Selector
const tplSelRegex = /\{\/\* Template Selector \*\/\}[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(tplSelRegex, (match) => {
    return match
        .replace(/border-2 border-gray-400/g, 'border-2 border-t-white border-l-white border-b-gray-800 border-r-gray-800')
        .replace(/bg-\[\#E03C31\] text-white shadow-\[2px_2px_0px_0px_rgba\(0,0,0,1\)\]/g, 'bg-[#000080] text-white inset-shadow')
        .replace(/bg-white text-black hover:bg-neutral-100 shadow-none/g, 'bg-[#c0c0c0] text-black hover:bg-[#d0d0d0]')
});

fs.writeFileSync('src/components/ThumbnailStudioView.tsx', content);
