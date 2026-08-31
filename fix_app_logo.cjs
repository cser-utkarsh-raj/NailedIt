const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const glitchLogo = `<div className="relative w-10 h-10 flex items-center justify-center shrink-0 border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white bg-black">
            <div className="absolute inset-0 bg-[#00ffff] rounded-none translate-x-[2px] translate-y-[-2px] mix-blend-screen opacity-70"></div>
            <div className="absolute inset-0 bg-[#ff00ff] rounded-none translate-x-[-2px] translate-y-[2px] mix-blend-screen opacity-70"></div>
            <div className="absolute inset-1 bg-[#E03C31] rounded-none flex items-center justify-center z-10">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
            </div>
          </div>`;

app = app.replace(/<div className="w-10 h-10 flex items-center justify-center shrink-0 bg-\[\#000080\] border-t-2 border-l-2 border-gray-800 border-b-2 border-r-2 border-white overflow-hidden text-2xl">\s*🗿\s*<\/div>/, glitchLogo);

fs.writeFileSync('src/App.tsx', app);
