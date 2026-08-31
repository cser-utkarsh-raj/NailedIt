const fs = require('fs');

let tc = fs.readFileSync('src/components/ThumbnailCanvas.tsx', 'utf8');

// Replace "ExportFormat" and "BgStyle" import line
tc = tc.replace(/import \{.*?\} from '\.\.\/types';/, "import { AspectRatio, BgStyle } from '../types';");

// Make sure AspectRatio is in props
tc = tc.replace(/bgStyle: BgStyle;/g, "bgStyle: BgStyle;\n  aspectRatio?: AspectRatio;");

// Fix the dimensions code
const dimsRegex = /let width = 1200;\s*let height = 630;\s*if \(props\.aspectRatio === 'youtube'\) \{\s*width = 1280;\s*height = 720;\s*\} else if \(props\.aspectRatio === 'square'\) \{\s*width = 1080;\s*height = 1080;\s*\}/;
const newDims = `let width = 1200;
    let height = 630;
    if (props.aspectRatio === 'youtube') {
      width = 1280;
      height = 720;
    } else if (props.aspectRatio === 'reels') {
      width = 1080;
      height = 1920;
    }`;
tc = tc.replace(dimsRegex, newDims);

// Fix display aspect ratio
tc = tc.replace(/if \(props\.aspectRatio === 'square'\) displayClass = "w-full h-auto aspect-square";/, "if (props.aspectRatio === 'reels') displayClass = \"w-full h-auto aspect-[9/16]\";");

fs.writeFileSync('src/components/ThumbnailCanvas.tsx', tc);
