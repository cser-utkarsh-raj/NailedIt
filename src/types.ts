
export type BgStyle = 'midnight' | 'crimson' | 'obsidian' | 'corporate' | 'digital' | 'emerald';
export type AspectRatio = 'og' | 'youtube' | 'reels';
export type CanvasTemplate = 'professional' | 'ethereal' | 'bohemian' | 'minimalistic' | 'youtube_bold' | 'tech_saas';

export interface PostData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  template: CanvasTemplate;
  bgStyle: BgStyle;
  aspectRatio?: AspectRatio;
  brandName: string;
  speakerName?: string;
  speakerRole?: string;
  speakerImageUrl?: string | null;
  logoImageUrl?: string | null;
  showSpeaker?: boolean;
  keyPills?: string;
  showKeyPills?: boolean;
  logoScale?: number;
  logoX?: number;
  logoY?: number;
  speakerScale?: number;
  speakerX?: number;
  speakerY?: number;
  textScale?: number;
  textX?: number;
  textY?: number;
}
export type CanvasTemplateProps = PostData;