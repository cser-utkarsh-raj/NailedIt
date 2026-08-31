const fs = require('fs');

let content = fs.readFileSync('src/components/ThumbnailStudioView.tsx', 'utf8');

// 1. Replace TOPIC_PRESETS
const presetsRegex = /export const TOPIC_PRESETS = \[[\s\S]*?\];/;
const newPresets = `export const TOPIC_PRESETS = [
  {
    name: 'Professional',
    template: 'professional' as any,
    title: 'Financial Quarterly Report & Analysis',
    subtitle: 'Credit Risk, Markets & Growth Strategies',
    category: 'FINANCE & BANKING',
    style: 'navy' as any,
    icon: 'chart' as any,
    visualMode: 'official_logo' as any,
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
    style: 'dark' as any,
    icon: 'doc' as any,
    visualMode: 'emblem_minimal' as any,
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
    icon: 'doc' as any,
    visualMode: 'emblem_minimal' as any,
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
    icon: 'lock' as any,
    visualMode: 'emblem_minimal' as any,
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
    icon: 'chart' as any,
    visualMode: 'speaker_portrait' as any,
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
    style: 'dark' as any,
    icon: 'chip' as any,
    visualMode: 'official_logo' as any,
    showSpeaker: true,
    speakerName: 'Sarah Jenkins',
    speakerRole: 'Principal Architect',
    showKeyPills: true,
    keyPills: 'AWS • KUBERNETES • REDIS'
  }
];`;
content = content.replace(presetsRegex, newPresets);

// 2. Add preset mapping in preset click
content = content.replace(/onUpdatePost\(\{[\s\S]*?showKeyPills: preset\.showKeyPills,[\s\S]*?keyPills: preset\.keyPills[\s\S]*?\}\);/, (match) => {
    return match.replace('title: preset.title,', 'template: preset.template,\n                    title: preset.title,');
});

// 3. Add Template Selector UI in Controls Column
const formatSelectorRegex = /\{\/\* Aspect Ratio Selector \*\/\}/;
const templateSelector = `
              {/* Template Selector */}
              <div className="space-y-1.5 pb-4 border-b-2 border-black">
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
                        className={\`px-3 py-2 text-left font-bold text-xs uppercase tracking-wider border-2 border-black transition \${
                          isSel ? 'bg-[#E03C31] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-neutral-100 shadow-none'
                        }\`}
                      >
                        {tpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Aspect Ratio Selector */}`;
content = content.replace(formatSelectorRegex, templateSelector);

