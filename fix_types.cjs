const fs = require('fs');

let types = `
export type BgStyle = 'midnight' | 'crimson' | 'obsidian' | 'corporate' | 'digital' | 'emerald';
export type ExportFormat = 'webp' | 'png';

export type CanvasTemplate = 'professional' | 'ethereal' | 'bohemian' | 'minimalistic' | 'youtube_bold' | 'tech_saas';

export interface PostData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  content: string;
  template: CanvasTemplate;
  bgStyle: BgStyle;
  exportFormat: ExportFormat;
  thematicArt?: string;
  customBgUrl: string | null;
  featuredImageUrl: string | null;
  brandName: string;
  siteUrl: string;
  speakerName?: string;
  speakerRole?: string;
  speakerImageUrl?: string | null;
  logoImageUrl?: string | null;
  showSpeaker?: boolean;
  keyPills?: string;
  showKeyPills?: boolean;
}
`;

fs.writeFileSync('src/types.ts', types);
