const fs = require('fs');

// Fix professional.ts
let prof = fs.readFileSync('src/components/canvas/professional.ts', 'utf8');
prof = prof.replace(/props\.bgStyle === 'navy'/g, "props.bgStyle === 'midnight'");
prof = prof.replace(/props\.bgStyle === 'rbi'/g, "props.bgStyle === 'crimson'");
fs.writeFileSync('src/components/canvas/professional.ts', prof);

// Fix minimalistic.ts
let min = fs.readFileSync('src/components/canvas/minimalistic.ts', 'utf8');
min = min.replace(/props\.style === 'navy'/g, "props.bgStyle === 'midnight'");
min = min.replace(/props\.style === 'dark'/g, "props.bgStyle === 'obsidian'");
min = min.replace(/\['navy', 'dark', 'rbi'\]\.includes\(props\.style\)/g, "['midnight', 'obsidian', 'crimson', 'digital'].includes(props.bgStyle)");
fs.writeFileSync('src/components/canvas/minimalistic.ts', min);

// Fix thumbnailcanvas
let tc = fs.readFileSync('src/components/ThumbnailCanvas.tsx', 'utf8');
tc = tc.replace(/iconMotif\?: IconMotif;/g, '');
tc = tc.replace(/aspectRatio\?: AspectRatio;/g, '');
tc = tc.replace(/visualMode\?: VisualBrandingMode;/g, '');
tc = tc.replace(/import \{ AspectRatio, BgStyle, ExportFormat, IconMotif, VisualBrandingMode \}/g, "import { BgStyle, ExportFormat }");
fs.writeFileSync('src/components/ThumbnailCanvas.tsx', tc);
