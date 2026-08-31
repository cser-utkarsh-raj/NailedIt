import fs from 'node:fs';

const studioPath = 'src/components/ThumbnailStudioView.tsx';
let studio = fs.readFileSync(studioPath, 'utf8');

const oldShuffle = `  const applyRandomPreset = () => {
    const random = samplePresets[Math.floor(Math.random() * samplePresets.length)];
    onUpdatePost(random);
  };`;

const newShuffle = `  const applyRandomPreset = () => {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomTheme = bgStyles[Math.floor(Math.random() * bgStyles.length)];

    // Shuffle changes style only. Never overwrite user content or media.
    onUpdatePost({
      template: randomTemplate.id,
      bgStyle: randomTheme.id,
    });
  };`;

if (studio.includes(oldShuffle)) studio = studio.replace(oldShuffle, newShuffle);
studio = studio.replace(
  "{ id: 'corporate', label: 'Corporate', desc: 'Classic Royal Blue', color: 'from-slate-900 via-blue-600 to-sky-400', dotColor: '#2563EB', border: 'border-blue-500' },",
  "{ id: 'corporate', label: 'Corporate', desc: 'Navy & Royal Blue', color: 'from-[#071426] via-[#123A6B] to-[#3B82F6]', dotColor: '#3B82F6', border: 'border-blue-500' },"
);
studio = studio.replace(/\nconst samplePresets: Partial<PostData>\[\] = \[[\s\S]*?\n\];\n\nconst KeywordInput/, '\nconst KeywordInput');
fs.writeFileSync(studioPath, studio);

const minimalPath = 'src/components/canvas/minimalistic.ts';
let minimal = fs.readFileSync(minimalPath, 'utf8');
minimal = minimal.replace(
  /\s*const indexStr = `\[0\$\{idx \+ 1\}\]`;\n\s*const text = `\$\{indexStr\} \/ \$\{label\}`;/,
  "\n        const text = label;"
);
minimal = minimal.replace(
  /\s*\/\/ Accent index bracket[\s\S]*?ctx\.fillText\(`\/ \$\{label\}`, curX \+ \(isPortrait \? 10 : 8\) \+ bracketW, footerY\);/,
  "\n        ctx.fillStyle = palette.ink;\n        ctx.textAlign = 'center';\n        ctx.textBaseline = 'middle';\n        ctx.fillText(text, curX + itemW / 2, footerY);"
);
fs.writeFileSync(minimalPath, minimal);

const palettes = {
  'src/components/canvas/professional.ts': `corporate: {
      bgTop: '#071426',
      bgBottom: '#0B2A52',
      cardBg: 'rgba(10, 31, 61, 0.82)',
      cardBorder: 'rgba(96, 165, 250, 0.18)',
      ink: '#F8FAFC',
      muted: '#B8C7DA',
      accent: '#3B82F6',
      accentSoft: 'rgba(59, 130, 246, 0.16)',
      pillBg: 'rgba(255, 255, 255, 0.06)',
      pillBorder: 'rgba(96, 165, 250, 0.28)',
      gold: '#F59E0B',
    },`,
  'src/components/canvas/minimalistic.ts': `corporate: {
      bg: '#071426',
      cardBg: '#0D223F',
      ink: '#F8FAFC',
      muted: '#B8C7DA',
      line: 'rgba(148, 163, 184, 0.22)',
      accent: '#3B82F6',
      pillBg: 'rgba(59, 130, 246, 0.10)',
      pillBorder: 'rgba(96, 165, 250, 0.35)',
    },`,
  'src/components/canvas/bohemian.ts': `corporate: {
      background: '#071426',
      paper: '#0D223F',
      ink: '#F8FAFC',
      muted: '#B8C7DA',
      accent: '#3B82F6',
      accentSoft: 'rgba(59, 130, 246, 0.16)',
      line: 'rgba(148, 163, 184, 0.22)',
      pillBg: 'rgba(59, 130, 246, 0.10)',
      pillBorder: 'rgba(96, 165, 250, 0.35)',
    },`,
  'src/components/canvas/ethereal.ts': `corporate: { bg: '#071426', panel: '#0D223F', ink: '#F8FAFC', muted: '#B8C7DA', accent: '#3B82F6', line: 'rgba(148,163,184,.22)' },`,
  'src/components/canvas/techSaas.ts': `corporate: { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.28)', bg: '#071426' },`,
  'src/components/canvas/youtubeBold.ts': `corporate: { bg: '#071426', text: '#FFFFFF', accent: '#3B82F6', blockText: '#000000', glow: '#2563EB' },`,
};

for (const [path, replacement] of Object.entries(palettes)) {
  let text = fs.readFileSync(path, 'utf8');
  const pattern = /corporate:\s*\{[\s\S]*?\},\s*\n/;
  if (!pattern.test(text)) throw new Error(`Corporate palette not found in ${path}`);
  text = text.replace(pattern, replacement + '\n');
  fs.writeFileSync(path, text);
}

console.log('Theme consistency repair applied for Pages build.');