// 4. Update the Bauhaus UI styling classes
// Backgrounds & Borders
content = content.replace(/bg-transparent text-stone-900/g, 'bg-[#F4F4F0] text-black');
content = content.replace(/bg-white border border-\[#EAE4D9\] rounded-xl p-5 shadow-sm/g, 'bg-white border-2 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]');
content = content.replace(/bg-white border border-\[#EAE4D9\] rounded-xl p-4 shadow-sm/g, 'bg-white border-2 border-black rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]');

// Headings
content = content.replace(/text-sm font-bold text-stone-800 uppercase tracking-wider/g, 'text-sm font-black text-black uppercase tracking-widest');
content = content.replace(/text-xs font-bold text-stone-800 uppercase tracking-wider/g, 'text-xs font-black text-black uppercase tracking-widest');
content = content.replace(/text-xs font-bold text-stone-500 uppercase tracking-wider/g, 'text-xs font-black text-black uppercase tracking-widest');

// Labels
content = content.replace(/text-xs font-semibold text-stone-500/g, 'text-xs font-black text-black uppercase tracking-widest');
content = content.replace(/text-xs font-medium text-stone-500/g, 'text-xs font-black text-black uppercase tracking-widest');

// Inputs
content = content.replace(/bg-white border border-\[#EAE4D9\] rounded-lg px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:border-\[#A98467\] outline-none transition/g, 'bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-black placeholder-neutral-400 focus:ring-2 focus:ring-[#005C8A] outline-none transition font-bold');
content = content.replace(/bg-white border border-\[#EAE4D9\] rounded-lg p-2\.5 text-sm text-stone-900 focus:border-\[#A98467\] outline-none transition font-medium resize-none/g, 'bg-white border-2 border-black rounded-none p-2.5 text-sm text-black focus:ring-2 focus:ring-[#005C8A] outline-none transition font-bold resize-none');
content = content.replace(/bg-white border border-\[#EAE4D9\] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-\[#A98467\] outline-none transition/g, 'bg-white border-2 border-black rounded-none px-3 py-2 text-sm text-black focus:ring-2 focus:ring-[#005C8A] outline-none transition font-bold');
content = content.replace(/bg-white border border-\[#EAE4D9\] rounded-lg px-3 py-2 text-sm text-stone-900 focus:border-\[#A98467\] outline-none uppercase transition/g, 'bg-white border-2 border-black rounded-none px-3 py-2 text-sm text-black focus:ring-2 focus:ring-[#005C8A] outline-none uppercase transition font-bold');

// Small tags
content = content.replace(/bg-stone-100 border border-\[#EAE4D9\] text-stone-600/g, 'bg-[#F2B705] border-2 border-black text-black');
content = content.replace(/bg-stone-100 text-stone-500/g, 'bg-[#005C8A] text-white');

// Badges/buttons
content = content.replace(/bg-\[#F4F1EA\] border-\[#D5CDBD\] text-stone-900 shadow-inner/g, 'bg-[#F2B705] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]');
content = content.replace(/bg-white border-\[#EAE4D9\] hover:border-\[#D5CDBD\] text-stone-600/g, 'bg-white border-black hover:bg-neutral-100 text-black');
content = content.replace(/rounded-lg border text-left/g, 'rounded-none border-2 text-left');

// Primary buttons
content = content.replace(/bg-\[#8C6E53\] hover:bg-\[#735A43\] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition/g, 'bg-[#E03C31] hover:bg-[#C2281D] disabled:opacity-50 text-white text-sm font-black tracking-wider uppercase rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition');

// Secondary buttons
content = content.replace(/bg-white hover:bg-\[#FAF8F5\] text-stone-700 text-sm font-semibold rounded-lg border border-\[#EAE4D9\] transition/g, 'bg-white hover:bg-neutral-100 text-black text-sm font-black uppercase tracking-wider rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition');

// Presets mapping replacement
content = content.replace(/bg-stone-100 border-\[#D5CDBD\] text-stone-900 font-semibold/g, 'bg-[#F2B705] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]');
content = content.replace(/bg-white border-\[#EAE4D9\] hover:bg-stone-50 text-stone-600/g, 'bg-white border-black hover:bg-neutral-100 text-black shadow-none');
content = content.replace(/p-2\.5 text-left rounded-lg border/g, 'p-2.5 text-left rounded-none border-2 font-bold');

// Separators
content = content.replace(/border-\[#EAE4D9\]/g, 'border-black');

// Icons
content = content.replace(/text-\[#A98467\]/g, 'text-[#E03C31]');
content = content.replace(/text-stone-400/g, 'text-black');
content = content.replace(/text-stone-500/g, 'text-black');

// Canvas container
content = content.replace(/bg-\[#FAF8F5\] rounded-lg overflow-hidden border border-\[#EAE4D9\]/g, 'bg-neutral-100 rounded-none overflow-hidden border-4 border-black');

// File inputs
content = content.replace(/file:bg-\[#F4F1EA\] file:text-\[#8C6E53\] hover:file:bg-\[#EAE4D9\]/g, 'file:bg-black file:text-white hover:file:bg-neutral-800 file:border-2 file:border-black file:rounded-none file:font-black file:uppercase file:tracking-wider text-black font-bold');

fs.writeFileSync('src/components/ThumbnailStudioView.tsx', content);
