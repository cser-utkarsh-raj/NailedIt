const fs = require('fs');
let code = fs.readFileSync('src/components/ThumbnailStudioView.tsx', 'utf8');

const shuffleLogic = `
  const handleShuffle = () => {
    const templates = ['professional', 'ethereal', 'bohemian', 'minimalistic', 'youtube_bold', 'tech_saas'];
    const styles = ['midnight', 'crimson', 'obsidian', 'corporate', 'digital', 'emerald'];
    const rTpl = templates[Math.floor(Math.random() * templates.length)];
    const rSty = styles[Math.floor(Math.random() * styles.length)];
    onUpdatePost({ template: rTpl as any, bgStyle: rSty as any });
    setRefreshKey((k) => k + 1);
  };
`;

code = code.replace(/const handleCopyImage = async \(\) => {/g, shuffleLogic + '\n  const handleCopyImage = async () => {');
code = code.replace(/onClick=\{\(\) => setRefreshKey\(\(k\) => k \+ 1\)\}/g, 'onClick={handleShuffle}');

fs.writeFileSync('src/components/ThumbnailStudioView.tsx', code);
